import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card, CardContent, Typography, Grid,
  TextField, MenuItem, Button, Box
} from '@mui/material';
import { addVendorRequest } from 'container/VendorContainer/slice';

const AddVendorForm = ({ onCancel, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    vendorName: '',
    email: '',
    password: '',
    organisationName: '',
    address: '',
    registrationNumber: '',
    phone: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.organisationName.trim()) newErrors.organisationName = 'Organisation name is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    dispatch(addVendorRequest(formData));
    if (onSuccess) onSuccess();
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={3}>Add Vendor</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Vendor Name *" name="vendorName"
              value={formData.vendorName} onChange={handleChange}
              error={!!errors.vendorName} helperText={errors.vendorName} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Organisation Name *" name="organisationName"
              value={formData.organisationName} onChange={handleChange}
              error={!!errors.organisationName} helperText={errors.organisationName} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth type="email" label="Email *" name="email"
              value={formData.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth type="password" label="Password *" name="password"
              value={formData.password} onChange={handleChange}
              error={!!errors.password} helperText={errors.password} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Phone *" name="phone"
              value={formData.phone} onChange={handleChange}
              error={!!errors.phone} helperText={errors.phone} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Registration Number" name="registrationNumber"
              value={formData.registrationNumber} onChange={handleChange} />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Address" name="address"
              value={formData.address} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField select fullWidth label="Status" name="status"
              value={formData.status} onChange={handleChange}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box mt={4} display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}
          sx={{ backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' } }}>Save Vendor</Button>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddVendorForm;