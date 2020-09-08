var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable =require("console.table");
const { connect } = require("http2");

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
        type:"list",
        message: "What would you like to do",
        loop:false,
        choices:[
            "View Employee Directory",
            "View Employee by Last Name",
            "View Employees by Department",
            "View Employee Managers",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
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
        case "View Employees by Department":
            viewEmployeeByDepartment();
            break;    
        case "View Employee Managers":
            viewEmployeeManagers();
            break; 
        case "Add Employee":
            addEmployee();
            break; 
        case "Remove Employee":
            removeEmployee();
            break;
        case "Update Employee Role":
            updateEmployeeRole();
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
                start();
                
            })
            
        })                
}
function viewEmployeeByDepartment(){
    inquirer.prompt([
        {
            type:"input",
            message: "Which Department Employees would you like to view?",
            name: "departmentView"
        }
    ]).then(function(response){
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.name FROM employee LEFT JOIN roles on employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id WHERE department.name=?",[response.departmentView],function(err,res){
            if(err) throw err;

            console.table(res);
            start();
    })   
    });
}
function viewEmployeeManagers(){
    var query = "SELECT id, first_name, last_name FROM employee WHERE id IN (SELECT manager_id FROM employee WHERE manager_id IS NOT NULL)";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].first_name + " " + res[i].last_name + " || Id: " + res[i].id)
        }
        start();
    })
}
function getRoles() {
    return new Promise(function (resolve, reject) {
      connection.query("SELECT roles.title FROM roles", function (err, res) {
        if (err) throw err;
        const allRoles = res.map(role => role.title)

        resolve(allRoles);
      });
    });
}

async function addEmployee(){
    try{
    var totalRoles = await getRoles();
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new employee's first name?",
            name: "firstName"
        },
        {
            type:"input",
            message: "What is the new employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is his/her role?",
            name:"role",
            choices: totalRoles
        },
        {
            type:"list",
            message: "Who is the manager?",
            name:"manager",
            choices: ["Rodrigo", "Imelda", "None"]
        }
    ]).then(function(response){
        var roleName = response.role;
        var managerID;
        switch (response.manager){
            case "Rodrigo":
            managerID=1;
            break;
            case "Imelda":
            managerID=8;
            break;
            default:
            managerID="null";
            break;
        }
    
    connection.query("SELECT roles.id, roles.title FROM roles WHERE roles.title=?",[roleName],function(err,res){
        if (err) throw (err);
        roleName = res[0].id         
    
    connection.query("INSERT INTO employee SET ?",  
    {
        first_name : response.firstName,
        last_name : response.lastName,
        role_id: roleName,
        manager_id: managerID
    }, 
    function(error,response){ 
        if(error)
          throw(error)
    
        console.log("New Employee Added\n");
        start();
      })
    })      
    })
} catch (err){
    console.log(err)
}
}
function removeEmployee () {
    connection.query("SELECT first_name, last_name FROM employee",function(err,res){
        if (err) throw err;
        const employeeWholeName = res.map(employee => employee.first_name + " " + employee.last_name);
        inquirer.prompt([
            {
                name: "deletedEmployee",
                type:"list",
                message:"Which employee would you like to remove?",
                choices: employeeWholeName,
                loop:false,
            }
        ]).then(function(result){
            var deleteChoice = result.deletedEmployee.split(' ');
            connection.query("DELETE FROM employee WHERE ? AND ?",[{
                first_name: deleteChoice[0]},{
                last_name: deleteChoice[1]
            }],function(err,res){
                if (err) console.log(err);
                console.log("Employee Removed.");
                start();
            })
        })
    })
}
async function updateEmployeeRole() {
    try{
    var totalRoles = await getRoles();
    connection.query("SELECT first_name, last_name FROM employee",function(err,res){
        if (err) throw err;
        const employeeWholeName = res.map(employee => employee.first_name + " " + employee.last_name);
        inquirer.prompt([
            {
                type:"list",
                message:"Which employee would you like to update?",
                name: "employee",
                choices: employeeWholeName
            },
            {
                type:"list",
                message: "What is this employee's new role?",
                name: "newRole",
                choices: totalRoles
            }
        ]).then(function(response){
            var chosenEmployee = response.employee.split(' ');
            console.log(chosenEmployee);
            connection.query("UPDATE employee INNER JOIN roles ON employee.role_id = roles.id SET roles.title = ? WHERE ? AND ?",[response.newRole,{first_name: chosenEmployee[0]},{last_name: chosenEmployee[1]}],function(err,res){
                if(err) throw err;
                console.log("Employee Updated.")
                start();
            })
        })
    })
} catch(err){
    console.log(err);
}
}