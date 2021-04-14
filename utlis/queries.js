module.exports = {
    queries: {
        employByDepart: `SELECT depart_name, title, first_name, last_name, salary
                        FROM employee_role
                        INNER JOIN department ON employee_role.depart_id = department.depart_id
                        INNER JOIN employee ON employee.role_id = employee_role.role_id`,

        allEmployees: `SELECT * FROM employee`,

        viewAllRoles: `SELECT * FROM employee_role`,

        viewAllDepartments: ` SELECT * FROM department`,

        roles: `SELECT role_id, title FROM employee_role`,

        addEmployee: `INSERT INTO employee (role_id, first_name, last_name) VALUES `,

        getAllManagers: `SELECT e.first_name, e.last_name
                        FROM employee e
                        INNER JOIN employee_role r
                        USING (role_id)
                        WHERE r.is_manager = TRUE
                        `,
        
        removeEmployee: `DELETE FROM employee WHERE employee.employ_id = `,

        addRole: `INSERT INTO employee_role (role_id, title, salary, depart_id, is_manager) VALUES `,

        getLastRoleId: `SELECT role_id FROM employee_role ORDER BY role_id DESC LIMIT 1;`,

        removeRole: `DELETE FROM employee_role WHERE employee_role.role_id = `,

        getLastDepartId: `SELECT depart_id FROM department ORDER BY depart_id DESC LIMIT 1;`,

        addDepartment: `INSERT INTO department (depart_id, depart_name) VALUES `,

        removeDepart: `DELETE FROM department WHERE department.depart_id = `,

    
                },
}