// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   TextField,
//   Avatar
// } from '@mui/material';

// import { SearchOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const PatientsCard = () => {
//   const [patients, setPatients] = useState([]);
//   const [search, setSearch] = useState('');

//   // ✅ FETCH PATIENTS (SAFE)
//   const fetchPatients = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/patients');

//       console.log("API RESPONSE:", res.data); // 🔍 debug once

//       // ✅ handle all possible formats
//       if (Array.isArray(res.data)) {
//         setPatients(res.data);
//       } else if (Array.isArray(res.data.patients)) {
//         setPatients(res.data.patients);
//       } else if (Array.isArray(res.data.data)) {
//         setPatients(res.data.data);
//       } else {
//         setPatients([]);
//       }

//     } catch (err) {
//       console.error(err);
//       setPatients([]); // fallback
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   // ✅ SAFE FILTER (NO CRASH)
//   const filteredPatients = Array.isArray(patients)
//     ? patients.filter((p) =>
//         p?.name?.toLowerCase().includes(search.toLowerCase())
//       )
//     : [];

//   return (
//     <Grid container spacing={3}>

//       {/* SEARCH */}
//       <Grid item xs={12}>
//         <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//           <CardContent>
//             <Box display="flex" alignItems="center" gap={1}>
//               <SearchOutlined />
//               <TextField
//                 placeholder="Search patients..."
//                 fullWidth
//                 size="small"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* TABLE */}
//       <Grid item xs={12}>
//         <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//           <CardContent>

//             {/* HEADER */}
//             <Grid container mb={2} sx={{ fontWeight: 'bold', color: 'gray' }}>
//               <Grid item xs={4}>Patient</Grid>
//               <Grid item xs={3}>Contact</Grid>
//               <Grid item xs={2}>Age</Grid>
//               <Grid item xs={2}>Gender</Grid>
//               <Grid item xs={1}>Token</Grid>
//             </Grid>

//             {/* EMPTY STATE */}
//             {filteredPatients.length === 0 && (
//               <Typography align="center" color="text.secondary" mt={3}>
//                 No patients found
//               </Typography>
//             )}

//             {/* DATA */}
//             {filteredPatients.map((p) => (
//               <Grid
//                 container
//                 key={p._id}
//                 alignItems="center"
//                 sx={{
//                   py: 2,
//                   borderTop: '1px solid #eee',
//                   '&:hover': { backgroundColor: '#fafafa' }
//                 }}
//               >
//                 <Grid item xs={4} display="flex" alignItems="center" gap={2}>
//                   <Avatar>{p?.name?.charAt(0)}</Avatar>
//                   <Box>
//                     <Typography fontWeight="bold">{p?.name || 'N/A'}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       ID: {p?._id || '-'}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <Typography color="primary">{p?.email || '-'}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {p?.phone || '-'}
//                   </Typography>
//                 </Grid>

//                 <Grid item xs={2}>
//                   <Typography>{p?.age || '-'}</Typography>
//                 </Grid>

//                 <Grid item xs={2}>
//                   <Typography>{p?.gender || '-'}</Typography>
//                 </Grid>

//                 <Grid item xs={1}>
//                   <Typography fontWeight="bold">
//                     {p?.tokenNumber || '-'}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             ))}

//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default PatientsCard;





// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   TextField,
//   Avatar
// } from '@mui/material';

// import { SearchOutlined } from '@ant-design/icons';
// import { useDispatch, useSelector } from 'react-redux';

// import { getPatientsRequest } from 'container/PatientContainer/slice';

// const PatientsCard = () => {
//   const dispatch = useDispatch();

//   const { patients, loading } = useSelector(
//     (state) => state.patients
//   );

//   const [search, setSearch] = useState('');

//   // 🔥 FETCH FROM SAGA
//   useEffect(() => {
//     dispatch(getPatientsRequest());
//   }, [dispatch]);

//   const fullState = useSelector((state) => state);
// console.log("REDUX STATE:", fullState);

//   // ✅ FILTER
//   const filteredPatients = patients?.filter((p) =>
//     p?.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Grid container spacing={3}>

