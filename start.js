var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable =require("console.table")

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "14Robins@1",
  database: "employeesSeedsDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

const questions = [
    {
        name:"userResponse",
        type:"rawlist",
        message: "What would you like to do",
        loop:false,
        choices:[
            "View Employee Directory",
            "View Employee by Last Name",
            "View Employees by Department",
            "View Employees by Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Exit",
        ]
    }
]

function start() {
    inquirer.prompt(questions)
    .then(function(response){
        switch (response.userResponse){
        case "View Employee Directory":
            viewEmployeeDirectory();
            break;
        case "View Employee by Last Name":
            viewEmployee();
            break;
        case "View Employee by Department":
            viewEmployeeByDepartment();
            break;    
        case "View Employee by Manager":
            viewEmployeeByManager();
            break; 
        case "Add Employee":
            addEmployee();
            break; 
        case "Remove Employee":
            removeEmployee();
            break;
        case "Update Employee":
            UpdateEmployee();
            break;
        case "Update Employee Role":
            UpdateEmployeeRole();
            break;
        case "Exit":
            connection.end();
            break;
        }
    })
}
function viewEmployeeDirectory() {
    var allQuery = "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id =department.id"
    connection.query(allQuery,function(err, res){
        if(err) throw err;
        console.table(res);
        start()
    })
}

function viewEmployee() {
    inquirer
        .prompt({
            name: "viewEmployee",
            type: "input",
            message: "What is the employee's last name?"
        })
        .then(function (answer) {
            var query ="SELECT first_name, last_name, id FROM employee WHERE ?";
            connection.query(query, { last_name: answer.viewEmployee}, function (err, res) {
                for(var i = 0; i < res.length; i++) {
                    console.log("First Name: " + res[i].first_name + " || Last name: " + res[i].last_name + " || Id: " + res[i].id );
                }
            })
        })
        
    
}