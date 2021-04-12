module.exports = {
    queries: {
        employByDepart: `SELECT depart_name, title, first_name, last_name, salary
                        FROM employee_role
                        INNER JOIN department ON employee_role.depart_id = department.depart_id
                        INNER JOIN employee ON employee.role_id = employee_role.role_id`,

        allEmployees: `SELECT * FROM employee`,

        viewAllRoles: `SELECT * FROM employee_role`,

        viewAllDepartmements: ` SELECT * FROM department`,

        roles: `SELECT role_id, title FROM employee_role`,

        addEmployee: `INSERT INTO employee (role_id, first_name, last_name) VALUES `

                },
}