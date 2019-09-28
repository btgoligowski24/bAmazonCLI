require("dotenv").config();
const mysql = require("mysql");
const credentials = require("./credentials.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = mysql.createConnection(credentials.mySQL);

connection.connect(error => {
    if (error) throw error;
});

connection.query("SELECT * FROM products", (error, data) => {
    console.table("Products",data);
    connection.end();
});