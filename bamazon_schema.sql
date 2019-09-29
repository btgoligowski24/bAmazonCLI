DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    department VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) DEFAULT "0.01",
    stock_quantity INT DEFAULT "0"    
    );
    
ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10, 2) NULL DEFAULT "0.00";
    
CREATE TABLE departments (
department_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
department_name VARCHAR(50) NOT NULL,
overhead_costs DECIMAL(10,2) NOT NULL DEFAULT "10.00"
); 
    
SELECT * FROM products;

SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5;

SELECT * FROM departments;

SELECT d.department_id, d.department_name, d.overhead_costs, SUM(p.product_sales) AS "product_sales", (SUM(p.product_sales) - d.overhead_costs) AS "total_profit" FROM departments AS d LEFT JOIN products AS p ON p.department = d.department_name GROUP BY d.department_id ORDER BY d.department_id;
