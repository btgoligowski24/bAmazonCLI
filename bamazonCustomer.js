require("dotenv").config();
let mysql = require("mysql");
let credentials = require("./credentials.js");
let inquirer = require("inquirer");

let connection = mysql.createConnection(credentials.mySQL);

connection.connect(error => {
    if (error) throw error;
});

connection.query("SELECT * FROM products", (error, data) => {
    console.log(data);
    connection.end();
});