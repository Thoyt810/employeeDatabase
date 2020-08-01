DROP DATABASE IF EXISTS employee_database;
CREATE DATABASE employee_database;
USE employee_database;

CREATE TABLE employees (
	id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title VARCHAR(20) NOT NULL,
    department VARCHAR(20) NOT NULL,
    salary INTEGER(10) NOT NULL,
    manager VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);