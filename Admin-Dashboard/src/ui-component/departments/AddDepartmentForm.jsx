
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box
} from '@mui/material';

import { addDepartmentRequest } from 'container/departmentsContainer/slice';

const AddDepartmentForm = ({ onCancel, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
    status: 'active'
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    dispatch(addDepartmentRequest(formData));

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ maxWidth: 900, mx: 'auto', borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Add Department
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Department Name"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" size="small" onClick={handleSubmit}
          sx={{ backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' } }}>
            Save
          </Button>

          <Button variant="outlined" size="small" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddDepartmentForm;