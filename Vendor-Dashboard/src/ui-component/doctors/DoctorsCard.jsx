import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box,
  TextField, Button, Avatar, Chip, IconButton, Tooltip
} from '@mui/material';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors, removeDoctor } from 'container/DoctorContainer/slice';
import AddDoctorForm from './AddDoctorsForm';

const DoctorsCard = () => {
  const dispatch = useDispatch();
  const { doctorsList = [], loading } = useSelector((state) => state.doctors || {});
  console.log('🔍 Redux state:', { doctorsList, loading });
  console.log('🔍 Full state.doctor:', useSelector((state) => state.doctor));

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // 🔥 for edit

  /* ================= FETCH ================= */
  useEffect(() => { dispatch(getDoctors()); }, [dispatch]);

  /* ================= MODAL ================= */
  const handleOpen = () => {
    setSelectedDoctor(null); // clear for add
    setOpen(true);
  };

  const handleEdit = (doc) => {
    setSelectedDoctor(doc); // prefill for edit
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDoctor(null);
    setOpen(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      dispatch(removeDoctor(id));
    }
  };

  /* ================= STATUS COLOR ================= */
  // const getStatusColor = (status) => {
  //   if (status === 'active') return 'success';
  //   if (status === 'inactive') return 'warning';
  //   if (status === 'blocked') return 'error';
  //   return 'default';
  // };


  const getStatusColor = (status) => {
    if (status === 'active') return { backgroundColor: '#E8F5EE', color: '#1D9E75' };
    if (status === 'inactive') return { backgroundColor: '#FFF4DE', color: '#EF9F27' };
    if (status === 'blocked') return { backgroundColor: '#fdecea', color: '#ef4444' };
    return { backgroundColor: '#f0f0f0', color: '#888' };
  };

  const filteredDoctors = doctorsList
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((doc) =>
      doc.name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <Grid container spacing={3}>

        {/* SEARCH + ADD */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1} width="60%">
                  <SearchOutlined />
                  <TextField
                    placeholder="Search doctors..." fullWidth size="small"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen}
                  sx={{
                    borderRadius: 5, textTransform: 'none',
                    backgroundColor: '#38c1b3', '&:hover': { backgroundColor: '#32a087' }
                  }}
                >
                  Add Doctor
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* TABLE */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>

              {/* HEADER */}
              <Grid container mb={2} sx={{ fontWeight: 'bold', color: 'gray' }}>
                <Grid item xs={3}>Doctor</Grid>
                <Grid item xs={2}>Specialization</Grid>
                <Grid item xs={2}>Experience</Grid>
                <Grid item xs={2}>Availability</Grid>
                <Grid item xs={1}>Status</Grid>
                <Grid item xs={2} textAlign="center">Actions</Grid>
              </Grid>

              {loading && <Typography textAlign="center">Loading...</Typography>}

              {/* ROWS */}
              {!loading && filteredDoctors.map((doc) =>
              (
                <Grid
                  container key={doc._id} alignItems="center"
                  sx={{ py: 2, borderTop: '1px solid #eee', '&:hover': { backgroundColor: '#fafafa' } }}
                >
                  {/* Doctor */}
                  <Grid item xs={3} display="flex" alignItems="center" gap={2}>
                    <Avatar src={doc.photo}>{doc.name?.charAt(0)}</Avatar>
                    <Typography fontWeight="bold">{doc.name}</Typography>
                  </Grid>

                  {/* Specialization */}
                  <Grid item xs={2}>
                    <Typography>{doc.specialization}</Typography>
                  </Grid>

                  {/* Experience */}
                  <Grid item xs={2}>
                    <Typography>{doc.experience}</Typography>
                  </Grid>

                  {/* Availability */}
                  <Grid item xs={2}>
                    <Typography>{doc.availability?.length || 0} slots</Typography>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={1}>
                    {/* <Chip label={doc.status} color={getStatusColor(doc.status)} size="small" /> */}
                    <Chip
                      label={doc.status}
                      size="small"
                      sx={{
                        ...getStatusColor(doc.status),
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Grid>

                  {/* ✅ Actions */}
                  <Grid item xs={2} display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small" onClick={() => handleEdit(doc)}
                        sx={{
                          color: '#38c1b3', border: '1px solid #38c1b3',
                          '&:hover': { backgroundColor: '#e8f8f7' }
                        }}
                      >
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small" onClick={() => handleDelete(doc._id)}
                        sx={{
                          color: '#ff4d4f', border: '1px solid #ff4d4f',
                          '&:hover': { backgroundColor: '#fff1f0' }
                        }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                </Grid>
              ))}

              {!loading && filteredDoctors.length === 0 && (
                <Typography textAlign="center" mt={3} color="text.secondary">
                  No doctors found
                </Typography>
              )}

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MODAL — same form for Add & Edit */}
      <AddDoctorForm
        open={open}
        handleClose={handleClose}
        selectedDoctor={selectedDoctor} // 🔥 pass selected doctor
      />
    </>
  );
};

export default DoctorsCard;