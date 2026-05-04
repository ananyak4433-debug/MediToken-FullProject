import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme,
  Box,
  Typography
} from '@mui/material';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconSettings, IconLogout } from '@tabler/icons-react';
// import UserProfileDrawer from 'ui-component/common/userProfile';
import doorCloseAnimation from 'assets/Gif/Door-Animation.json';
// import ResetPasswordProfile from 'ui-component/common/userProfile/resetpassword';
// import { setProfileFlag } from 'module/arbitrator/container/arbitratorProfile/slice';

const ResponsiveIcons = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [resetscreenDrawerOpen, setResetscreenDrawerOpen] = useState(false);
  const flag = useSelector((state) => state?.arbitratorReducer?.profileUpdate?.profileFlag);
  const name = useSelector((state) => state?.arbitratorReducer?.profileUpdate?.user?.data || {});
  const isDraftOrPending = name?.custom_status && name?.custom_status !== 'Approved';

  const handleMenuClose = () => setAnchorEl(null);
  const handleLogoutClick = () => setLogoutOpen(true);
  const handleLogoutClose = () => setLogoutOpen(false);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('Token');
    setLogoutOpen(false);
    navigate('/login');
  };

  const profilescreenOpen = () => {
    // dispatch(setProfileFlag({ flag: true }));
  };

  const profilescreenClose = () => {
    dispatch(setProfileFlag({ flag: false }));
  };

  const resetscreenOpen = () => {
    setResetscreenDrawerOpen(true);
  };

  const resetscreenClose = () => {
    setResetscreenDrawerOpen(false);
  };

  const userDtls = JSON.parse(localStorage.getItem('userDtls')) || {};

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
      {/* Settings Icon */}
      {userDtls?.message?.roles ? (
        <IconButton
          sx={{ color: '#fff',bgcolor:'#03c1a4ff', pointerEvents: isDraftOrPending ? 'none' : 'auto', cursor: isDraftOrPending ? 'not-allowed' : 'pointer' }}
          onClick={handleMenuOpen}
        >
          <IconSettings size={matchesXs ? 25 : 30} />
        </IconButton>
      ) : (
        ''
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() => {
            profilescreenOpen();
            handleMenuClose();
          }}
        >
          Profile
        </MenuItem>

        {/* )} */}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            resetscreenOpen();
          }}
        >
          Reset Password
        </MenuItem>
      </Menu>

      {/* <UserProfileDrawer open={flag} profilescreenClose={profilescreenClose} />
      <ResetPasswordProfile open={resetscreenDrawerOpen} resetscreenClose={resetscreenClose} /> */}

      {/* Logout Icon */}
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          handleLogoutClick();
        }}
        sx={{
          color: 'white',
          backgroundColor: '#3fb7a5ff', 
          '&:hover': {
            backgroundColor: '#0f998eff' 
          },
          padding: matchesXs ? '6px' : '8px'
        }}
      >
        <IconLogout size={matchesXs ? 25 : 30} />
      </IconButton>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={logoutOpen}
        onClose={handleLogoutClose}
        onClick={(event) => {
          event.stopPropagation();
        }}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 4,
            padding: 3,
            width: 400
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Lottie animationData={doorCloseAnimation} style={{ height: 80 }} />
        </Box>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Are You Sure You Want to Logout?</DialogTitle>
        <DialogContent>
          <Typography textAlign="center"> You'll be redirected to the login screen.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleLogoutClose();
            }}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: '#0f998eff',
              color: '#3fb7a5ff',
              '&:hover': {
                borderColor: '#0f998eff',
                backgroundColor: '#34699c0a'
              }
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              handleLogoutConfirm();
            }}
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              backgroundColor: '#3fb7a5ff',
              '&:hover': {
                backgroundColor: '#0f998eff'
              }
            }}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResponsiveIcons;
