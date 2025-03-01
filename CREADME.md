Here's a README for your "Employee Tracker" project:

---

# 10 SQL: Employee Tracker

## Description

The **Employee Tracker** is a command-line application designed to manage a company's employee database. The application allows business owners to view and manage departments, roles, and employees in their company. The interface allows for seamless interactions with the PostgreSQL database, enabling users to organize and plan the structure of their business effectively. This project is built using **Node.js**, **Inquirer**, and **PostgreSQL**.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Walkthrough Video](#walkthrough-video)
- [Features](#features)
- [Database Schema](#database-schema)
- [Bonus Features](#bonus-features)
- [Contributing](#contributing)
- [License](#license)

## Installation

To get started with the Employee Tracker, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/employee-tracker.git
   ```
   
2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Install Inquirer version 8.2.4:
   ```bash
   npm i inquirer@8.2.4
   ```

4. Set up PostgreSQL and create the necessary database with the provided schema.

5. Add your PostgreSQL database credentials in the configuration file or environment variables as required.

6. If desired, use the `seeds.sql` file to pre-populate your database with sample data.

## Usage

1. Run the application using the following command:
   ```bash
   node index.js
   ```

2. The application will present a menu with options to:
   - View all departments
   - View all roles
   - View all employees
   - Add a department
   - Add a role
   - Add an employee
   - Update an employee's role

3. Select the option you would like to interact with and follow the prompts.

4. For a detailed walkthrough of how to use the application, see the [Walkthrough Video](#walkthrough-video).

## Walkthrough Video

You can view a walkthrough of the application here:

[![Employee Tracker Walkthrough](./Assets/12-sql-homework-video-thumbnail.png)](https://your-video-link.com)

This video demonstrates all of the technical acceptance criteria, showing how the user can interact with the application through the command line, view and update employee data, and more.

## Features

- **View all departments**: Displays a table of department names and IDs.
- **View all roles**: Displays a table of job titles, role IDs, department names, and salaries.
- **View all employees**: Displays a table of employee data, including employee IDs, first names, last names, job titles, departments, salaries, and managers.
- **Add a department**: Prompts the user to add a department to the database.
- **Add a role**: Prompts the user to add a role with a name, salary, and department.
- **Add an employee**: Prompts the user to add an employee with their name, role, and manager.
- **Update employee role**: Prompts the user to select an employee and update their role.

## Database Schema

The database contains three tables:

- **Department Table**:
  - `id`: `SERIAL PRIMARY KEY`
  - `name`: `VARCHAR(30) UNIQUE NOT NULL`

- **Role Table**:
  - `id`: `SERIAL PRIMARY KEY`
  - `title`: `VARCHAR(30) UNIQUE NOT NULL`
  - `salary`: `DECIMAL NOT NULL`
  - `department_id`: `INTEGER NOT NULL`

- **Employee Table**:
  - `id`: `SERIAL PRIMARY KEY`
  - `first_name`: `VARCHAR(30) NOT NULL`
  - `last_name`: `VARCHAR(30) NOT NULL`
  - `role_id`: `INTEGER NOT NULL`
  - `manager_id`: `INTEGER` (references another employee)

Refer to the ER diagram below for a visual representation:

![Database schema](./Assets/100-sql-challenge-ERD.png)

## Bonus Features

- Update employee managers.
- View employees by manager.
- View employees by department.
- Delete departments, roles, and employees.
- View the total utilized budget of a department (combined salaries of all employees in that department).

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. Contributions are always welcome!

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Submit a pull request.

## License

This project is licensed under the MIT License.

