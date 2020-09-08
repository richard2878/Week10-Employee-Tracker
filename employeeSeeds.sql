DROP DATABASE IF EXISTS employeesSeedsDB;

CREATE DATABASE employeesSeedsDB;

USE employeesSeedsDB;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR (30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);
CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE allEmployeeDirectory SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ("Rodrigo", "Duterte", 1, NULL),
  ("Peter", "Hernandez", 2, NULL),
  ("Joseph", "Herbert", 3, NULL),
  ("Manny", "Paquiao", 4, NULL),
  ("Apl", "DeAp", 5, NULL),
  ("Lea", "Salonga", 2, NULL),
  ("Efren", "Reyes", 6, NULL);

INSERT INTO roles (title, salary, department_id)
VALUES 
  ("President", 99000, 1),
  ("Singer", 1000000, 2),
  ("Comedian", 1500000, 3),
  ("Boxer", 24000000, 4),
  ("Rapper", 900000, 5),
  ("Pool Player", 100000, 6);

INSERT INTO department (name)
VALUES 
  ("Government Figure"),
  ("Entertainment Figure"),
  ("Sports Figure");