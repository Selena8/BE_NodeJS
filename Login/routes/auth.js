const express = require('express')
const db = require('../database/connection')
const { getOne, create } = require('../database/query')
const {hashPassword} = require('../helpers/hash')
const {validateUser, validateRequest} = require('../middleware/validateUser')
const {hashPasswordWithSalt} = require('../helpers/hash')
const {mailService } = require('../services/mail.service')
const crypto = require('crypto')

const router = express.Router()

const jsonwebtoken= require('jsonwebtoken')

router.post('/register', validateUser, async (req, res) => {
    const {
        username,
        password,
        confirmPassword,
        name,
        age,
        gender,
        email
    } = req.body
    const isUserExisted = await getOne({
        db,
        query: "SELECT * FROM users WHERE username = ?",
        params: username
    })
    if(isUserExisted) {
        return res.status(400).json( {
            message: 'Username already exists'
        })
    }

    const {
        salt,
        hashedPassword,
    } = hashPassword(password)
    const isUserCreated = await create({
        db,
        query: "INSERT INTO users (username, password, salt, name, email, age, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
        params: [
            username,
            hashedPassword,
            salt,
            name,
            email,
            age,
            gender
        ]
    })
    
    if(isUserCreated) {
        return res.status(200).json({
            message: 'Register successfully'
        })
    }
    return res.status(500).json({
        message: 'Internal server error'
    })
})




router.post('/login', validateRequest, async function (req, res) {
    const SECRET= process.env.SECRET
    // Get username, password from request body
    const {
        username,
        password, 
    } = req.body
    // Check if user exists
    const isUserExisted = await getOne( {
        db,
        query: 'SELECT * FROM users WHERE username = ?',
        params: username
    })
    if(!isUserExisted) {
        return res.status(400).json( {
            message: 'User not found',
        })
    }
    else {
        const salt = isUserExisted.salt
        const password_db = isUserExisted.password
        const hashedPassword = hashPasswordWithSalt(password, salt)
        console.log(password, salt)
        if(password_db == hashedPassword) {
            const jwt = jsonwebtoken.sign({
                username: isUserExisted.username,
                name: isUserExisted.name, 
                age: isUserExisted.age, 
                gender: isUserExisted.gender,
                email: isUserExisted.email
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


router.post('/reset', async function (req, res){
    try {
        const{
            emailFrom, 
            emailTo, 
            emailSubject, 
            emailText
        } = req.body
        console.log( emailFrom)
        console.log( emailTo)
        console.log( emailSubject)
        console.log( emailText)
        let info = await mailService.sendEmail({emailFrom,emailTo,emailSubject,emailText})
    
        return res.status(200).json({
          message: 'reset password email sent successfully',
        });
      } catch (error) {
        return res.status(500).json({
          message: 'error',
        });
      }
});


router.post('/forgot_password', async (req, res) => {
    const {email} = req.body
    console.log(email)
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
        const updateDB = await db.query(
            "UPDATE USERS SET passwordResetToken = ?, passwordResetExpiration = ? WHERE email = ?",
            [passwordResetToken, passwordResetExpiration, email]
        );
        if(!updateDB)  
        {
            return res.status(500).json({ message: "Failed to update database" });
        }
        else {
            try {
                const emailFrom = "nguyetdethuong982002@gmail.com";
                const emailTo = email;
                const emailSubject = "Password Reset Request";
                const emailText = `Your password reset token is: ${passwordResetToken}. It will expire on ${passwordResetExpiration}.`;
                let info = await mailService.sendEmail({emailFrom,emailTo,emailSubject,emailText})
            
                return res.status(200).json({
                message: 'Email sent successfully',
                });
            } 
            catch (error) {
                return res.status(500).json({
                    message: 'Failed to send email',
                });
            }
                }
            }
})

router.post('/reset_password', async (req, res) => {
    const {
        email,
        passwordResetToken,
        newpassword
    } = req.body
    console.log(email)
    console.log(passwordResetToken)
    console.log(newpassword)
    const user = await getOne({
        db,
        query: 'SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration <= ?',
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
        const updateDB = await db.query(
            "UPDATE users SET password = ?, salt = ?, passwordResetToken = null, passwordResetExpiration = null, passwordLastResetDate = ? where email = ?",
            [hashedPassword, salt, new Date(), email]
        );
        if(updateDB) {
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



