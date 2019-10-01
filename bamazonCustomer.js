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
    connection.query("SELECT item_id, product_name, department, price, stock_quantity FROM products", (error, data) => {
        if (error) throw error;
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
        type: "input",
        message: "What product would you like to buy? (Choose using the item_id number)",
        name: "productId",
        validate: function (value) {
            if (!isNaN(value) && value > 0) {
                return true;
            }
            return "Please enter a numerical value greater than 0";
        }
    }]).then(answers => {
        validateProductSelection(answers.productId);
    })
}

function validateProductSelection(productId) {
    connection.query("SELECT * FROM products WHERE item_id = ?", productId, (error, data) => {
        if (data.length === 0) {
            console.log("\nYou must choose a valid item!\n");
            whichProduct();
        } else {
            validProductHowMany(productId);
        }
    })
}

function validProductHowMany(productId) {
    inquirer.prompt([{
        type: "input",
        message: "How many would you like to buy?",
        name: "quantity",
        validate: function (value) {
            if (!isNaN(value)) {
                if (value > 0) {
                    return true;
                }
                return "You must choose a number greater than 0";
            }
            return "Please enter a numerical value";
        }
    }]).then(answers => {
        getProductInfo(productId, answers.quantity);
    })
}

function getProductInfo(productId, quantity) {
    connection.query("SELECT item_id, stock_quantity, price FROM products WHERE item_id = ?", productId, (error, data) => {
        if (error) throw error;
        let onHandQty = data[0].stock_quantity;
        if (quantity > onHandQty) {
            console.log("\nInsufficient Quantity!!!\n");
            showProducts();
        } else {
            let newQty = onHandQty - quantity;
            updateProduct(quantity, productId, newQty, data[0].price);
        }
    })
}

function updateProduct(qty, prodId, newQty, price) {
    let cost = qty * price;
    let prodUpdates = {
        stock_quantity: newQty,
        product_sales: cost
    }
    connection.query("UPDATE products SET ? WHERE item_id = ?", [prodUpdates, prodId], (error, data) => {
        if (error) throw error;
        console.log("\nYou just paid $" + cost + " for your product(s)!\n");
        showProducts();
    })
}

showProducts();