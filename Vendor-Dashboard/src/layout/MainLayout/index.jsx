import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import navigation from 'menu-items';
import AppBar from '@mui/material/AppBar';
import { Outlet } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

import Header from './Header';
import Sidebar from './Sidebar';
import { SET_MENU } from 'store/actions';
import { drawerWidth } from 'store/constant';
import { IconChevronRight } from '@tabler/icons-react';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import { CssBaseline, styled, useTheme } from '@mui/material';
import Footer from 'ui-component/common/footer';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: '20px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    width: `calc(100% - ${drawerWidth}px)`,
    padding: '16px',
    marginRight: '10px'
  }
}));


const MainLayout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const role = JSON.parse(localStorage.getItem('userDtls'));

  const name = useSelector((state) => state?.arbitratorReducer?.profileUpdate?.user?.data || {});
  const isDraftOrPending = name?.custom_status && name?.custom_status !== 'Approved';
  const flag = useSelector((state) => state?.arbitratorReducer?.profileUpdate?.profileFlag);

  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

 return (
  <>
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',   
      minHeight: '100vh',       
      cursor: isDraftOrPending ? 'not-allowed' : ''
    }}
    onClick={() => (!flag && isDraftOrPending ? setOpenPendingModal(true) : '')}
  >
    <CssBaseline />

    {/* Header */}
    <AppBar
      enableColorOnDark
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.default,
        transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
      }}
    >
      <Toolbar
        sx={{
          background: '#f0f9f6'
        }}
      >
        <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
      </Toolbar>
    </AppBar>

    {/* Main content + Sidebar */}
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      <Main
        sx={{
          marginLeft: leftDrawerOpened ? '0px' : matchDownMd ? '20px' : '-190px !important',
          marginRight: '0px',
          pointerEvents: isDraftOrPending ? 'none' : '',
          opacity: isDraftOrPending ? 0.5 : '',
        }}
        theme={theme}
        open={leftDrawerOpened}
      >
        {/* Breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        <Outlet />
      </Main>
    </Box>
  </Box>
   <Footer />
  </>
);

};

export default MainLayout;
