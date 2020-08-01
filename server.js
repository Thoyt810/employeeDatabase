const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const { connect } = require("http2");
const app = express();

var PORT = process.env.PORT || 8080;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Tomcat96!?",
  database: "employee_database"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
    promptUser();
});

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});

function showEmployees() {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) {
      throw err;
    }
    console.log(res);
    promptUser();
  })
}

function byDepartment() {
  return inquirer.prompt([
    {
      type: "list",
      name: "department",
      message: "What department should we search?",
      choices: ["sales", "legal", "engineering", "finance"]
    }
  ]).then(function(answers) {
    connection.query("SELECT * FROM employees WHERE ?", [answers.department], function(err, res) {
      if (err) {
        throw err
      }
      console.log(res);
      promptUser();
    })

  })
}

function viewByManager() {
  connection.query("SELECT * FROM employee WHERE manager = Thomas", function(err, res) {
    if (err) {
      throw err;
    }
    console.log(res);
    promptUser();
  })
}

function promptUser() {
  return inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do today?",
      choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"],
    }
  ])
  .then(function(answers) {
    switch (answers.action) {
      case "View All Employees":
        showEmployees();
        break;

      case "View All Employees By Department":
        byDepartment();
        break;

      case "View All Employees By Manager":
        viewByManager();
        break;

      case "Add Employee":
        break;

      case "Remove Employee":
        break;

      case "Update Employee Role":
        break;

      case "Update Employee Manager":
        break;
    }
  })
}

