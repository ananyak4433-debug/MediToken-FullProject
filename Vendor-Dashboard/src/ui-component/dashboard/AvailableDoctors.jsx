// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { Avatar, Stack, Typography, Box } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// // icon
// import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

// export default function AvailableDoctorsCard({ isLoading, totalDoctors = 14 }) {
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
//                                     background: 'linear-gradient(135deg,#10B981,#34D399)',
//                                     color: '#fff'
//                                 }}
//                             >
//                                 <MedicalServicesIcon />
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
//                                 ↑ 5%
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
//                             {totalDoctors}
//                         </Typography>

//                         {/* TITLE */}
//                         <Typography
//                             sx={{
//                                 fontSize: '14px',
//                                 color: '#6B7280'
//                             }}
//                         >
//                             Available Doctors
//                         </Typography>

//                     </Box>
//                 </MainCard>
//             )}
//         </>
//     );
// }

// AvailableDoctorsCard.propTypes = {
//     isLoading: PropTypes.bool,
//     totalDoctors: PropTypes.number
// };