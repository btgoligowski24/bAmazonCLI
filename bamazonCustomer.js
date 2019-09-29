require("dotenv").config();
const mysql = require("mysql");
const credentials = require("./credentials.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = mysql.createConnection(credentials.mySQL);

connection.connect(error => {
    if (error) throw error;
});

function showProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", (error, data) => {
        console.table("Products", data);
        console.log();
        doWhat();
    });
}

function doWhat() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["Buy something", "Just browsing"],
        name: "choice"
    }]).then(answers => {
        switch (answers.choice) {
            case "Buy something":
                whichProduct();
                break;
            case "Just browsing":
                connection.end();
                return
        }
    })
}

function whichProduct() {
    inquirer.prompt([{
        type: "number",
        message: "What product would you like to buy? (Choose using the item_id number)",
        name: "productId"
    }, {
        type: "number",
        message: "How many would you like to buy?",
        name: "quantity"
    }]).then(answers => {
        getProductInfo(answers);
    })
}

function getProductInfo(dataObj) {
    connection.query("SELECT stock_quantity, price FROM products WHERE item_id = ?", dataObj.productId, (error, data) => {
        if (error) throw error;
        let onHandQty = data[0].stock_quantity;
        if (dataObj.quantity > onHandQty) {
            console.log("\nInsufficient Quantity!!!\n");
            showProducts();
        } else {
            let newQty = onHandQty - dataObj.quantity;
            updateProduct(dataObj.quantity, dataObj.productId, newQty, data[0].price);
        }
    })
}

function updateProduct(qty, prodId, newQty, price) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQty, prodId], (error, data) => {
        if (error) throw error;
        let cost = qty * price;
        console.log("\nYou just paid $" + cost + " for your product(s)!\n");
        showProducts();
    })
}

showProducts();