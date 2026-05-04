import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { TeamOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import StaffCard from './StaffCard';
import MainCard from 'ui-component/cards/MainCard';

const Staff = () => {
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
                <TeamOutlined />
              </Box>

              {/* TITLE */}
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Staff Management
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  Manage hospital staff 👨‍⚕️
                </Typography>
              </Box>

            </Box>
          </Box>

          {/* MAIN CONTENT */}
          <StaffCard />

        </Box>
      </MainCard>
    </>
  );
};

export default Staff;