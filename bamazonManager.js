require("dotenv").config();
const mysql = require("mysql");
const credentials = require("./credentials.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = mysql.createConnection(credentials.mySQL);

connection.connect(error => {
    if (error) throw error;
});

function managerOptions() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Log Out"],
        name: "options"
    }]).then(answers => {
        switch (answers.options) {
            case "View Products for Sale":
                showProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Log Out":
                connection.end();
                return
        }
    })
}

function showProducts() {
    console.log();
    connection.query("SELECT item_id, product_name, department, price, stock_quantity FROM products", (error, data) => {
        if (error) throw error;
        console.table("Products", data);
        console.log();
        managerOptions();
    });
}

function lowInventory() {
    console.log();
    connection.query("SELECT item_id, product_name, department, price, stock_quantity FROM products WHERE stock_quantity < 5", (error, data) => {
        if (error) throw error;
        console.table("Low Inventory Products", data);
        console.log();
        managerOptions();
    })
}

function addInventory() {
    inquirer.prompt([{
        type: "number",
        message: "What product would you like to add to inventory? (Choose using the item_id number)",
        name: "productId"
    }, {
        type: "number",
        message: "How many would you like to add?",
        name: "quantity"
    }]).then(answers => {
        getProductInfo(answers);
    })
}

function getProductInfo(dataObj) {
    connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id = ?", dataObj.productId, (error, data) => {
        if (error) throw error;
        if (data.length === 0) {
            console.log("Please select a valid item_id!")
            addInventory();
        } else {
            let newQty = data[0].stock_quantity + dataObj.quantity;
            updateProduct(dataObj.quantity, dataObj.productId, newQty, data[0].product_name);    
        }
    })
}

function updateProduct(qty, prodId, newQty, item) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQty, prodId], (error, data) => {
        if (error) throw error;
        console.log("\nSuccessfully added " + qty + " to " + item + "'s inventory!\n");
        managerOptions();
    })
}

function addProduct() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the product you are adding?",
        name: "productName"
    }, {
        type: "input",
        message: "What department does this item belong in?",
        name: "department"
    }, {
        type: "number",
        message: "What is the selling price of this new item?",
        name: "price"
    }, {
        type: "number",
        message: "How much initial inventory do we have of it?",
        name: "quantity"
    }]).then(answers => {
        let newProduct = {
            product_name: answers.productName,
            department: answers.department,
            price: answers.price,
            stock_quantity: answers.quantity
        }
        createProduct(newProduct);
    })
}

function createProduct(newProdObj) {
    connection.query("INSERT INTO products SET ?", newProdObj, (error, data) => {
        if (error) throw error;
        console.log("\nYou successfully added " + newProdObj.product_name + " to the list of products we sell!!!\n");
        managerOptions();
    });
}

managerOptions();