import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addStaff } from 'container/StaffContainer/slice';

const AddStaffForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    customId: '',
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = () => {
  dispatch(addStaff(formData));
  setFormData({
    customId: '', firstName: '', lastName: '',
    phone: '', department: '', email: '', password: ''
  });
  handleClose();
};

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add Staff</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <TextField fullWidth label="Custom ID" name="customId" onChange={handleChange} />
          </Grid>

          {/* <Grid item xs={6}>
            <TextField fullWidth label="Department" name="department" onChange={handleChange} />
          </Grid> */}

          <Grid item xs={6}>
  <FormControl fullWidth>
    <InputLabel>Department</InputLabel>
    <Select
      name="department"
      value={formData.department}
      label="Department"
      onChange={handleChange}
    >
      <MenuItem value="Hospital Management">Hospital Management</MenuItem>
      <MenuItem value="Human Resource (HR) Department">Human Resource (HR) Department</MenuItem>
      <MenuItem value="Finance & Accounts Department">Finance & Accounts Department</MenuItem>
      <MenuItem value="Medical Records Department (MRD)">Medical Records Department (MRD)</MenuItem>
      <MenuItem value="Quality Assurance Department">Quality Assurance Department</MenuItem>
      <MenuItem value="Public Relations (PR) Department">Public Relations (PR) Department</MenuItem>
      <MenuItem value="Information Technology (IT) Department">Information Technology (IT) Department</MenuItem>
      <MenuItem value="Purchase & Supply Department">Purchase & Supply Department</MenuItem>
      <MenuItem value="Maintenance Department">Maintenance Department</MenuItem>
      <MenuItem value="Housekeeping Department">Housekeeping Department</MenuItem>
      <MenuItem value="Security Department">Security Department</MenuItem>
      <MenuItem value="Biomedical Engineering Department">Biomedical Engineering Department</MenuItem>
    </Select>
  </FormControl>
</Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="First Name" name="firstName" onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" name="lastName" onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Phone" name="phone" onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Email" name="email" onChange={handleChange} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
       <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 5,
            textTransform: 'none',
            backgroundColor: '#38c1b3ff',
            '&:hover': { backgroundColor: '#32a087ff' }
          }}
        >
          Add Staff
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStaffForm;