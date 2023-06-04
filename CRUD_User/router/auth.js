const express = require('express');
const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const { validateUserRegister } = require('../middleware/validate_User')
const validateRequest = require('../middleware/validate_Request')
const db = require('../database/connection')
const {getOne, create, update} = require('../database/query')
const {hashPassword, hashPasswordWithSalt} = require('../helpers/hash')
const {mailService} = require('../services/mail.service');

const router = express.Router()

const SECRET = "secret"

// register
router.post('/register', validateRequest, validateUserRegister, async (req, res) => {
    const {
        hashedPassword,
        salt
    } = hashPassword(req.body.password)
    const user = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        gender: req.body.gender,
        name: req.body.name,
        age: req.body.age,
        salt: salt,
        createAt: new Date(Date.now()),
        isAdmin: req.body.isAdmin
    }
    const isUserExisted = await db.select().from('users').where('username', req.body.username).first()
    if(isUserExisted) {
        return res.status(400).json( {
            message: 'Username already exists'
        })
    }
    // console.log(hashedPassword);
    await db.insert(user).into('users')
    return res.status(200).json({
        message: 'Register successfully'
    })
})

// Login
router.post('/login', validateRequest, async function (req, res) {
    // Get username, password from request body
    const {
        username,
        password, 
    } = req.body
    // Check if user exists
    const isUserExisted = await db.select('*').from('users').where('username', username).first()
    if(!isUserExisted) {
        return res.status(400).json( {
            message: 'User not found',
        })
    }
    else {
        const salt = isUserExisted.salt
        const password_db = isUserExisted.password
        const hashedPassword = hashPasswordWithSalt(password, salt)
        if(password_db == hashedPassword) {
            const jwt = jsonwebtoken.sign({
                id: isUserExisted.id,
                username: isUserExisted.username,
                name: isUserExisted.name, 
                email: isUserExisted.email,
                isAdmin: isUserExisted.isAdmin
            }, SECRET, {
                algorithm: 'HS256',
                expiresIn: '1h',
            })
            return res.status(200).json({ 
                data: jwt,
                message: "Login successful"
            })
        }
        else {
            return res.status(400).json( {
                message: 'Invalid password',
            })
        }
    }
});

// Send mail
router.post('/test', async (req, res) => {
    try {
        const {
            fromEmail,
            toEmail,
            subjectEmail,
            textEmail 
        } = req.body
        await mailService.sendEmail({
            fromEmail: fromEmail, 
            toEmail: toEmail, 
            subjectEmail: subjectEmail, 
            textEmail: textEmail})
        return res.status(200).json({
            "message": "reset password email sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            "message": "error sending email"
        })
    }
})

// ForgetPass
router.post('/forgot-password', async (req, res) => {
    const email = req.query.email
    const isEmailExist = await getOne( {
        db,
        query: 'SELECT * FROM users WHERE email = ?',
        params: [email]
    })
    if(!isEmailExist) {
        return res.status(400).json( {
            message: 'Email not found',
        })
    }
    else {
        const passwordResetToken = crypto.randomBytes(16).toString('hex');
        const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000)
        const updateDB = await update({
            db,
            query:'UPDATE USERS SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?',
            params: [passwordResetToken, passwordResetExpiration, email],
        });
        if(updateDB) {
            try {
                const textEmail = `
                    passwordResetToken: ${passwordResetToken},
                    passwordResetExpiration: ${passwordResetExpiration}
                `
                await mailService.sendEmail({
                    fromEmail: "duthinhodut@gmail.com", 
                    toEmail: email, 
                    subjectEmail: "RESET PASSWORD", 
                    textEmail: textEmail})
                return res.status(200).json({
                    "message": "reset password email sent successfully"
                })
            } catch (error) {
                return res.status(500).json({
                    "message": "error sending email"
                })
            }
        }
        else {
            return res.status(400).json({
                "message": "cannot update"
            })
        }
    }
})

// reset pass
router.post('/reset-password', async (req, res) => {
    const {
        email,
        passwordResetToken,
        newpassword
    } = req.query
    const user = await getOne({
        db,
        query: 'SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ?',
        params: [email, passwordResetToken, new Date(Date.now())],
    });
    if(!user) {
        return res.status(400).json( {
            message: 'User not found',
        })
    }
    else {
        const {
            hashedPassword,
            salt
        } = hashPassword(newpassword)
        console.log(hashedPassword);
        const updateStatus = await update({
            db,
            query:
              'UPDATE users SET password = ?, salt = ?, passwordResetToken = null, passwordResetExpiration = null, passwordLastResetDate = ? where email = ?',
            params: [hashedPassword, salt, new Date(), email],
        });
        if(updateStatus) {
            return res.status(200).json({
                "message": "update successfully"
            })
        }
        else {
            return res.status(400).json({
                "message": "cannot update"
            })
        }
    }
})

module.exports = router