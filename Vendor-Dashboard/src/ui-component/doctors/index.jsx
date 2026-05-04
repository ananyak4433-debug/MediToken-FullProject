import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import DoctorsCard from './DoctorsCard';
import MainCard from 'ui-component/cards/MainCard';

const Doctors = () => {
  const dispatch = useDispatch();
  const [limit] = useState(5);
  const [page] = useState(0);

  useEffect(() => {
    // You can add Redux calls here later if needed
  }, [dispatch, limit, page]);

  return (
    <>
      <MainCard sx={{ boxShadow: 'none' }}>
        <Box>

          {/* HEADER (same as dashboard) */}
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
                <UserOutlined />
              </Box>

              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Doctors Management
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  Manage hospital doctors 👨‍⚕️
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* MAIN SECTION (like AnalyticsCard) */}
          <DoctorsCard />

        </Box>
      </MainCard>
    </>
  );
};

export default Doctors;