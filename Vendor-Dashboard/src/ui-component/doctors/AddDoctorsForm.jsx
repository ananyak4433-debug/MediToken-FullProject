import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem, IconButton,
  Typography, Box, CircularProgress
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addDoctor, editDoctor } from 'container/DoctorContainer/slice';
import appConfig from '../../config';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPECIALIZATIONS = [
  'General OPD', 'Cardiology', 'Dermatology', 'Neurology',
  'Orthopaedics', 'Pediatricis', 'Pharmacy', 'Gynecology',
  'Ophthalmology', 'ENT', 'Dental', 'Radiology',
  // 'Pathology','Oncology','Nephrology','Laboratory Services',"Physiotherapy", "Psychiatry"
];
const EXPERIENCE_OPTIONS = [
  '1 year', '2 years', '3 years', '4 years', '5 years',
  '6-8 years', '9-10 years', '11-15 years', '15+ years'
];
const emptySlot = { day: '', startTime: '', endTime: '', breakStart: '', breakEnd: '' };
const defaultForm = {
  name: '', photo: '', specialization: '', experience: '',
  status: 'active', availability: [{ ...emptySlot }]
};

const AddDoctorForm = ({ open, handleClose, selectedDoctor }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);

  const isEditMode = !!selectedDoctor; // 🔥 true = edit, false = add

  /* ================= PREFILL ON EDIT ================= */
  useEffect(() => {
    if (selectedDoctor) {
      setFormData({
        name: selectedDoctor.name || '',
        photo: selectedDoctor.photo || '',
        specialization: selectedDoctor.specialization || '',
        experience: selectedDoctor.experience || '',
        status: selectedDoctor.status || 'active',
        availability: selectedDoctor.availability?.length
          ? selectedDoctor.availability
          : [{ ...emptySlot }]
      });
    } else {
      setFormData(defaultForm); // reset for add
    }
  }, [selectedDoctor, open]);

  /* ================= PHOTO UPLOAD ================= */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('photo', file);
    try {
      const res = await fetch(`${appConfig.ip}/upload`, { method: 'POST', body: data });
      const result = await res.json();
      setFormData((prev) => ({ ...prev, photo: result.url }));
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvailabilityChange = (index, e) => {
    const updated = [...formData.availability];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, availability: updated });
  };

  const addAvailability = () =>
    setFormData({ ...formData, availability: [...formData.availability, { ...emptySlot }] });

  const removeAvailability = (index) =>
    setFormData({ ...formData, availability: formData.availability.filter((_, i) => i !== index) });

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (isEditMode) {
      dispatch(editDoctor({ ...formData, _id: selectedDoctor._id })); // 🔥 edit
    } else {
      dispatch(addDoctor(formData)); // 🔥 add
    }
    handleClose();
  };

  /* ================= REUSABLE DROPDOWN ================= */
  const DropdownField = ({ label, name, value, options, onChange }) => (
    <TextField select fullWidth label={label} name={name} value={value} onChange={onChange}>
      {options.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
    </TextField>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{isEditMode ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} mt={1}>

          <Grid item xs={6}>
            <TextField fullWidth label="Name" name="name"
              value={formData.name} onChange={handleChange} />
          </Grid>

          {/* Photo Upload */}
          <Grid item xs={6}>
            <Button variant="outlined" component="label" fullWidth
              sx={{ height: '56px', borderStyle: 'dashed' }}>
              {uploading ? <CircularProgress size={20} />
                : formData.photo ? '✅ Photo Uploaded' : '📷 Upload Photo'}
              <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
            </Button>
            {formData.photo && (
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <img src={formData.photo} alt="preview" width={45} height={45}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #38c1b3' }} />
                <Typography variant="caption" color="text.secondary">Preview</Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={6}>
            <DropdownField label="Specialization" name="specialization"
              value={formData.specialization} options={SPECIALIZATIONS} onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <DropdownField label="Experience" name="experience"
              value={formData.experience} options={EXPERIENCE_OPTIONS} onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <DropdownField label="Status" name="status"
              value={formData.status} options={['active', 'inactive', 'blocked']} onChange={handleChange} />
          </Grid>

        </Grid>

        {/* AVAILABILITY */}
        <Typography mt={3} mb={1} fontWeight="bold">Availability</Typography>

        {formData.availability.map((slot, index) => (
          <Grid container spacing={2} key={index} alignItems="center" mb={1}>
            <Grid item xs={2}>
              <DropdownField label="Day" name="day" value={slot.day}
                options={DAYS} onChange={(e) => handleAvailabilityChange(index, e)} />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth type="time" label="Start" name="startTime"
                InputLabelProps={{ shrink: true }} value={slot.startTime}
                onChange={(e) => handleAvailabilityChange(index, e)} />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth type="time" label="End" name="endTime"
                InputLabelProps={{ shrink: true }} value={slot.endTime}
                onChange={(e) => handleAvailabilityChange(index, e)} />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth type="time" label="Break Start" name="breakStart"
                InputLabelProps={{ shrink: true }} value={slot.breakStart}
                onChange={(e) => handleAvailabilityChange(index, e)} />
            </Grid>
            <Grid item xs={2}>
              <TextField fullWidth type="time" label="Break End" name="breakEnd"
                InputLabelProps={{ shrink: true }} value={slot.breakEnd}
                onChange={(e) => handleAvailabilityChange(index, e)} />
            </Grid>
            <Grid item xs={1}>
              <IconButton color="error" onClick={() => removeAvailability(index)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button startIcon={<Add />} onClick={addAvailability}>Add Slot</Button>

      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}
          sx={{ backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' } }}>
          {isEditMode ? 'Update Doctor' : 'Save Doctor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDoctorForm;