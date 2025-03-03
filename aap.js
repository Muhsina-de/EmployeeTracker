import inquirer from 'inquirer';
import { connectToDb } from './config/connection.js';
import { addEmployee, addDepartment, addRole, updateEmployeeRole, getEmployeesWithRolesAndDepartments,getEmployees, getDepartments, getRoles, deleteDepartment, deleteRole, deleteEmployee, getEmployeesByDepartment, getEmployeesByManager, getRolesWithDepartments, getRolesByDepartment} from './utils/queries.js';

await connectToDb(); // Connect to the database at the start

const ADD_EMPLOYEE = 'Add an Employee';
const ADD_DEPARTMENT = 'Add Department';
const ADD_ROLE = 'Add Role';
const UPDATE_EMPLOYEE_ROLE = 'Update Employee Role';
const VIEW_ALL_EMPLOYEES = 'View All Employees';
const VIEW_ALL_DEPARTMENTS = 'View All Departments';
const VIEW_ALL_ROLES = 'View All Roles';
const DELETE_EMPLOYEE = 'Delete Employee';
const DELETE_DEPARTMENT = 'Delete Department';
const DELETE_ROLE = 'Delete Role';
const VIEW_EMPLOYEES_BY_MANAGER = 'View Employees by Manager';
const VIEW_EMPLOYEES_BY_DEPARTMENT = 'View Employees by Department';
const VIEW_UTILIZED_BUDGET_BY_DEPARTMENT = 'View Utilized Budget by Department';
const EXIT = 'Exit';

async function promptChoices() {
  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      ADD_EMPLOYEE,
      ADD_DEPARTMENT,
      ADD_ROLE,
      UPDATE_EMPLOYEE_ROLE,
      VIEW_ALL_EMPLOYEES,
      VIEW_ALL_DEPARTMENTS,
      VIEW_ALL_ROLES,
      DELETE_EMPLOYEE,
      DELETE_DEPARTMENT,
      DELETE_ROLE,
      VIEW_EMPLOYEES_BY_MANAGER,
      VIEW_EMPLOYEES_BY_DEPARTMENT,
      VIEW_UTILIZED_BUDGET_BY_DEPARTMENT,
      EXIT,
    ],
  });

  console.log(choice);

         if (choice === ADD_EMPLOYEE) {
              await promptEmployeeDetails();
            } else if (choice === ADD_DEPARTMENT) {
              await promptDepartmentDetails();
            } else if (choice === ADD_ROLE) {
              await promptRoleDetails();
            } else if (choice === UPDATE_EMPLOYEE_ROLE) {
              await updateEmployeeRoleDetails();
            } else if (choice === VIEW_ALL_EMPLOYEES) {
              await viewAllEmployees();
            } else if (choice === VIEW_ALL_DEPARTMENTS) {
              await viewAllDepartments();
            } else if (choice === VIEW_ALL_ROLES) {
              await viewAllRoles();
            } 
            else if (choice === VIEW_EMPLOYEES_BY_MANAGER){
              await viewEmployeesByManager();
            }
            else if (choice === VIEW_EMPLOYEES_BY_DEPARTMENT){
              await viewEmployeesByDepartment();
            }
            else if (choice === VIEW_UTILIZED_BUDGET_BY_DEPARTMENT){
              await viewUtilizedBudgetByDepartment();
            }
            else if (choice === DELETE_EMPLOYEE) {
              await deleteEmp();
            } else if (choice === DELETE_DEPARTMENT) {
              await deleteDepart();
            }
            else if (choice === DELETE_ROLE) {
              await deleteRoleDetails();
            }
            else if (choice === EXIT) {
              process.exit();
            }

            await promptChoices(); // Re-prompt after action
          }

// Start the CLI prompting
async function startPrompting() {
  await promptChoices(); // Start the prompt loop
}

// Add department logic
async function promptDepartmentDetails() {
  const departmentAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);

  try {
    const departmentId = await addDepartment(departmentAnswers.name);
    console.log('Department added successfully:', departmentId);
  } catch (error) {
        console.error('Error adding department:', error.message);
      }
    }


// Add role logic
async function promptRoleDetails() {
  const departmentNames = await getDepartments(); // Fetch department names from DB
  const departmentChoices = departmentNames.map(dep => dep.name);

  const roleAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the role:',
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department does the role belong to:',
      choices: departmentChoices,
    },
  ]);

  try {
    const department = departmentNames.find(dep => dep.name === roleAnswers.department);
    const roleId = await addRole(roleAnswers.title, roleAnswers.salary, department.id);
    console.log('Role added successfully:', roleId);
  } catch (error) {
    console.error('Error adding role:', error.message);
  }
}

async function promptEmployeeDetails() {
  const roles = await getRoles(); // Fetch roles from DB
  const roleChoices = roles.map(role => role.title);

  const employees = await getEmployees(); // Fetch employees for manager selection
  const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);

  const employeeAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the employee:',
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the role for the employee:',
      choices: roleChoices,
    },
    {
      type: 'list', // Allow the user to select the manager from a list
      name: 'manager',
      message: 'Select the manager for this employee:',
      choices: [...employeeChoices, 'No manager'], // Add 'No manager' option
    },
  ]);

  // Find the selected role
  const selectedRole = roles.find(role => role.title === employeeAnswers.role);
  
  if (!selectedRole) {
    console.error('Role not found!');
    return;
  }

  // Get the manager's ID if the user selects a manager
  let managerId = null;
  if (employeeAnswers.manager !== 'No manager') {
    const selectedManager = employees.find(
      employee => `${employee.first_name} ${employee.last_name}` === employeeAnswers.manager
    );
    if (selectedManager) {
      managerId = selectedManager.id;
    }
  }

  try {
    const employeeId = await addEmployee(employeeAnswers.first_name, employeeAnswers.last_name, selectedRole.id, managerId);
    console.log('Employee added successfully:', employeeId);
  } catch (error) {
    console.error('Error adding employee:', error.message);
  }
}


// View all employees
async function viewAllEmployees() {
  try {
    const employees = await getEmployeesWithRolesAndDepartments();
    console.table(employees); // Use console.table to display the data in a tabular format
  } catch (error) {
    console.error('Error fetching employees:', error.message);
  }
}

// View all departments
async function viewAllDepartments() {
  try {
    const departments = await getDepartments();
    console.table(departments);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
  }
}

// View all roles
async function viewAllRoles() {
  try {
    const roles = await getRolesWithDepartments();
    console.table(roles);
  } catch (error) {
    console.error('Error fetching roles:', error.message);
  }
}

// View Roles by Department 
async function getRolesByDepart(departmentId) {
  const roles = await getRolesByDepartment();
  console.table(roles);
}

// Update employee role logic
async function updateEmployeeRoleDetails() {
  const employees = await getEmployees(); // Get employee list
  const employeeChoices = employees.map(emp => `${emp.first_name} ${emp.last_name}`);

  const roles = await getRoles(); // Get role list
  const roleChoices = roles.map(role => role.title);

  const { employeeName, newRole } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeName',
      message: 'Select an employee to update:',
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'newRole',
      message: 'Select the new role for the employee:',
      choices: roleChoices,
    },
  ]);

  const employee = employees.find(emp => `${emp.first_name} ${emp.last_name}` === employeeName);
  const role = roles.find(r => r.title === newRole);

  try {
    await updateEmployeeRole(employee.id, role.id);
    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Error updating role:', error.message);
  }
}

