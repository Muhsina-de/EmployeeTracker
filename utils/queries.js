import { pool } from '../config/connection.js';

// Function to add an employee
export const addEmployee = async (first_name, last_name, role_id, manager_id) => {
    const query = `
      INSERT INTO employee (first_name, last_name, role_id, manager_id) 
      VALUES ($1, $2, $3, $4) RETURNING id;
    `;
    const values = [first_name, last_name, role_id, manager_id];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows[0].id; // Return the newly added employee's ID
    } catch (error) {
      throw new Error('Error adding employee: ' + error.message);
    }
  };
  

// Add a new department
export const addDepartment = async (name) => {
  const query = `
    INSERT INTO department (name) 
    VALUES ($1) RETURNING id
  `;
  const values = [name];
  
  try {
    const { rows } = await pool.query(query, values);
    return rows[0].id; // return inserted department ID
  } catch (error) {
    throw new Error('Error adding department: ' + error.message);
  }
};

// Add a new role
export const addRole = async (title, salary, department_id) => {
  const query = `
    INSERT INTO role (title, salary, department_id) 
    VALUES ($1, $2, $3) RETURNING id
  `;
  const values = [title, salary, department_id];
  
  try {
    const { rows } = await pool.query(query, values);
    return rows[0].id; // return inserted role ID
  } catch (error) {
    throw new Error('Error adding role: ' + error.message);
  }
};

// Update employee's role
export const updateEmployeeRole = async (employee_id, role_id) => {
  const query = `
    UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING id
  `;
  const values = [role_id, employee_id];
  
  try {
    const { rows } = await pool.query(query, values);
    return rows[0].id; // return updated employee ID
  } catch (error) {
    throw new Error('Error updating employee role: ' + error.message);
  }
};

export const getEmployees = async () => {
  const query = 'SELECT id, first_name, last_name FROM employee';
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};


// Get all departments
export const getDepartments = async () => {
  const query = 'SELECT * FROM department';
  try {
    const { rows } = await pool.query(query);
    return rows; // return all departments
  } catch (error) {
    throw new Error('Error fetching departments: ' + error.message);
  }
};

// Fetch all roles, including the associated department name
export const getRolesWithDepartments = async () => {
    const query = `
      SELECT role.id, role.title, role.salary, department.name as department_name
      FROM role
      JOIN department ON role.department_id = department.id
    `;
    
    try {
      const { rows } = await pool.query(query);
      return rows; // return all roles with their department names
    } catch (error) {
      throw new Error('Error fetching roles with departments: ' + error.message);
    }
  };

// Get all roles
export const getRoles = async () => {
  const query = 'SELECT * FROM role';
  try {
    const { rows } = await pool.query(query);
    return rows; // return all roles
  } catch (error) {
    throw new Error('Error fetching roles: ' + error.message);
  }
};

// Fetch Roles by Department 
export const getRolesByDepartment = async (department_id) => {
  const query = 'SELECT * FROM role WHERE department_id = $1';
  const values = [department_id];
  
  try {
    const { rows } = await pool.query(query, values);
    return rows; // return roles in the given department
  } catch (error) {
    throw new Error('Error fetching roles by department: ' + error.message);
  }
}


// Fetch all employees with their role details and department details
export const getEmployeesWithRolesAndDepartments = async () => {
    const query = `
      SELECT 
        employee.id AS employee_id,
        employee.first_name,
        employee.last_name,
        role.title AS role_title,
        role.salary AS role_salary,
        department.name AS department_name
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id;
    `;
  
    try {
      const { rows } = await pool.query(query);
      return rows; // Return the result which contains employee, role, and department details
    } catch (error) {
      throw new Error('Error fetching employees with roles and departments: ' + error.message);
    }
  };

  //Delete an employee
export const deleteEmployee = async (employee_id) => {
    const query = 'DELETE FROM employee WHERE id = $1';
    const values = [employee_id];
  
    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error('Error deleting employee: ' + error.message);
    }
  }; 

  //Delete a department
export const deleteDepartment = async (department_id) => {
    const query = 'DELETE FROM department WHERE id = $1';
    const values = [department_id];
  
    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error('Error deleting department: ' + error.message);
    }
  };

  //Delete a role
export const deleteRole = async (role_id) => {
    const query = 'DELETE FROM role WHERE id = $1';
    const values = [role_id];
  
    try {
      await pool.query(query, values);
    } catch (error) {
      throw new Error('Error deleting role: ' + error.message);
    }
  };

  //View Employees by Manager
export const getEmployeesByManager = async (manager_id) => {
    const query = `
      SELECT id, first_name, last_name FROM employee WHERE manager_id = $1
    `;
    const values = [manager_id];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows; // return employees managed by the given manager
    } catch (error) {
      throw new Error('Error fetching employees by manager: ' + error.message);
    }
  };
  //View Employees by Department
export const getEmployeesByDepartment = async (department_id) => {
    const query = `
      SELECT employee.id, first_name, last_name
      FROM employee
      JOIN role ON employee.role_id = role.id
      WHERE role.department_id = $1
    `;
    const values = [department_id];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows; // return employees in the given department
    } catch (error) {
      throw new Error('Error fetching employees by department: ' + error.message);
    }
  };





