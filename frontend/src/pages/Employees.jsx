import { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Modal,
  TextField,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { employeeService } from '../services/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (error) {
      showSnackbar('Error fetching employees', 'error');
    }
  };

  const handleOpen = () => {
    setEditingEmployee(null);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      department: '',
      salary: ''
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditingEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee._id, newEmployee);
        showSnackbar('Employee updated successfully');
      } else {
        await employeeService.create(newEmployee);
        showSnackbar('Employee added successfully');
      }
      handleClose();
      fetchEmployees();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error processing request', 'error');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salary: employee.salary
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        showSnackbar('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        showSnackbar('Error deleting employee', 'error');
      }
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Employees</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpen}
          sx={{ backgroundColor: '#1976d2' }}
        >
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => handleEdit(employee)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="add-employee-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={2}>
            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="firstName"
                label="First Name"
                value={newEmployee.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={newEmployee.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="position"
                label="Position"
                value={newEmployee.position}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="department"
                label="Department"
                value={newEmployee.department}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="salary"
                label="Salary"
                type="number"
                value={newEmployee.salary}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Button 
                type="submit" 
                variant="contained"
                sx={{ backgroundColor: '#1976d2' }}
              >
                {editingEmployee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Employees;