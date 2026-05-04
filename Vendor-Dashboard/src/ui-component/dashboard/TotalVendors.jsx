// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { Avatar, Stack, Typography, Box } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// // icons
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// export default function TotalVendorsCard({ isLoading, totalVendors = 24 }) {
//   return (
//     <>
//       {isLoading ? (
//         <SkeletonEarningCard />
//       ) : (
//         <MainCard
//           border={false}
//           content={false}
//           sx={{
//             borderRadius: '16px',
//             height: 140,
//             boxShadow: '0px 4px 12px rgba(0,0,0,0.05)'
//           }}
//         >
//           <Box sx={{ p: 2 }}>
            
//             <Stack direction="row" justifyContent="space-between" alignItems="center">

//               {/* ICON */}
//               <Avatar
//                 sx={{
//                   backgroundColor: '#E3F2FD',
//                   width: 42,
//                   height: 42,
//                   borderRadius: '10px',
//                   background: 'linear-gradient(135deg,#8E2DE2,#4A00E0)',
//                   color: '#fff'
//                 }}
//               >
//                 <LocalHospitalIcon />
//               </Avatar>

//               {/* PERCENT BADGE */}
//               <Box
//                 sx={{
//                   bgcolor: '#E8F8F2',
//                   color: '#1AB394',
//                   px: 1.2,
//                   py: 0.3,
//                   borderRadius: '20px',
//                   fontSize: '12px',
//                   fontWeight: 600
//                 }}
//               >
//                 ↑ 12%
//               </Box>

//             </Stack>

//             {/* NUMBER */}
//             <Typography
//               sx={{
//                 fontSize: '28px',
//                 fontWeight: 700,
//                 mt: 2
//               }}
//             >
//               {totalVendors}
//             </Typography>

//             {/* TITLE */}
//             <Typography
//               sx={{
//                 fontSize: '14px',
//                 color: '#6B7280'
//               }}
//             >
//               Total Vendors
//             </Typography>

//           </Box>
//         </MainCard>
//       )}
//     </>
//   );
// }

// TotalVendorsCard.propTypes = {
//   isLoading: PropTypes.bool,
//   totalVendors: PropTypes.number
// };