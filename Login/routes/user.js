const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const db = require('../database/connection');
const {validateUserUpdate } = require('../middleware/validateUser')
const { update } = require('../database/query')
router.put('/:id', validateUserUpdate, async function (req, res, next) {
    const secret = process.env.SECRET
    const id = req.params.id
    const {name, age, gender} = req.body
    const authorizationHeader = req.headers.authorization
    const userToken = authorizationHeader.substring(7)
    try {
        const isTokenValid = jwt.verify(userToken, secret);
        if (isTokenValid.id == id) {
            const check = await update({
                db,
                query: "UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?",
                params: [
                    name,
                    age,
                    gender,
                    id
                ]
            })

            if(!check){
               return res.status(500).json("Error : Can't update data")
            }
            return res.status(200).json({
                message: "Update successfull"
            })
        }
        return res.status(401).json({
            message: 'unauthorized',
        });

    } catch (error) {
        return res.status(401).json({
            message: error.message,
        });
    }

});

module.exports = router;