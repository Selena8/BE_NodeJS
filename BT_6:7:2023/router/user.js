// const express = require('express');
// const user_router = express.Router();

// var users = [
// 	{id: 1, name: "User1", email: "user1@gmail.com", age: 31}, 
// 	{id: 2, name: "User2", email: "user2@gmail.com", age: 20},
// 	{id: 3, name: "User1", email: "user1.2@gmail.com", age: 25}
// ];

// user_router.get('/', function(req, res){
// 	res.render('users/index',{
// 		users: users
// 	});
// })

// user_router.get('/search', (req,res) => {
// 	var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên
// 	var age_search = req.query.age // lấy giá trị của key age trong query parameters gửi lên
// 	var result = users.filter( (user) => {
// 		// tìm kiếm chuỗi name_search trong user name. 
// 		// Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
// 		return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1 && user.age === parseInt(age_search)
// 	})

// 	res.render('users/index', {
// 		users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
// 	});
// })

// user_router.get('/create', (req, res) => {
// 	res.render('users/create');
// })

// user_router.post('/create', (req, res) => {
// 	users.push(req.body);
// 	res.redirect('')
// })

// user_router.get('/:id', (req, res) => {
// 	console.log(req.params);
// 	var user = users.find( (user) => {
// 		return user.id == parseInt(req.params.id);
// 	});
// 	res.render('users/show', {
//     	user: user
//     })
// })
// // Exports cho biến user_router
// module.exports = user_router;









// const express = require('express');
// const user_router = express.Router();

// var users = [
// 	{id: 1, name: "User1", email: "user1@gmail.com", age: 31}, 
// 	{id: 2, name: "User2", email: "user2@gmail.com", age: 20},
// 	{id: 3, name: "User1", email: "user1.2@gmail.com", age: 25}
// ];

// user_router.get('/', function(req, res){
// 	res.render('users/index',{
// 		users: users
// 	});
// })

// user_router.get('/search', (req,res) => {
// 	var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên
// 	var age_search = req.query.age // lấy giá trị của key age trong query parameters gửi lên
// 	var result = users.filter( (user) => {
// 		// tìm kiếm chuỗi name_search trong user name. 
// 		// Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
// 		return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1 && user.age === parseInt(age_search)
// 	})

// 	res.render('users/index', {
// 		users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
// 	});
// })

// user_router.get('/create', (req, res) => {
// 	res.render('users/create');
// })

// user_router.post('/create', (req, res) => {
// 	users.push(req.body);
// 	res.redirect('')
// })

// user_router.get('/:id', (req, res) => {
// 	console.log(req.params);
// 	var user = users.find( (user) => {
// 		return user.id == parseInt(req.params.id);
// 	});
// 	res.render('users/show', {
//     	user: user
//     })
// })
// // Exports cho biến user_router
// module.exports = user_router;





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
router.get('/', (req, res) => {
res.status(200).json(users);
});

// Get user by id
router.get('/:id', (req, res) => {
const id = req.params.id;
const user = users.find((user) => user.id === parseInt(id));
if (!user) {
res.status(404).json({ message: 'User not found' });
} else {
res.status(200).json(user);
}
});

// Update user by id
router.put('/:id', (req, res) => {
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
router.post('/', (req, res) => {
const newUser = { id: users.length + 1, ...req.body };
users.push(newUser);
res.status(201).json(newUser);
});

// Delete user by id
router.delete('/:id', (req, res) => {
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