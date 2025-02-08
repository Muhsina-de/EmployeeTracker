import express from 'express';
import { pool, connectToDb } from './connection.js';

await connectToDb(); // Connect to the database at the start

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// --- Route to View All Departments ---
app.get('/api/departments', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM department');
    res.json(result.rows);  // Return all departments
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching departments' });
  }
});

// --- Route to View All Roles ---
app.get('/api/roles', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM role');
    res.json(result.rows);  // Return all roles
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching roles' });
  }
});

// --- Route to View All Employees ---
app.get('/api/employees', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, m.first_name AS manager_first_name, m.last_name AS manager_last_name
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    res.json(result.rows);  // Return all employees with role, department, and manager info
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// --- Route to Add a Department ---
app.post('/api/departments', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Department name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO department (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);  // Return the newly added department
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error adding department' });
  }
});

// --- Route to Add a Role ---
app.post('/api/roles', async (req, res) => {
  const { title, salary, department_id } = req.body;

  if (!title || !salary || !department_id) {
    return res.status(400).json({ error: 'Title, salary, and department are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
      [title, salary, department_id]
    );
    res.status(201).json(result.rows[0]);  // Return the newly added role
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error adding role' });
  }
});

// --- Route to Add an Employee ---
app.post('/api/employees', async (req, res) => {
  const { first_name, last_name, role_id, manager_id } = req.body;

  if (!first_name || !last_name || !role_id) {
    return res.status(400).json({ error: 'First name, last name, and role are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, role_id, manager_id || null]
    );
    res.status(201).json(result.rows[0]);  // Return the newly added employee
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error adding employee' });
  }
});

// --- Route to Update an Employee's Role ---
app.put('/api/employees/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  if (!role_id) {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *',
      [role_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(result.rows[0]);  // Return the updated employee
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating employee role' });
  }
});

// Default response for any other request (Not Found)
app.use((_req, res) => {
  res.status(404).end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
