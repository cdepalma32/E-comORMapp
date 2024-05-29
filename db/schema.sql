-- Drops the ecommerce_db if it exists
DROP DATABASE IF EXISTS ecommerce_db;

-- Creates the ecommerce_db database
CREATE DATABASE ecommerce_db;

-- Uses the ecommerce_db database
USE ecommerce_db;

-- Create the category table
CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL
);

-- Create the tag table
CREATE TABLE tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(255) NOT NULL
);

-- Create the product table
CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

-- Create the product_tag table
CREATE TABLE product_tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  tag_id INT,
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (tag_id) REFERENCES tag(id)
);
