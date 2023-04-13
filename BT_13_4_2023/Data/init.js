const connection = require('./connection');

//Create User table
const createUserTable = () => {
    connection.query(
      "CREATE TABLE User (id INT AUTO_INCREMENT, fullname varchar(255) NOT NULL, gender boolean, age INT NOT NULL, PRIMARY KEY(id))",
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );

};

// Insert new user
const insertUser = (fullname, gender, age) => {

    connection.query(
      "INSERT INTO User(fullname, gender, age) VALUES (?, ?, ?)",
      [fullname, gender, age],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );

};

// Get all users
const getUsers = () => {

    connection.query("SELECT * FROM User", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });

};

// Get user by id
const getUserById = (id) => {

    connection.query("SELECT * FROM User WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });

};

// Update user by id
const updateUserById = (id, fullname) => {

    connection.query(
      "UPDATE User SET fullname = ? WHERE id = ?",
      [fullname, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );

};

// Delete user by id
const deleteUserById = (id) => {

    connection.query("DELETE FROM User WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });

};




// Example usage
  createUserTable();
  insertUser("Nguyen Huy Tuong", true, 18);
  insertUser("Nguyen Thi Tuong", false, 15);
  getUsers();

  getUserById(1);

  deleteUserById(3);





