const mysql = require("mysql");

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Put your MySQL password here if it's not empty
    database: 'signup'
});

con.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the database");
    }
});

module.exports = con;