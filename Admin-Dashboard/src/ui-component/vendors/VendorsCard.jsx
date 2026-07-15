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
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getVendorsRequest, editVendorRequest, deleteVendorRequest } from 'container/VendorContainer/slice';

const getLetterIcon = (name = '') => {
  const letter = name.trim().charAt(0).toUpperCase() || '?';
  const colors = [
    { bg: '#E8F5EE', color: '#1D9E75' },
    { bg: '#EAF4FF', color: '#2196F3' },
    { bg: '#FFF4DE', color: '#EF9F27' },
    { bg: '#fdecea', color: '#ef4444' },
    { bg: '#ede9fb', color: '#6c5ce7' },
    { bg: '#fde8f3', color: '#e84393' },
  ];
  const index = letter.charCodeAt(0) % colors.length;
  return { letter, ...colors[index] };
};

const VendorsCard = ({ onAdd }) => {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state) => state.vendors);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [editForm, setEditForm] = useState({
    vendorName: '', email: '', phone: '', status: ''
  });

  useEffect(() => {
    dispatch(getVendorsRequest());
  }, [dispatch]);

  // ── EDIT ──────────────────────────────────────
  const handleEditOpen = (vendor) => {
    setSelectedVendor(vendor);
    setEditForm({
      vendorName: vendor.vendorName || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      status: vendor.status || 'active'
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    dispatch(editVendorRequest({ id: selectedVendor._id, ...editForm }));
    setEditOpen(false);
  };

  // ── DELETE ────────────────────────────────────
  const handleDeleteOpen = (vendor) => {
    setSelectedVendor(vendor);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteVendorRequest(selectedVendor._id));
    setDeleteOpen(false);
  };

  // const statusColor = (status) => {
  //   if (status === 'active') return 'success';
  //   if (status === 'inactive') return 'warning';
  //   return 'default';
  // };

  const statusColor = (status) => {
    if (status === 'active') return { backgroundColor: '#E8F5EE', color: '#1D9E75' };
    if (status === 'inactive') return { backgroundColor: '#FFF4DE', color: '#EF9F27' };
    return { backgroundColor: '#f0f0f0', color: '#888' };
  };



  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={3} mt={3} ml={2}>
            <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>Vendors</Typography>
            <Button
              variant="contained" startIcon={<PlusOutlined />} onClick={onAdd}
              sx={{
                textTransform: 'none',
                backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' }
              }}
            >
              Add Vendor
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors?.filter(Boolean).map((vendor) => {
                const ic = getLetterIcon(vendor.vendorName);
                return (
                  <TableRow key={vendor._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 40, height: 40,
                          borderRadius: '50%',
                          backgroundColor: ic.bg,
                          color: ic.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 15,
                          flexShrink: 0
                        }}>
                          {ic.letter}
                        </Box>
                        {vendor.vendorName}
                      </Box>
                    </TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>
                      {/* <Chip
                        label={vendor.status}
                        color={statusColor(vendor.status)}
                        size="small"
                      /> */}

                      <Chip
                        label={vendor.status}
                        size="small"
                        sx={{
                          ...statusColor(vendor.status),
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />


                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditOpen(vendor)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteOpen(vendor)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Vendor</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Vendor Name"
              size="small"
              fullWidth
              value={editForm.vendorName}
              onChange={(e) => setEditForm(f => ({ ...f, vendorName: e.target.value }))}
            />
            <TextField
              label="Email"
              size="small"
              fullWidth
              value={editForm.email}
              onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
            />
            <TextField
              label="Phone"
              size="small"
              fullWidth
              value={editForm.phone}
              onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
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
        <DialogTitle>Delete Vendor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedVendor?.vendorName}</strong>? This action cannot be undone.
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

export default VendorsCard;