
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardContent, Typography, Button, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PsychologyIcon from '@mui/icons-material/Psychology';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import FemaleIcon from '@mui/icons-material/Female';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import {
  getDepartmentsRequest,
  editDepartmentRequest,
  deleteDepartmentRequest
} from 'container/departmentsContainer/slice';

const departmentIcons = {
  cardiology: <FavoriteIcon sx={{ fontSize: 22, color: '#ef4444' }} />,
  orthopaedics: <AccessibilityNewIcon sx={{ fontSize: 22 }} />,
  orthopedics: <AccessibilityNewIcon sx={{ fontSize: 22 }} />,
  neurology: <PsychologyIcon sx={{ fontSize: 22, color: '#6c5ce7' }} />,
  ophthalmology: <VisibilityIcon sx={{ fontSize: 22 }} />,
  paediatrics: <ChildCareIcon sx={{ fontSize: 22 }} />,
  pediatrics: <ChildCareIcon sx={{ fontSize: 22 }} />,
  dental: <MedicalServicesIcon sx={{ fontSize: 22 }} />,
  'general opd': <LocalHospitalIcon sx={{ fontSize: 22 }} />,
  dermatology: <ScienceIcon sx={{ fontSize: 22 }} />,
  pathology: <BiotechIcon sx={{ fontSize: 22 }} />,
  gynaecology: <FemaleIcon sx={{ fontSize: 22, color: '#e84393' }} />,
  gynecology: <FemaleIcon sx={{ fontSize: 22, color: '#e84393' }} />,
  pharmacy: <MedicationIcon sx={{ fontSize: 22 }} />,
  radiology: <BiotechIcon sx={{ fontSize: 22 }} />,
  default: <LocalHospitalIcon sx={{ fontSize: 22, color: '#1D9E75' }} />
};

const DepartmentsCard = ({ onAdd }) => {
  const dispatch = useDispatch();
  const { departments, loading } = useSelector((state) => state.departments);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [editForm, setEditForm] = useState({
    departmentName: '', description: '', status: ''
  });

  useEffect(() => {
    dispatch(getDepartmentsRequest());
  }, [dispatch]);

  // ── EDIT ──────────────────────────────────────
  const handleEditOpen = (dept) => {
    setSelectedDept(dept);
    setEditForm({
      departmentName: dept.departmentName || '',
      description: dept.description || '',
      status: dept.status || 'active'
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    dispatch(editDepartmentRequest({ id: selectedDept._id, ...editForm }));
    setEditOpen(false);
  };

  // ── DELETE ────────────────────────────────────
  const handleDeleteOpen = (dept) => {
    setSelectedDept(dept);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteDepartmentRequest(selectedDept._id));
    setDeleteOpen(false);
  };

  const statusColor = (status) => {
    if (status === 'active') return 'success';
    if (status === 'inactive') return 'warning';
    return 'default';
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={3} mt={3} ml={2}>
            <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>Departments</Typography>
            <Button variant="contained" onClick={onAdd}
              sx={{ backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' } }}>Add Department</Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments?.map((dept) => (
                <TableRow key={dept._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 40, height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {departmentIcons[dept.departmentName?.toLowerCase().trim()] || departmentIcons.default}
                      </Box>
                      {dept.departmentName}
                    </Box>
                  </TableCell>
                  <TableCell>{dept.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={dept.status}
                      color={statusColor(dept.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditOpen(dept)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteOpen(dept)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loading && <Typography mt={2}>Loading...</Typography>}
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Department Name"
              size="small"
              fullWidth
              value={editForm.departmentName}
              onChange={(e) => setEditForm(f => ({ ...f, departmentName: e.target.value }))}
            />
            <TextField
              label="Description"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
            />
            <TextField
              select
              label="Status"
              size="small"
              fullWidth
              value={editForm.status}
              onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}
            sx={{ backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' } }}>
            Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Department</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedDept?.departmentName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DepartmentsCard;