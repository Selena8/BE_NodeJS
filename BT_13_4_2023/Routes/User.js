const express = require('express');
const connection = require('../Data/connection.js');
const validate = require('./validate.js');
const user_router = express.Router();


user_router.get('/', (req, res) => {
    const query = "SELECT * FROM user";
    connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
})
user_router.get('/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM user WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
})

user_router.put('/:id', validate, (req, res) => {
    const id = req.params.id;
    //destructuring
    const {fullname, gender, age} = req.body;
    const query = 'UPDATE user SET fullname = ?, gender = ?, age = ? WHERE id = ?';
    connection.query(query, [fullname, gender, age, id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
})

user_router.post('/', validate, (req, res) => {
    const {fullname, gender, age} = req.body;
    const query = 'INSERT INTO user (fullname, gender, age) VALUES(?, ?, ?)';
    connection.query(query, [fullname, gender, age], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
})

user_router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM user WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
})