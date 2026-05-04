// import React, { useEffect, useState } from 'react';
// import {
//   Grid, Card, CardContent, Typography, Box,
//   TextField, Button, Avatar, IconButton,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   FormControl, InputLabel, Select, MenuItem
// } from '@mui/material';
// import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { getStaff, deleteStaff, editStaff } from 'container/StaffContainer/slice';
// import AddStaffForm from './AddStaffsForm';

// const DEPARTMENTS = [
//   'Hospital Management',
//   'Human Resource (HR) Department',
//   'Finance & Accounts Department',
//   'Medical Records Department (MRD)',
//   'Quality Assurance Department',
//   'Public Relations (PR) Department',
//   'Information Technology (IT) Department',
//   'Purchase & Supply Department',
//   'Maintenance Department',
//   'Housekeeping Department',
//   'Security Department',
//   'Biomedical Engineering Department'
// ];

// const StaffCard = () => {
//   const dispatch = useDispatch();
//   const { staffList = [], loading } = useSelector((state) => state.staff || {});

//   const [search, setSearch] = useState('');

//   /* ===== ADD MODAL ===== */
//   const [addOpen, setAddOpen] = useState(false);

//   /* ===== EDIT MODAL ===== */
//   const [editOpen, setEditOpen] = useState(false);
//   const [editData, setEditData] = useState({
//     id: '', customId: '', firstName: '', lastName: '',
//     phone: '', department: '', email: ''
//   });

//   /* ===== DELETE CONFIRM ===== */
//   const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

//   /* ===== FETCH ON MOUNT ===== */
//   useEffect(() => {
//     dispatch(getStaff());
//   }, [dispatch]);

//   const safeStaffList = Array.isArray(staffList) ? staffList : [];

//   const filteredStaff = safeStaffList
//   .slice()
//   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//   .filter((member) =>
//     member.email?.toLowerCase().includes(search.toLowerCase()) ||
//     member.customId?.toString().includes(search)
//   );

//   /* ===== EDIT HANDLERS ===== */
//   const handleEditOpen = (member) => {
//     setEditData({
//       id: member._id,
//       customId: member.customId || '',
//       firstName: member.firstName || '',
//       lastName: member.lastName || '',
//       phone: member.phone || '',
//       department: member.department || '',
//       email: member.email || ''
//     });
//     setEditOpen(true);
//   };

//   const handleEditChange = (e) => {
//     setEditData({ ...editData, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = () => {
//     dispatch(editStaff(editData));
//     setEditOpen(false);
//   };

//   /* ===== DELETE HANDLERS ===== */
//   const handleDeleteClick = (id) => {
//     setDeleteConfirm({ open: true, id });
//   };

//   const handleDeleteConfirm = () => {
//     dispatch(deleteStaff(deleteConfirm.id));
//     setDeleteConfirm({ open: false, id: null });
//   };

//   return (
//     <>
//       <Grid container spacing={3}>

//         {/* SEARCH + ADD */}
//         <Grid item xs={12}>
//           <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Box display="flex" alignItems="center" gap={1} width="60%">
//                   <SearchOutlined />
//                   <TextField
//                     placeholder="Search Staff by Name or email..."
//                     fullWidth size="small"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                 </Box>
//                 <Button
//                   variant="contained"
//                   startIcon={<PlusOutlined />}
//                   onClick={() => setAddOpen(true)}
//                   sx={{
//                     borderRadius: 5, textTransform: 'none',
//                     backgroundColor: '#38c1b3',
//                     '&:hover': { backgroundColor: '#32a087' }
//                   }}
//                 >
//                   Add Staff
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* TABLE */}
//         <Grid item xs={12}>
//           <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//             <CardContent>

//               {/* HEADER */}
//               <Grid container mb={2} sx={{ fontWeight: 'bold', color: 'gray' }}>
//                 <Grid item xs={3}>Staff</Grid>
//                 <Grid item xs={1}>ID</Grid>
//                 <Grid item xs={3}>Department</Grid>
//                 <Grid item xs={2}>Phone</Grid>
//                 <Grid item xs={2}>Email</Grid>
//                 <Grid item xs={1} textAlign="center">Actions</Grid>
//               </Grid>

