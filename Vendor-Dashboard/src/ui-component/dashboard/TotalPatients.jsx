// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { Avatar, Stack, Typography, Box } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// // icon
// import PersonIcon from '@mui/icons-material/Person';

// export default function TotalPatientsCard({ isLoading, totalPatients = 124 }) {
//     return (
//         <>
//             {isLoading ? (
//                 <SkeletonEarningCard />
//             ) : (
//                 <MainCard
//                     border={false}
//                     content={false}
//                     sx={{
//                         borderRadius: '16px',
//                         height: 140,
//                         boxShadow: '0px 4px 12px rgba(0,0,0,0.05)'
//                     }}
//                 >
//                     <Box sx={{ p: 2 }}>

//                         <Stack direction="row" justifyContent="space-between">

//                             {/* ICON */}
//                             <Avatar
//                                 sx={{
//                                     width: 42,
//                                     height: 42,
//                                     borderRadius: '10px',
//                                     background: 'linear-gradient(135deg,#4FACFE,#00F2FE)',
//                                     color: '#fff'
//                                 }}
//                             >
//                                 <PersonIcon />
//                             </Avatar>

//                             {/* PERCENT BADGE */}
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: "4px",
//                                     bgcolor: "#E6F4EA",
//                                     color: "#16A34A",
//                                     px: 1.2,
//                                     py: 0.3,
//                                     borderRadius: "20px",
//                                     fontSize: "12px",
//                                     fontWeight: 600
//                                 }}
//                             >
//                                 ↑ 15%
//                             </Box>

//                         </Stack>

//                         {/* NUMBER */}
//                         <Typography
//                             sx={{
//                                 fontSize: '28px',
//                                 fontWeight: 700,
//                                 mt: 2
//                             }}
//                         >
//                             {totalPatients}
//                         </Typography>

//                         {/* TITLE */}
//                         <Typography
//                             sx={{
//                                 fontSize: '14px',
//                                 color: '#6B7280'
//                             }}
//                         >
//                             Total Patients
//                         </Typography>

//                     </Box>
//                 </MainCard>
//             )}
//         </>
//     );
// }

// TotalPatientsCard.propTypes = {
//     isLoading: PropTypes.bool,
//     totalPatients: PropTypes.number
// };