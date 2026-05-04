// import PropTypes from 'prop-types';
// import React from 'react';

// // material-ui
// import { Avatar, Stack, Typography, Box } from '@mui/material';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// // icon
// import CancelIcon from '@mui/icons-material/Cancel';

// export default function CancelledBookingsCard({ isLoading, totalCancelled = 6 }) {
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

//             <Stack direction="row" justifyContent="space-between">

//               {/* ICON */}
//               <Avatar
//                 sx={{
//                   width: 42,
//                   height: 42,
//                   borderRadius: '10px',
//                   background: 'linear-gradient(135deg,#EF4444,#F87171)',
//                   color: '#fff'
//                 }}
//               >
//                 <CancelIcon />
//               </Avatar>

//               {/* PERCENT BADGE */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "4px",
//                   bgcolor: "#FEF2F2",
//                   color: "#DC2626",
//                   px: 0.9,
//                   py: 0.2,
//                   borderRadius: "20px",
//                   fontSize: "11px",
//                   fontWeight: 600,
//                   lineHeight: 1
//                 }}
//               >
//                 ↓ 3%
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
//               {totalCancelled}
//             </Typography>

//             {/* TITLE */}
//             <Typography
//               sx={{
//                 fontSize: '14px',
//                 color: '#6B7280'
//               }}
//             >
//               Cancelled Bookings
//             </Typography>

//           </Box>
//         </MainCard>
//       )}
//     </>
//   );
// }

// CancelledBookingsCard.propTypes = {
//   isLoading: PropTypes.bool,
//   totalCancelled: PropTypes.number
// };