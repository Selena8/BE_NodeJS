const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "nguyet982002",
  database: "nodejs",
});

module.exports = connection;