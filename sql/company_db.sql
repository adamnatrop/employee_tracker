DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    depart_id INT(10) NOT NULL,
    depart_name VARCHAR(30) NOT NULL, 
    PRIMARY KEY (depart_id)
);

CREATE TABLE employee_role (
    role_id INT(10) NOT NULL,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL NOT NULL,
    depart_id INT(10),
    PRIMARY KEY (role_id),
    FOREIGN KEY (depart_id) REFERENCES department(depart_id)
);

CREATE TABLE employee (
    employ_id INT NOT NULL AUTO_INCREMENT,
    role_id INT(10) NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    manager_id INT(10),
    PRIMARY KEY(employ_id),
    FOREIGN KEY (role_id) REFERENCES employee_role(role_id)
);

INSERT INTO department (depart_id, depart_name)
    VALUES
        (1000, "Executive Leadership Team"),
        (2000, "Marketing"),
        (3000, "Sales"),
        (4000, "Services"),
        (5000, "Human Resources");
        
INSERT INTO employee_role (depart_id, role_id, title, salary)
    VALUES 
        (1000, 1010, "Cheif Operating Officer", 500000),
        (1000, 1020, "Cheif Financial Officer", 250000),
        (1000, 1030, "Cheif Technology Officer", 250000),
        (2000, 2010, "Creative Director", 100000),
        (2000, 2020, "Marketing Manager", 90000),
        (2000, 2030, "Marketing Specialist", 60000),
        (3000, 3010, "Sales Director", 100000),
        (3000, 3020, "Sales Manager", 90000),
        (3000, 3030, "Sales Specialist", 60000),
        (4000, 4010, "Services Manager", 90000),
        (4000, 4020, "Services Specialist", 50000),
        (5000, 5010, "HR Manager", 100000),
        (5000, 5020, "HR Representative", 60000);



INSERT INTO employee (role_id, first_name, last_name, manager_id)
VALUES 
    (1010, "Steve", "Jobs", 0),
    (2010, "Johny", "Ives", 1),
    (2020, "Sam", "Rami", 2);
