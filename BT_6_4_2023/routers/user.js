const val = require('../NodeApp/middleware/validate')

const express = require('express')
const user_router = express.Router();

let  users = [
    {
		"id": 1,
		"fullname": "Nguyen Huy Tuong",
		"gender": true,
		"age": 18
	},
	{
		"id": 2,
		"fullname": "Nguyen Thi Tuong",
		"gender": false,
		"age": 15
	}
]

user_router.get('/',(req, res) => {
    res.status(200).send(users)
})

user_router.post('/', val, (req, res) => {
	const user = {
        'id': users.length + 1,
        ...req.body
	}
	users.push(user)
	res.status(201).json(user)
})

user_router.put('/:id', (req, res) => {
	const user = users.find(user => user.id === parseInt(req.params.id))
	if(req.body != null){
		user.fullname = req.body.fullname
		user.gender = req.body.gender
		user.age = req.body.age
		res.status(200).json('Cap nhat thanh cong')
	} else {
		res.status(204).json('Cap nhat that bai')
	}
})

user_router.delete('/:id', (req, res) => {
	users = users.filter(item => item.id !== parseInt(req.params.id))
	res.status(200).json('Xoa thanh cong')
})

module.exports = user_router