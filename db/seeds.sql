\c employtrack_db;

-- Insert data into departments table
INSERT INTO department (name)
VALUES 
  ('Sales'),
  ('Engineering'),
  ('Marketing'),
  ('HR'),
  ('Finance'),
  ('Legal'), 
  ('IT'), 
  ('Customer Service'), 
  ('NULL');

-- Insert data into roles table
INSERT INTO role (title, salary, department_id)
VALUES 
  ('Sales Representative', 50000, (SELECT id FROM department WHERE name = 'Sales')),
  ('Sales Manager', 80000, (SELECT id FROM department WHERE name = 'Sales')),
  ('Software Engineer', 90000, (SELECT id FROM department WHERE name = 'Engineering')),
  ('Senior Software Engineer', 120000, (SELECT id FROM department WHERE name = 'Engineering')),
  ('Marketing Specialist', 60000, (SELECT id FROM department WHERE name = 'Marketing')),
  ('Marketing Manager', 85000, (SELECT id FROM department WHERE name = 'Marketing')),
  ('HR Coordinator', 55000, (SELECT id FROM department WHERE name = 'HR')),
  ('HR Manager', 95000, (SELECT id FROM department WHERE name = 'HR')),
  ('Accountant', 70000, (SELECT id FROM department WHERE name = 'Finance')),
  ('Finance Manager', 110000, (SELECT id FROM department WHERE name = 'Finance')), 
  ('Unassigned', 0, (SELECT id FROM department WHERE name = 'NULL'));

-- Insert data into employees table
-- Note: The manager_id references the employee's manager (an employee can manage others)

-- Employees in Sales
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('John', 'Doe', (SELECT id FROM role WHERE title = 'Sales Representative'), NULL),
  ('Jane', 'Smith', (SELECT id FROM role WHERE title = 'Sales Manager'), (SELECT id FROM employee WHERE first_name = 'John' AND last_name = 'Doe'));

-- Employees in Engineering
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('Alice', 'Johnson', (SELECT id FROM role WHERE title = 'Software Engineer'), NULL),
  ('Bob', 'Brown', (SELECT id FROM role WHERE title = 'Senior Software Engineer'), (SELECT id FROM employee WHERE first_name = 'Alice' AND last_name = 'Johnson'));

-- Employees in Marketing
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('Charlie', 'Davis', (SELECT id FROM role WHERE title = 'Marketing Specialist'), NULL),
  ('Emily', 'Miller', (SELECT id FROM role WHERE title = 'Marketing Manager'), (SELECT id FROM employee WHERE first_name = 'Charlie' AND last_name = 'Davis'));

-- Employees in HR
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('David', 'Martinez', (SELECT id FROM role WHERE title = 'HR Coordinator'), NULL),
  ('Sarah', 'Wilson', (SELECT id FROM role WHERE title = 'HR Manager'), (SELECT id FROM employee WHERE first_name = 'David' AND last_name = 'Martinez'));

-- Employees in Finance
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
  ('Sophia', 'Garcia', (SELECT id FROM role WHERE title = 'Accountant'), NULL),
  ('Michael', 'Rodriguez', (SELECT id FROM role WHERE title = 'Finance Manager'), (SELECT id FROM employee WHERE first_name = 'Sophia' AND last_name = 'Garcia'));
