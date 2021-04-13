const inquirer = require('inquirer');
const connectDb = require('./utlis/databaseConnection');
const cTable = require('console.table');
const {queries} = require('./utlis/queries');


const roles = [];
const rolesTitle = [];
const rolesQuery = connectDb.getQuery(queries.roles, function(result){
    result.forEach(function(item, index){
        roles.push(item);
        rolesTitle.push(item.title);
    })
});

const managers = [];
const managersName = [];
const managerQuery = connectDb.getQuery(queries.getAllManagers, function(result){
    result.forEach(function(item, index){
        managers.push(item);
        let manager = Object.values(item).join(' ')
        managersName.push(manager)
    })
})


const employees = [];
const employeesName = [];
const employeeQuery = connectDb.getQuery(queries.allEmployees, function(result){
    result.forEach(function(item, index){
        employees.push(item);
        let employee = Object.values(`${item.first_name} ${item.last_name}`).join('')
        employeesName.push(employee)
        
    })
    
})


const initQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'response',
        choices: ['View All Employees', 'View Employees by department', 'View Employees by Manager', 'Add Employee', 'Remove Employee', 'View All Roles', 'Add role', 'Remove role', 'Update Employee Role', 'View Departments', 'Remove Department', 'Quit']

    },
];

const addEmployeeQuestions = [
    {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstName'
    },
    {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastName'
    },
    {
        type: 'list',
        message: "Select employee's role:",
        name: 'role',
        choices: rolesTitle
    },
];

const selectManagerQuest = [
    {
        type: 'list',
        message: 'Select Manager',
        name: 'manager',
        choices: managersName
    
    },
];

const selectEmployeeQuest = [
    {
        type: 'list',
        message: 'Select Employee to Remove',
        name: 'employee',
        choices: employeesName
    }
]

async function start(){
    inquirer.prompt(initQuestion).then(async res => {
        switch(res.response){

            case 'View All Employees':
                connectDb.getQuery(queries.allEmployees, function(result){
                    displayResults(result);
                });
                break;

            case 'View Employees by department':
                connectDb.getQuery(queries.employByDepart, function(result){
                    displayResults(result);
                });
                break;

            case 'View Employees by Manager':
                console.log('Selected View Employees by Manager');
                selectManager();
                break;

            case 'Add Employee':
                console.log('Selected Add Employee');
                addEmployee();
                break;

            case 'Remove Employee':
                console.log('Selected Remove Employee');
                selectEmployeeRemove();
                break;

            case 'Update Employee Role':
                selectEmployee();
                break;
            case 'View All Roles':
                connectDb.getQuery(queries.viewAllRoles, function(result){
                    displayResults(result);
                });
                break;

            case 'Add role':
                console.log('Selected Add role');
                break;

            case 'Remove role':
                console.log('Selected Remove role');
                break;
            
            case 'View Departments':
                connectDb.getQuery(queries.viewAllRoles, function(result){
                    displayResults(result);
                });
                break;

            case 'Remove Department':
                console.log('Selected Remove Department');
                break;

            case 'Quit':
                connectDb.quit();

           

        };
    });
};

async function addEmployee(){
    await inquirer.prompt(addEmployeeQuestions).then(async res => {
       
        let role_id = '';
        await checkRoleMatch(res, function(result){
            role_id = result;
            return role_id;
        });
        // adds entered results to employee database
        await connectDb.getQuery(`${queries.addEmployee} ("${role_id}", "${res.firstName}", "${res.lastName}");`, function(err, result){
            console.log('--------------');
            console.log("Employee Added!");
            console.log('--------------');
            start();
        });
    });
};

// checks role selected against roles in array to get role_id
function checkRoleMatch(res, callback){
    roles.forEach(function(item, index){
        if (item.title === res.role){
            let role_id = item.role_id;
            return callback(role_id);
        } ;
    });
};

function checkEmployeeMatch(employee, callback){
    employees.forEach(function(item, index){
        if (`${item.first_name} ${item.last_name}` == employee.employee){
            let employ_id = item.employ_id
            return callback(employ_id)
        };
    });
};

function displayResults(resp){
    console.table(resp);
    start();
};


async function selectManager(){
    await inquirer.prompt(selectManagerQuest).then(res => {
        console.log("SUCCESS SELECTED MANAGER", res)
    })
}

async function selectEmployeeRemove(){
    await inquirer.prompt(selectEmployeeQuest).then(res => {
        // let employ_id = ''
        checkEmployeeMatch(res, function(result){
            let employ_id = result;
            removeEmployee(employ_id);
            //return employ_id;
        });
        
    })
}

async function selectEmployee(){
    await inquirer.prompt(selectEmployeeQuest).then(res => {
        // let employ_id = ''
        checkEmployeeMatch(res, function(result){
            let employ_id = result;
            selectEmployeeRole(employ_id);
            //return employ_id;
        });
        
    })
}

async function selectEmployeeRole(employ_id){
    await inquirer.prompt(
        {
            type: 'list',
            message: 'Select Role:',
            name: 'role',
            choices: rolesTitle
        }
    ).then(async res => {

        let role_id = '';
        await checkRoleMatch(res, function(result){
            role_id = result;
            return role_id;
        });
        updateEmployeeRole(employ_id, role_id);
    })
}

async function updateEmployeeRole(employ_id, role_id){
    
    await connectDb.getQuery(`UPDATE employee SET role_id = ${role_id} WHERE employ_id = ${employ_id}`, function(err, result){
        console.log('--------------');
        console.log("Employee Updated!");
        console.log('--------------');
        start();
    });



}

async function removeEmployee(employ_id, ){
    console.log(employ_id)
    connectDb.getQuery(`${queries.removeEmployee} ${employ_id}`, function(result){
    console.log('--------------');
    console.log("Employee Removed!");
    console.log('--------------');
    start();
    });
}


function init(){
    start();
};

init();

module.exports = {
    init,
    start

};