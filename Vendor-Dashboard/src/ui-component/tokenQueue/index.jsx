import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useDispatch } from 'react-redux';
import TokenQueueCard from './TokenQueueCard';
import MainCard from 'ui-component/cards/MainCard';

const TokenQueue = () => {
  const dispatch = useDispatch();
  const [limit] = useState(5);
  const [page] = useState(0);

  useEffect(() => {
    // Future Redux/API integration (if needed)
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
                <AccessTimeIcon />
              </Box>

              {/* TEXT */}
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Token Queue
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  Manage patient token queue ⏱️
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* MAIN SECTION */}
          <TokenQueueCard />

        </Box>
      </MainCard>
    </>
  );
};

export default TokenQueue;