//       {/* SEARCH */}
//       <Grid item xs={12}>
//         <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//           <CardContent>
//             <Box display="flex" alignItems="center" gap={1}>
//               <SearchOutlined />
//               <TextField
//                 placeholder="Search patients..."
//                 fullWidth
//                 size="small"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* TABLE */}
//       <Grid item xs={12}>
//         <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
//           <CardContent>

//             {loading && (
//               <Typography align="center">Loading...</Typography>
//             )}

//             {!loading && filteredPatients?.length === 0 && (
//               <Typography align="center" color="text.secondary" mt={3}>
//                 No patients found
//               </Typography>
//             )}

//             {!loading && filteredPatients?.map((p) => (
//               <Grid
//                 container
//                 key={p._id}
//                 alignItems="center"
//                 sx={{
//                   py: 2,
//                   borderTop: '1px solid #eee',
//                   '&:hover': { backgroundColor: '#fafafa' }
//                 }}
//               >
//                 <Grid item xs={4} display="flex" alignItems="center" gap={2}>
//                   <Avatar>{p?.name?.charAt(0)}</Avatar>
//                   <Box>
//                     <Typography fontWeight="bold">{p?.name || 'N/A'}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       ID: {p?._id || '-'}
//                     </Typography>
//                   </Box>
//                 </Grid>

//                 <Grid item xs={3}>
//                   <Typography color="primary">{p?.email || '-'}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {p?.phone || '-'}
//                   </Typography>
//                 </Grid>

//                 <Grid item xs={2}>
//                   <Typography>{p?.age || '-'}</Typography>
//                 </Grid>

//                 <Grid item xs={2}>
//                   <Typography>{p?.gender || '-'}</Typography>
//                 </Grid>

//                 <Grid item xs={1}>
//                   <Typography fontWeight="bold">
//                     {p?.tokenNumber || '-'}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             ))}

//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default PatientsCard;










import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Avatar
} from '@mui/material';

import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { getPatientsRequest } from 'container/PatientContainer/slice';

const PatientsCard = () => {
  const dispatch = useDispatch();

  const { patients, loading } = useSelector((state) => state.patients);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getPatientsRequest());
  }, [dispatch]);

  const filteredPatients = patients
  ?.slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
  .filter((p) => p?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Grid container spacing={3}>

      {/* SEARCH */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <SearchOutlined />
              <TextField
                placeholder="Search patients..."
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* TABLE */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>

            {loading && (
              <Typography align="center">Loading...</Typography>
            )}

            {!loading && filteredPatients?.length === 0 && (
              <Typography align="center" color="text.secondary" mt={3}>
                No patients found
              </Typography>
            )}

            {/* COLUMN HEADERS */}
            {!loading && filteredPatients?.length > 0 && (
              <Grid
                container
                alignItems="center"
                sx={{
                  py: 1,
                  borderBottom: '2px solid #e0e0e0',
                  mb: 1
                }}
              >
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Patient
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Contact
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Age
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Gender
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                    Token
                  </Typography>
                </Grid>
              </Grid>
            )}

            {/* PATIENT ROWS */}
            {!loading && filteredPatients?.map((p) => (
              <Grid
                container
                key={p._id}
                alignItems="center"
                sx={{
                  py: 2,
                  borderTop: '1px solid #eee',
                  '&:hover': { backgroundColor: '#fafafa' }
                }}
              >
                <Grid item xs={4} display="flex" alignItems="center" gap={2}>
                  <Avatar>{p?.name?.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight="bold">{p?.name || 'N/A'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {p?._id || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={3}>
                  <Typography color="primary">{p?.email || '-'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p?.phone || '-'}
                  </Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography>{p?.age || '-'}</Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography>{p?.gender || '-'}</Typography>
                </Grid>

                <Grid item xs={1}>
                  <Typography fontWeight="bold">
                    {p?.tokenNumber || '-'}
                  </Typography>
                </Grid>
              </Grid>
            ))}

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PatientsCard;