//               {loading && <Typography textAlign="center">Loading...</Typography>}

//               {!loading && filteredStaff.map((member) => (
//                 <Grid
//                   container key={member._id} alignItems="center"
//                   sx={{ py: 2, borderTop: '1px solid #eee', '&:hover': { backgroundColor: '#fafafa' } }}
//                 >
//                   <Grid item xs={3} display="flex" alignItems="center" gap={2}>
//                     <Avatar sx={{ backgroundColor: '#38c1b3' }}>
//                       {member.firstName?.charAt(0)}
//                     </Avatar>
//                     <Typography fontWeight="bold">
//                       {member.firstName} {member.lastName}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={1}>
//                     <Typography>{member.customId}</Typography>
//                   </Grid>
//                   <Grid item xs={3}>
//                     <Typography>{member.department}</Typography>
//                   </Grid>
//                   <Grid item xs={2}>
//                     <Typography>{member.phone}</Typography>
//                   </Grid>
//                   <Grid item xs={2}>
//                     <Typography color="primary">{member.email}</Typography>
//                   </Grid>

//                   {/* ACTIONS */}
//                   <Grid item xs={1} display="flex" justifyContent="center" gap={1}>
//                     <IconButton
//                       size="small"
//                       onClick={() => handleEditOpen(member)}
//                       sx={{ color: '#38c1b3' }}
//                     >
//                       <EditOutlined />
//                     </IconButton>
//                     <IconButton
//                       size="small"
//                       onClick={() => handleDeleteClick(member._id)}
//                       sx={{ color: '#ff4d4f' }}
//                     >
//                       <DeleteOutlined />
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//               ))}

//               {!loading && filteredStaff.length === 0 && (
//                 <Typography textAlign="center" mt={3} color="text.secondary">
//                   No staff found
//                 </Typography>
//               )}

//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* ADD MODAL */}
//       <AddStaffForm open={addOpen} handleClose={() => setAddOpen(false)} />

//       {/* EDIT MODAL */}
//       <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle>Edit Staff</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} mt={1}>
//             <Grid item xs={6}>
//               <TextField fullWidth label="Custom ID" name="customId"
//                 value={editData.customId} onChange={handleEditChange} />
//             </Grid>
//             <Grid item xs={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Department</InputLabel>
//                 <Select name="department" value={editData.department}
//                   label="Department" onChange={handleEditChange}>
//                   {DEPARTMENTS.map((dept) => (
//                     <MenuItem key={dept} value={dept}>{dept}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={6}>
//               <TextField fullWidth label="First Name" name="firstName"
//                 value={editData.firstName} onChange={handleEditChange} />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField fullWidth label="Last Name" name="lastName"
//                 value={editData.lastName} onChange={handleEditChange} />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField fullWidth label="Phone" name="phone"
//                 value={editData.phone} onChange={handleEditChange} />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField fullWidth label="Email" name="email"
//                 value={editData.email} onChange={handleEditChange} />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleEditSubmit}
//             sx={{
//               borderRadius: 5, textTransform: 'none',
//               backgroundColor: '#38c1b3',
//               '&:hover': { backgroundColor: '#32a087' }
//             }}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* DELETE CONFIRM */}
//       <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })}>
//         <DialogTitle>Delete Staff</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this staff member?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleDeleteConfirm}
//             sx={{ backgroundColor: '#ff4d4f', '&:hover': { backgroundColor: '#cc0000' } }}
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default StaffCard;













import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box,
  TextField, Button, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getStaff, deleteStaff, editStaff } from 'container/StaffContainer/slice';
import { userMe } from 'container/LoginContainer/slice';  // ✅ ADD
import AddStaffForm from './AddStaffsForm';

const DEPARTMENTS = [
  'Hospital Management',
  'Human Resource (HR) Department',
  'Finance & Accounts Department',
  'Medical Records Department (MRD)',
  'Quality Assurance Department',
  'Public Relations (PR) Department',
  'Information Technology (IT) Department',
  'Purchase & Supply Department',
  'Maintenance Department',
  'Housekeeping Department',
  'Security Department',
  'Biomedical Engineering Department'
];

