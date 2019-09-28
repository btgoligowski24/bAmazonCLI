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
    
SELECT * FROM products;

SELECT artist, COUNT(*) as numTimes FROM top5000 GROUP BY artist HAVING numTimes > 1;

SELECT * FROM top5000 WHERE releaseYear BETWEEN 1950 AND 1960;

SELECT 
    *
FROM
    top5000
WHERE
    artist = 'Queen';
    
    CREATE TABLE topAlbums (
	position INT NOT NULL PRIMARY KEY,
    artist VARCHAR(100) NULL,
    title VARCHAR(100) NULL,
    releaseYear INTEGER NULL,
    aggregateRating DECIMAL(10, 4) NULL,
    usRating DECIMAL(10, 4) NULL,
    ukRating DECIMAL(10, 4) NULL,
    euRating DECIMAL(10, 4) NULL,
    restWorldRating DECIMAL(10, 4) NULL
    );
    
    SELECT top5000.releaseYear as "Year: ", topAlbums.position as "Album Position: ", top5000.artist as "Artist: ", top5000.title as "Song: ", topAlbums.title as "Album: " FROM top5000 INNER JOIN topAlbums ON top5000.releaseYear = topAlbums.releaseYear AND top5000.artist = topAlbums.artist WHERE top5000.artist = "Queen" ORDER BY top5000.releaseYear, topAlbums.title;