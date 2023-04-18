const connection = require('./connection');
connection.query("create table user(id INT AUTO_INCREMENT PRIMARY KEY, fullname nvarchar(255) NOT NULL,gender tinyint(1), age INT CHECK (age > 0));", (err, result) => {
    console.log(err);
})
const user = [
    {
        "name" : "Nguyen Thi Minh Nguyet",
        "gender": 0,
        "age": 21
    },
    {
        "name" : "Nguyen Thi Minh Thanh",
        "gender": 1,
        "age": 15
    },
]
user.forEach(user => {
    connection.query(`insert into user(name, gender, age) values (?,?,?)`, [user.name, user.gender, user.age], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
})