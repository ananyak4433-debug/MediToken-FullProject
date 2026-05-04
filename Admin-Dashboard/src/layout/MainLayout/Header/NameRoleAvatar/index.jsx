import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Stack, Typography, Box, Divider, Menu, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ProfileSection from 'layout/MainLayout/Header/ProfileSection';

import { userMe } from 'container/LoginContainer/slice';

const stringAvatar = (name) => ({
  sx: {
    bgcolor: '#ffffff54',
    width: 40,
    height: 40,
    fontSize: '17px',
    fontWeight: 500,
    color: '#FFFFFF',
    cursor: 'pointer'
  },
  children: name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'
});

export default function BackgroundLetterAvatars() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const userData = useSelector((state) => state?.login?.userData || {});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userMe());
  }, [dispatch]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Extract user info
  const name = userData?.fullName || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User';
  const email = userData?.email || 'user@email.com';
  const phone = userData?.phone || 'N/A';
  const role = userData?.role || 'N/A';
  const status = userData?.status || 'N/A';
  const district = userData?.district || 'N/A';
  const userType = userData?.userType || 'N/A';

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{
          borderRadius: 2,
          width: '100%'
        }}
      >
        {/* Left side: empty or title */}
        <Typography sx={{ color: '#fff', fontWeight: 300 }}>{}</Typography>

        {/* Right side: Avatar + Info + Dropdown */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar onClick={handleAvatarClick}  sx={{ cursor: 'pointer' }}/>

          <Box sx={{ ml: 1 }}>
            <Typography variant="body1" sx={{ color: 'black', fontWeight: 500 }}>
              {name}
            </Typography>

            <Typography variant="body2" sx={{ color: '#364152' }}>
              {role
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
                .trim()}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: '#D1D5DB', mx: 1, flexShrink: 0 }} />

          <Box sx={{ ml: 1 }}>
            <ProfileSection />
          </Box>
        </Stack>
      </Stack>

      {/* Profile Info Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            minWidth: 270,
            p: 2,
            backgroundColor: '#ffffff',
            color: '#fff',
            boxShadow: '0px 4px 16px rgba(0,0,0,0.3)'
          }
        }}
      >
        <Stack direction="column" alignItems="center" spacing={1.2}>
          <Avatar {...stringAvatar(name)} sx={{ width: 60, height: 60, bgcolor: '#34699c', color: '#fff' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#364152' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#364152' }}>
            {role
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
              .trim()}
          </Typography>

          <Divider sx={{ width: '100%', my: 1, bgcolor: '#475569' }} />

          {/* Profile details */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ color: '#364152', mb: 0.5 }}>
              <strong>Email:</strong> {email}
            </Typography>
            <Typography variant="body2" sx={{ color: '#364152', mb: 0.5 }}>
              <strong>Phone:</strong> {phone}
            </Typography>
            {district !== 'N/A' && (
              <Typography variant="body2" sx={{ color: '#364152', mb: 0.5 }}>
                <strong>District:</strong> {district}
              </Typography>
            )}
            {/* <Typography variant="body2" sx={{ color: '#364152', mb: 0.5 }}>
              <strong>User Type:</strong> {userType}
            </Typography> */}
            <Typography variant="body2" sx={{ color: '#364152' }}>
              <strong>Status:</strong>{' '}
              <span
                style={{
                  color: status === 'active' ? '#22c55e' : '#ef4444',
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              >
                {status}
              </span>
            </Typography>
          </Box>
        </Stack>
      </Menu>
    </>
  );
}
