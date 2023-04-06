const { validateUser } = require('../middleware/validateUser');

const express = require('express');
const router = express.Router();

let users = [
{
id: 1,
fullname: 'Nguyen Huy Tuong',
gender: true,
age: 18,
},
{
id: 2,
fullname: 'Nguyen Thi Tuong',
gender: false,
age: 15,
},
];

// Get all users
router.get('/',validateUser, (req, res) => {
res.status(200).json(users);
});

// Get user by id
router.get('/:id', validateUser,(req, res) => {
const id = req.params.id;
const user = users.find((user) => user.id === parseInt(id));
if (!user) {
res.status(404).json({ message: 'User not found' });
} else {
res.status(200).json(user);
}
});

// Update user by id
router.put('/:id', validateUser,(req, res) => {
const id = req.params.id;
const index = users.findIndex((user) => user.id === parseInt(id));
if (index === -1) {
res.status(404).json({ message: 'User not found' });
} else {
users[index] = { ...users[index], ...req.body };
res.status(204).send();
}
});

// Add new user
router.post('/',validateUser, (req, res) => {
const newUser = { id: users.length + 1, ...req.body };
users.push(newUser);
res.status(201).json(newUser);
});

// Delete user by id
router.delete('/:id',validateUser, (req, res) => {
const id = req.params.id;
const index = users.findIndex((user) => user.id === parseInt(id));
if (index === -1) {
res.status(404).json({ message: 'User not found' });
} else {
users.splice(index, 1);
res.status(204).send();
}
});


module.exports = router;