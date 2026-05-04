// import PropTypes from 'prop-types';
// import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// const Card = ({ color, bgTheme, title, count, percentage, isLoss, icon }) => {


//   return (
//     <Box sx={{ background: bgTheme, padding: '20px', borderRadius: '10px' }}>
//       <Stack spacing={0.5}>
//         <Grid sx={{ pb: 1.5 }} item xs zeroMinWidth>
//           <Box

          
//             sx={{
//               background: color,
//               color: '#fff',
//               borderRadius: '12px',
//               p: 1,
//               display: 'inline-flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '1.2rem'
//             }}
//           >
//             {icon}
//           </Box>
//         </Grid>
//         <Typography variant="h6" sx={{ color: color, fontWeight: '500', fontSize: '0.83rem' }}>
//           {title}
//         </Typography>
//         <Grid item>
//           <Typography variant="h4" sx={{ color: 'black', fontWeight: 'bold' }}>
//             {count}
//           </Typography>
//         </Grid>
//         {percentage && (
//           <Grid item>
//             <Chip
//               variant="combined"
//               color={color}
//               icon={
//                 <>
//                   {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
//                   {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
//                 </>
//               }
//               label={`${percentage}%`}
//               sx={{ pl: 1 }}
//               size="small"
//             />
//           </Grid>
//         )}
//       </Stack>
//     </Box>
//   );
// };

// Card.propTypes = {
//   color: PropTypes.string,
//   title: PropTypes.string,
//   count: PropTypes.string,
//   icon: PropTypes.node,
//   percentage: PropTypes.number,
//   isLoss: PropTypes.bool
// };

// Card.defaultProps = {
//   color: 'primary'
// };

// export default Card;
