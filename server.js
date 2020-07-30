const express = require("express");
const mysql = require("mysql");
const inquirer = require("inquirer")
const app = express();

var PORT = process.env.PORT || 8080;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Tomcat96!?",
  database: "wizard_schools_db"
});

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
});

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });