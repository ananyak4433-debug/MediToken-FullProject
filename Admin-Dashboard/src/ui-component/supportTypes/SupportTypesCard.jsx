
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
import BugReportIcon from '@mui/icons-material/BugReport';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import {
  getSupportTypesRequest,
  editSupportTypeRequest,
  deleteSupportTypeRequest
} from 'container/SupportTypeContainer/slice';
import { addSupportTypeRequest } from 'container/SupportTypeContainer/slice';

const supportTypeIcons = {
  'bug': <BugReportIcon sx={{ fontSize: 22, color: '#ef4444' }} />,
  'billing': <PaymentIcon sx={{ fontSize: 22, color: '#f59e0b' }} />,
  'technical': <BuildIcon sx={{ fontSize: 22, color: '#3b82f6' }} />,
  'general': <HelpOutlineIcon sx={{ fontSize: 22, color: '#6b7280' }} />,
  'security': <SecurityIcon sx={{ fontSize: 22, color: '#8b5cf6' }} />,
  'account': <AccountCircleIcon sx={{ fontSize: 22, color: '#0e9e8e' }} />,
  'default': <SupportAgentIcon sx={{ fontSize: 22, color: '#1D9E75' }} />
};

const SupportTypesCard = ({ onAdd }) => {
  const dispatch = useDispatch();
  const { supportTypes, loading } = useSelector((state) => state.supportType);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [editForm, setEditForm] = useState({
    typeName: '', description: '', status: ''
  });

  useEffect(() => {
    dispatch(getSupportTypesRequest());
  }, [dispatch]);

  const handleEditOpen = (type) => {
    setSelectedType(type);
    setEditForm({
      typeName: type.typeName || '',
      description: type.description || '',
      status: type.status || 'active'
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    dispatch(editSupportTypeRequest({ id: selectedType._id, ...editForm }));
    setEditOpen(false);
  };

  const handleDeleteOpen = (type) => {
    setSelectedType(type);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteSupportTypeRequest(selectedType._id));
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
            <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>Support Types</Typography>
            <Button variant="contained" onClick={onAdd}
              sx={{ backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' } }}>Add Support Type</Button>
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
              {supportTypes?.map((type) => (
                <TableRow key={type._id}>
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
                        {supportTypeIcons[type.typeName?.toLowerCase().trim()] || supportTypeIcons.default}
                      </Box>
                      {type.typeName}
                    </Box>
                  </TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={type.status}
                      color={statusColor(type.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditOpen(type)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteOpen(type)}
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
        <DialogTitle>Edit Support Type</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Type Name"
              size="small"
              fullWidth
              value={editForm.typeName}
              onChange={(e) => setEditForm(f => ({ ...f, typeName: e.target.value }))}
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
        <DialogTitle>Delete Support Type</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedType?.typeName}</strong>? This action cannot be undone.
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

export default SupportTypesCard;