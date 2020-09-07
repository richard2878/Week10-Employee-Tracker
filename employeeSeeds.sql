DROP DATABASE IF EXISTS employeesSeedsDB;

CREATE DATABASE employeesSeedsDB;

USE employeesSeedsDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NULL,
  last_name DECIMAL(10,2) NULL,
  role_id INT NOT NULL,
  manager-id INT
  PRIMARY KEY (id)
);

INSERT INTO products (flavor, price, quantity)
VALUES ("vanilla", 2.50, 100);

INSERT INTO products (flavor, price, quantity)
VALUES ("chocolate", 3.10, 120);

INSERT INTO products (flavor, price, quantity)
VALUES ("strawberry", 3.25, 75);