//delete employee logic
async function deleteEmp(){
  const employees = await getEmployees(); // Get employee list
  const employeeChoices = employees.map(emp => `${emp.first_name} ${emp.last_name}`);
  const {employeeName} = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeName',
      message: 'Select an employee to delete:',
      choices: employeeChoices,
    },
  ]);
  const employee = employees.find(emp => `${emp.first_name} ${emp.last_name}` === employeeName);
  try {
    await deleteEmployee(employee.id);
    console.log('Employee deleted successfully.');
  } catch (error) {
    console.error('Error deleting employee:', error.message);
  }
}
//Delete Role logic
async function deleteRoleDetails(){
  const roles = await getRoles(); // Get role list
  const roleChoices = roles.map(role => role.title);
  const {roleName} = await inquirer.prompt([
    {
      type: 'list',
      name: 'roleName',
      message: 'Select a role to delete:',
      choices: roleChoices,
    },
  ]);
  const role = roles.find(role => role.title === roleName);
  try {
    await deleteRole(role.id);
    console.log('Role deleted successfully.');
  } catch (error) {
    console.error('Error deleting role:', error.message);
  }
}
//Delete Department logic with warning and prompt user to reassign the employees to another department, then delete the role and then delete the department
async function deleteDepart(){
  const departments = await getDepartments(); // Get department list
  const departmentChoices = departments.map(dep => dep.name);
  const {departmentName} = await inquirer.prompt([
    {
      type: 'list',
      name: 'departmentName',
      message: 'Select a department to delete:',
      choices: departmentChoices,
    },
  ]);
  const department = departments.find(dep => dep.name === departmentName);
  try {
    const roles = await getRolesByDepartment(department.id);
    const employee = await getEmployeesByDepartment(department.id);
      if(employee.length > 0){
        console.log('Warning: The department has employees associated with it. Please reassign the employees to another department before deleting the department.');
        //display employees in the selected department
      const employees = await getEmployeesByDepartment(department.id);
      console.table(employees);
      
               if(roles.length > 0){
                  console.log('ROLES ASSOCIATED WITH THE DEPARTMENT');
                  console.log('Warning: The department has roles associated with it. Please reassign the roles to another department before deleting the department.');
                  //display roles in the selected department
                  const roles = await getRolesByDepartment(department.id);
                  console.table(roles);
                return;
                }
      }
      await deleteDepartment(department.id);
      console.log('Department deleted successfully.');
   } 
      catch (error) {
        console.error('Cannot delete department:', error.message);
        }
}


// View Employees by Manager
async function viewEmployeesByManager() {
  const employees = await getEmployees(); // Get employee list
  const employeeChoices = employees.map(emp => `${emp.first_name} ${emp.last_name}`);

  const { managerName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'managerName',
      message: 'Select a manager to view employees:',
      choices: employeeChoices,
    },
  ]);

  const manager = employees.find(emp => `${emp.first_name} ${emp.last_name}` === managerName);

  try {
    const employees = await getEmployeesByManager(manager.id);
    console.table(employees);
  } catch (error) {
    console.error('Error fetching employees by manager:', error.message);
  }
}
// View Employees by Department
async function viewEmployeesByDepartment() {
  const departments = await getDepartments(); // Get department list
  const departmentChoices = departments.map(dep => dep.name);

  const { departmentName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'departmentName',
      message: 'Select a department to view employees:',
      choices: departmentChoices,
    },
  ]);

  const department = departments.find(dep => dep.name === departmentName);

  try {
    const employees = await getEmployeesByDepartment(department.id);
    console.table(employees);
  } catch (error) {
    console.error('Error fetching employees by department:', error.message);
  }
}
// View Utilized Budget by Department
async function viewUtilizedBudgetByDepartment() {
  const departments = await getDepartments(); // Get department list
  const departmentChoices = departments.map(dep => dep.name);

      const { departmentName } = await inquirer.prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: 'Select a department to view utilized budget:',
          choices: departmentChoices,
        },
      ]);

      const department = departments.find(dep => dep.name === departmentName);

      try {
        //fetch utilized budget from role table and sum it up
        const roles = await getRolesByDepartment(department.id);
let budget = 0;

roles.forEach(role => {
  // Ensure that salary is treated as a number (parse if necessary)
  const salary = parseFloat(role.salary);  // Converts salary to a number
  if (!isNaN(salary)) {
    budget += salary; // Add salary to budget
  } else {
    console.log(`Invalid salary value: ${role.salary}`);
  }
});

console.log(`The utilized budget for ${departmentName} is $${budget}`);
      
      } catch (error) {
        console.error('Error fetching utilized budget by department:', error.message);
      }
}


// Start prompting when the script is run
await startPrompting();
