// import React, { useEffect, useState } from "react";
// import {
//     Avatar,
//     Box,
//     Chip,
//     Stack,
//     Typography,
//     TextField,
//     InputAdornment,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

// import MainCard from "ui-component/cards/MainCard";

// export default function RegisteredHospitalsCard() {

//     const [vendors, setVendors] = useState([]);
//     const [search, setSearch] = useState("");

//     /* ================= FETCH VENDORS ================= */

//     const fetchVendors = async () => {
//         try {
//             const res = await fetch("http://localhost:5000/admin/vendors");
//             const data = await res.json();

//             if (data && Array.isArray(data.vendors)) {
//                 setVendors(data.vendors);
//             } else {
//                 setVendors([]);
//             }
//         } catch (error) {
//             console.log(error);
//             setVendors([]);
//         }
//     };

//     useEffect(() => {
//         fetchVendors();
//     }, []);

//     /* ================= SEARCH FILTER ================= */

//     const filteredVendors = vendors.filter((vendor) =>
//         vendor.organisationName?.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <MainCard sx={{ borderRadius: "16px" }}>

//             {/* Header */}
//             <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 sx={{ mb: 2 }}
//             >
//                 <Typography fontSize={20} fontWeight={600}>
//                     Registered Vendors
//                 </Typography>

//                 <TextField
//                     placeholder="Search vendors..."
//                     size="small"
//                     sx={{ width: 250 }}
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                                 <SearchIcon />
//                             </InputAdornment>
//                         )
//                     }}
//                 />
//             </Stack>

//             {/* Table */}
//             <TableContainer>
//                 <Table>

//                     <TableHead>
//                         <TableRow>
//                             <TableCell><b>Hospital Name</b></TableCell>
//                             <TableCell><b>Email</b></TableCell>
//                             <TableCell><b>Phone</b></TableCell>
//                             <TableCell><b>Status</b></TableCell>
//                         </TableRow>
//                     </TableHead>

//                     <TableBody>

//                         {filteredVendors.length > 0 ? (

//                             filteredVendors.map((vendor, index) => (

//                                 <TableRow key={index}>

//                                     {/* Hospital */}
//                                     <TableCell>
//                                         <Stack direction="row" spacing={2} alignItems="center">

//                                             <Avatar
//                                                 sx={{
//                                                     bgcolor: "#3B82F6",
//                                                     width: 40,
//                                                     height: 40,
//                                                     color: "#fff"
//                                                 }}
//                                             >
//                                                 <LocalHospitalIcon />
//                                             </Avatar>

//                                             <Box>
//                                                 <Typography fontWeight={600}>
//                                                     {vendor.organisationName}
//                                                 </Typography>

//                                                 <Typography fontSize={13} color="text.secondary">
//                                                     {vendor.address}
//                                                 </Typography>
//                                             </Box>

//                                         </Stack>
//                                     </TableCell>

//                                     {/* Email */}
//                                     <TableCell>{vendor.email}</TableCell>

//                                     {/* Phone */}
//                                     <TableCell>{vendor.phone}</TableCell>

//                                     {/* Status */}
//                                     <TableCell>
//                                         <Chip
//                                             label={vendor.status || "Active"}
//                                             sx={{
//                                                 bgcolor: "#22c55e",
//                                                 color: "#fff",
//                                                 fontWeight: 600
//                                             }}
//                                         />
//                                     </TableCell>

//                                 </TableRow>

//                             ))

//                         ) : (

//                             <TableRow>
//                                 <TableCell colSpan={4} align="center">
//                                     No Vendors Found
//                                 </TableCell>
//                             </TableRow>

//                         )}

//                     </TableBody>

//                 </Table>
//             </TableContainer>

//         </MainCard>
//     );
// }
