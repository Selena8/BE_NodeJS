const express = require('express');
const connection = require('../Data/connection.js');
const validate = require('./validate.js');
const Users= express.Router();


Users.get('/', (req, res) => {
    const query = "SELECT * FROM user";
    connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
})
Users.get('/:id', (req, res) => {
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

Users.put('/:id', validate, (req, res) => {
    const id = req.params.id;
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

Users.post('/', validate, (req, res) => {
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

Users.delete('/:id', (req, res) => {
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