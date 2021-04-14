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

const departments = [];
const departmentName = [];
const departmentQuery = connectDb.getQuery(queries.viewAllDepartments, function(result){
    result.forEach(function(item, index){
        departments.push(item);
        let department = item.depart_name;
        departmentName.push(department);
        
    }) 
})


const initQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'response',
        choices: ['View All Employees', 'View Employees by department', 'View Employees by Manager', 'Add Employee', 'Update Employee Role', 'Remove Employee', 'View All Roles', 'Add role', 'Remove role', 'View Departments', 'Add Department', 'Remove Department', 'Quit']

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
];

const addRoleDepartQuestions = [
    {
        type:'list',
        message: 'Select Department you wish to add a role to:',
        name: 'selectedDepart',
        choices: departmentName
    }
];

const addRoleQuestions = [
    {
        type: 'input',
        message: 'Enter Role Name:',
        name: 'roleName'
    },
    {
        type: 'input',
        message: 'Enter Salary',
        name: 'salary'
    },
    {
        type: 'confirm',
        message: 'Is this a Manager Role?',
        name: 'isManager'
    }
];

const removeRoleQuest = [
    {
        type: 'list',
        message: 'Select Role to Remove:',
        name: 'roleRemove',
        choices: rolesTitle
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
                selectDepartment();
                break;

            case 'Remove role':
                console.log('Selected Remove role');
                selectRoleToRemove();
                break;
            
            case 'View Departments':
                connectDb.getQuery(queries.viewAllDepartments, function(result){
                    displayResults(result);
                });
                break;
            case 'Add Department':
                addDepartmentQuest();
                break;
            case 'Remove Department':
                removeDepartQuest();
                break;

            case 'Quit':
                connectDb.quit();
        };
    });
};


async function removeDepartQuest(){
    await inquirer.prompt({
        type: 'list',
        message: 'Select Department to Remove:',
        name: 'removeDepartment',
        choices: departmentName
    }).then( async (res) => {
        await checkDepartMatchRemove(res, function(result){
            let depart_id = result;
            removeDepartment(depart_id);
        })
    })
}

async function removeDepartment(depart_id){
    await connectDb.getQuery(`${queries.removeDepart} ${depart_id}`, function(result){
        console.log('--------------');
        console.log("Department Removed!");
        console.log('--------------');
        start();
        });
}


function checkDepartMatchRemove(res, callback){
    departments.forEach(function(item, index){
        if (item.depart_name == res.removeDepartment){
            let depart_id = item.depart_id;
            return callback(depart_id);
        } ;
    });
};

async function addDepartmentQuest(){
    await inquirer.prompt({
        type: 'input',
        message: 'Enter New Department Name',
        name: 'newDepartment'
    }).then( async (res) => {
        await connectDb.getQuery(queries.getLastDepartId, function(result){
            let lastDepartId = result[0];
            let newDepartName = res;
            addDepartment(lastDepartId, newDepartName)

        })
    })
}

async function addDepartment(depart_id, depart_name){
    departId = depart_id.depart_id + 1000;
    await connectDb.getQuery(`${queries.addDepartment} (${departId}, "${depart_name.newDepartment}");` , function(result){
        console.log('--------------');
        console.log("Department Added!");
        console.log('--------------');
        start();
    })
}


async function selectRoleToRemove(){
    await inquirer.prompt(removeRoleQuest).then(async (res) => { 
        await checkRoleMatchRemove(res, function(result){
            let role_id = result;
            removeRole(role_id)
        });
    })
}

async function removeRole(role_id){
    await connectDb.getQuery(`${queries.removeRole} ${role_id}`, function(result){
        console.log('--------------');
        console.log("Role Removed!");
        console.log('--------------');
        start();
        });
}

function checkRoleMatchRemove(res, callback){
    roles.forEach(function(item, index){
        if (item.title === res.roleRemove){
            let role_id = item.role_id;
            return callback(role_id);
        } ;
    });
};

async function selectDepartment(){
    await inquirer.prompt(addRoleDepartQuestions).then(async res => {
        let depart_id = '';
        await checkDepartMatch(res, function(result){
            depart_id = result;
            return depart_id;
        })
       getLastRoleId(depart_id);
    })
};

async function getLastRoleId(depart_id){
    await connectDb.getQuery(queries.getLastRoleId, function(result){
        lastRoleId = result[0];
        addRole(lastRoleId, depart_id)  
    });
}

async function addRole(lastRoleId, depart_id){
    const res = await inquirer.prompt(addRoleQuestions).then(res => res)
    let role_id = lastRoleId.role_id + 1010;
    
    console.log(role_id);
    console.log(res.isManager)
    await connectDb.getQuery(`${queries.addRole} ("${role_id}", "${res.roleName}", "${res.salary}","${depart_id}", ${res.isManager});`, function(err, result){
        console.log('--------------');
        console.log("Role Added!");
        console.log('--------------');
        start();
    });

}



function checkDepartMatch(res, callback){
    departments.forEach(function(item, index){  
        if (item.depart_name == res.selectedDepart){
            let depart_id = item.depart_id;
            return callback(depart_id);
        } ;
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

// checks selected employee against employees in array to get employ_id
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
        getSelectedManagerRoleId(res.manager);

    })
}


async function getSelectedManagerRoleId(manager){
    employees.forEach(function(item, index){
        if (`${item.first_name} ${item.last_name}` == manager){
            let employ_id = item.employ_id      
            getManagerRoleId(employ_id);
        };
    });
}

async function getManagerRoleId(employ_id){
    await connectDb.getQuery(`${queries.getManagerRoleById} ${employ_id};`, function(result){
        roleId = result[0].role_id 
        getDepartIdByManager(roleId);
    })
   
}

async function getDepartIdByManager(roleId){
    await connectDb.getQuery(`${queries.getDepartIdByManager} ${roleId};`, function(result){
        departId = result[0].depart_id;
        viewEmployeesByManager(departId, roleId);
    })
}

async function viewEmployeesByManager(departId, roleId){  
    await connectDb.getQuery(`${queries.getEmplByMan} ${departId};`, function(result){
        displayResults(result);
    })
}

// removes selected employee by employ_id
async function selectEmployeeRemove(){
    await inquirer.prompt(selectEmployeeQuest).then(res => {
        checkEmployeeMatch(res, function(result){
            let employ_id = result;
            removeEmployee(employ_id);
        });   
    })
}

async function selectEmployee(){
    await inquirer.prompt(selectEmployeeQuest).then(res => {
        checkEmployeeMatch(res, function(result){
            let employ_id = result;
            selectEmployeeRole(employ_id);
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

async function removeEmployee(employ_id ){
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