const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { prompts } = require("inquirer");
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
    if (err) throw err;
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
    console.table(res);
    promptUser();
  })
}

function byDepartment() {
  inquirer.prompt({
      type: "list",
      name: "department",
      message: "What department should we search?",
      choices: ["sales", "legal", "engineering", "finance"]
  })
  .then(function(answers) {
    connection.query("SELECT * FROM employees WHERE ?", { department: answers.department }, function(err, res) {
      if (err) {
        throw err
      }
      console.table(res);
      promptUser();
    })
  })
}

function viewByManager() {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
  })
  inquirer
    .prompt(
      {
        type: "input",
        name: "manager",
        message: "What manager should we search? (look above)"
      }
      ).then(function(answers) {
        connection.query("SELECT * FROM employees WHERE ?", {manager: answers.manager}, function(err, res) {
          if (err) {
            throw err;
          }
          console.log(res);
          promptUser();
        })
    })
}

function addEmployee() {
  inquirer.prompt([
    {
      type:"input",
      name: "first_name",
      message: "What is your first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is your last name?"
    },
    {
      type: "input",
      name: "title",
      message: "What Would you like your job title to be?"
    },
    {
    type: "list",
    name: "department",
    message: "What department are they working in?",
    choices: ["sales", "legal", "engineering", "finance"]
    },
    {
      type: "input",
      name: "salary", 
      message: "What would is the starting salary? (under 150,000)",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false
      },
      validate: function(value) {
        if ((value < 150000) === true) {
          return true;
        }
        return false;
      }
    },
    {
      type: "input",
      name: "manager",
      message: "Who's going to be their manager?"
    }
    ]).then(function(answers) {
        connection.query("INSERT INTO employees SET ?", [answers] , function(err, res) {
          if (err) {
            throw err
          }
          console.log("New Employee Added!");
          promptUser();
  });
  });
}

function removeEmployee () {
  connection.query("SELECT * FROM employees", function(err,data) {
    if (err) throw err;
    console.table(data); 
    inquirer
      .prompt(
        {
          type: "input",
          name: "first_name",
          message: "Which employee are we removing?"
        }
      ).then(function(answers) {
        connection.query("DELETE FROM employees WHERE ?", { first_name: answers.first_name }, function(err, res) {
          if (err) {
            throw err;
          }
          console.log("Fired their ass!");
          promptUser();
        });
      });
  });
}

function updateEmployee () {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
  })
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Which employee are you changing their job title? (look above)"
        },
        {
          type: "input",
          name: "title",
          message: "What is their new job title?"
        }
        ]).then(function(answers) {
          connection.query("UPDATE employees SET title = ? WHERE first_name = ?", [ title = answers.title, first_name = answers.first_name ], function(err, res) {
            if (err) {
              throw err
            }
            console.log("Employee title Updated");
            promptUser();
          })
        })
}

function updateManager () {
  connection.query("SELECT * FROM employees", function (err, res) {
    if (err) {
      throw err;
    }
    console.table(res);
  })
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Which employee's manager are you changing? (look above)"
        },
        {
          type: "input",
          name: "manager",
          message: "Who is their new manager?"
        }
        ]).then(function(answers) {
          connection.query("UPDATE employees SET manager = ? WHERE first_name = ?", [ manager = answers.manager, first_name = answers.first_name ], function(err, res) {
            if (err) {
              throw err
            }
            console.log("Employee title Updated");
            promptUser();
          })
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
        addEmployee();
        break;

      case "Remove Employee":
        removeEmployee();
        break;

      case "Update Employee Role":
        updateEmployee();
        break;

      case "Update Employee Manager":
        updateManager();
        break;
    };
  });
}