const StaffCard = () => {
  const dispatch = useDispatch();
  const { staffList = [], loading } = useSelector((state) => state.staff || {});

  // ✅ ADD — get vendorId from Redux
  const userData = useSelector((state) => state?.login?.userData || {});
  const vendorId = userData?._id || userData?.id;

  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: '', customId: '', firstName: '', lastName: '',
    phone: '', department: '', email: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  // ✅ Step 1 — fetch userMe first on mount
  useEffect(() => {
    dispatch(userMe());
  }, [dispatch]);

  // ✅ Step 2 — fetch staff only after vendorId is ready
  useEffect(() => {
    if (vendorId) {
      dispatch(getStaff());
    }
  }, [dispatch, vendorId]);  // ✅ re-runs when vendorId becomes available

  const safeStaffList = Array.isArray(staffList) ? staffList : [];

  const filteredStaff = safeStaffList
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((member) =>
      member.email?.toLowerCase().includes(search.toLowerCase()) ||
      member.customId?.toString().includes(search)
    );

  const handleEditOpen = (member) => {
    setEditData({
      id: member._id,
      customId: member.customId || '',
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      phone: member.phone || '',
      department: member.department || '',
      email: member.email || ''
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    dispatch(editStaff(editData));
    setEditOpen(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteStaff(deleteConfirm.id));
    setDeleteConfirm({ open: false, id: null });
  };

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
                    placeholder="Search Staff by Name or email..."
                    fullWidth size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PlusOutlined />}
                  onClick={() => setAddOpen(true)}
                  sx={{
                    borderRadius: 5, textTransform: 'none',
                    backgroundColor: '#38c1b3',
                    '&:hover': { backgroundColor: '#32a087' }
                  }}
                >
                  Add Staff
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
                <Grid item xs={3}>Staff</Grid>
                <Grid item xs={1}>ID</Grid>
                <Grid item xs={3}>Department</Grid>
                <Grid item xs={2}>Phone</Grid>
                <Grid item xs={2}>Email</Grid>
                <Grid item xs={1} textAlign="center">Actions</Grid>
              </Grid>

              {loading && <Typography textAlign="center">Loading...</Typography>}

              {!loading && filteredStaff.map((member) => (
                <Grid
                  container key={member._id} alignItems="center"
                  sx={{ py: 2, borderTop: '1px solid #eee', '&:hover': { backgroundColor: '#fafafa' } }}
                >
                  <Grid item xs={3} display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ backgroundColor: '#38c1b3' }}>
                      {member.firstName?.charAt(0)}
                    </Avatar>
                    <Typography fontWeight="bold">
                      {member.firstName} {member.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>{member.customId}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{member.department}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>{member.phone}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography color="primary">{member.email}</Typography>
                  </Grid>
                  <Grid item xs={1} display="flex" justifyContent="center" gap={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditOpen(member)}
                      sx={{ color: '#38c1b3' }}
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(member._id)}
                      sx={{ color: '#ff4d4f' }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              {!loading && filteredStaff.length === 0 && (
                <Typography textAlign="center" mt={3} color="text.secondary">
                  No staff found
                </Typography>
              )}

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ADD MODAL */}
      <AddStaffForm open={addOpen} handleClose={() => setAddOpen(false)} />

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Staff</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField fullWidth label="Custom ID" name="customId"
                value={editData.customId} onChange={handleEditChange} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select name="department" value={editData.department}
                  label="Department" onChange={handleEditChange}>
                  {DEPARTMENTS.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="First Name" name="firstName"
                value={editData.firstName} onChange={handleEditChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Last Name" name="lastName"
                value={editData.lastName} onChange={handleEditChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone" name="phone"
                value={editData.phone} onChange={handleEditChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email" name="email"
                value={editData.email} onChange={handleEditChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
            sx={{
              borderRadius: 5, textTransform: 'none',
              backgroundColor: '#38c1b3',
              '&:hover': { backgroundColor: '#32a087' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })}>
        <DialogTitle>Delete Staff</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this staff member?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
            sx={{ backgroundColor: '#ff4d4f', '&:hover': { backgroundColor: '#cc0000' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StaffCard;