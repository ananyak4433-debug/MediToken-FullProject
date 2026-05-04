import React from 'react';
import { AppBar, Toolbar, Typography, Link, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { drawerWidth } from 'store/constant';
const AppVersion = import.meta.env.VITE_APP_VERSION;

const Footer = () => {
  const theme = useTheme();
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 'auto',
        bottom: 0,
        borderTop:'1px solid #d3d3d380',
        width: {
          xs: '100%',
          md: leftDrawerOpened ? `calc(100% - ${drawerWidth}px)` : '100%'
        },
        ml: {
          md: leftDrawerOpened ? `${drawerWidth}px` : 0
        },
        height: 50,
        background: 'white',
        color: 'grey',
        zIndex: 1000,
        transition: 'width 0.6s ease, margin-left 0.3s ease'
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%' 
        }}
      >
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
         Smart Healthcare Token Management System
         
        </Typography>
        <Typography color="grey" variant="caption" >
          Version : {AppVersion}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
