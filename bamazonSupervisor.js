require("dotenv").config();
const mysql = require("mysql");
const credentials = require("./credentials.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = mysql.createConnection(credentials.mySQL);

connection.connect(error => {
    if (error) throw error;
});

function supervisorOptions() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Log Out"],
        name: "options"
    }]).then(answers => {
        switch (answers.options) {
            case "View Product Sales by Department":
                departmentSales();
                break;
            case "Create New Department":
                addDepartment();
                break;
            case "Log Out":
                connection.end();
                return
        }
    })
}

function departmentSales() {
    console.log();
    connection.query("SELECT d.department_id, d.department_name, d.overhead_costs, SUM(p.product_sales) AS \"product_sales\", (SUM(p.product_sales) - d.overhead_costs) AS \"total_profit\" FROM departments AS d LEFT JOIN products AS p ON p.department = d.department_name GROUP BY d.department_id ORDER BY d.department_id", (error, data) => {
        if (error) throw error;
        console.table("Profitability by Department", data);
        console.log();
        supervisorOptions();
    })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the department you are adding?",
        name: "departmentName"
    }, {
        type: "number",
        message: "How much are overhead costs for this department?",
        name: "overheadCosts"
    }]).then(answers => {
        let newDepartment = {
            department_name: answers.departmentName,
            overhead_costs: answers.overheadCosts
        }
        createDepartment(newDepartment);
    })
}

function createDepartment(newDeptObj) {
    connection.query("INSERT INTO departments SET ?", newDeptObj, (error, data) => {
        if (error) throw error;
        console.log("\nYou successfully added " + newDeptObj.department_name + " to the list of departments we have!\n");
        supervisorOptions();
    });
}

supervisorOptions();