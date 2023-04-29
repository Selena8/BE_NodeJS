const express = require('express')
const db = require('../database/connection')
const { getOne, create } = require('../database/query')
const {hashPassword} = require('../helpers/hash')
const {validateUser, validateRequest} = require('../middleware/validateUser')
const {hashPasswordWithSalt} = require('../helpers/hash')

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



module.exports = router



