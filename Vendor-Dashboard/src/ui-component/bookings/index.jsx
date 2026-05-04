import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch } from 'react-redux';
import BookingsCard from './BookingsCard';
import MainCard from 'ui-component/cards/MainCard';

const Bookings = () => {
  const dispatch = useDispatch();
  const [limit] = useState(5);
  const [page] = useState(0);

  useEffect(() => {
    // Future Redux/API logic
  }, [dispatch, limit, page]);

  return (
    <>
      <MainCard sx={{ boxShadow: 'none' }}>
        <Box>

          {/* HEADER */}
          <Box
            sx={{
              p: 1.5,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#f2f5f8',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              
              {/* ICON */}
              <Box
                sx={{
                  background: '#2eaf9e',
                  color: '#fff',
                  borderRadius: '50%',
                  height: 40,
                  width: 40,
                  mr: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CalendarMonthIcon />
              </Box>

              {/* TEXT */}
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Bookings
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  Manage appointment bookings 📅
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* MAIN SECTION */}
          <BookingsCard />

        </Box>
      </MainCard>
    </>
  );
};

export default Bookings;