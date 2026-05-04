import MenuList from './MenuList';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import LogoSection from '../LogoSection';
import { useEffect, useState } from 'react';
import { drawerWidth } from 'store/constant';
import { largeDrawerWidth } from 'store/constant';
import MiniDrawerStyled from './MiniDrawerStyled';
import { useDispatch, useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, useTheme, Drawer } from '@mui/material';
import { BrowserView, MobileView } from 'react-device-detect';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const Sidebar = ({ drawerOpen, drawerToggle }) => {
  const theme = useTheme();
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const largeScreen = useMediaQuery('(min-width:1650px)');
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const width = largeScreen ? largeDrawerWidth : drawerWidth;
  const name = useSelector((state) => state?.arbitratorReducer?.profileUpdate?.user?.data || {});
  const isDraftOrPending = name?.custom_status && name?.custom_status !== 'Approved';

  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
      <BrowserView>
        <Box sx={{ position: 'relative', height: matchUpMd ? 'calc(100vh - 88px)' : 'calc(100vh - 99px)', paddingTop: '20px' }}>
          <Box sx={{ pointerEvents: isDraftOrPending ? 'none' : 'auto', opacity: isDraftOrPending ? 0.5 : 1 }}>
            <MenuList />
          </Box>
          {matchUpMd && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
                padding: '10px 16px',
                transition: 'width 0.4s ease',
                width: drawerOpen ? (largeScreen ? '240px' : '240px') : largeScreen ? '65px' : '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: '#f0f9f6',
                color: 'black',
                cursor: isDraftOrPending ? 'not-allowed' : 'pointer',
                zIndex: 1300
              }}
              onClick={drawerToggle}
            >
              {drawerOpen ? (
                <>
                  <span>Hide Panel</span>
                  <IconChevronLeft size={20} />
                </>
              ) : (
                <IconChevronRight size={20} />
              )}
            </Box>
          )}
        </Box>
      </BrowserView>
      <MobileView>
        <Box sx={{ position: 'relative', height: '100vh' }}>
          <Box sx={{ height: 'calc(100vh - 50px)', overflow: 'auto', px: 2 }}>
            <Box sx={{ pointerEvents: isDraftOrPending ? 'none' : 'auto', opacity: isDraftOrPending ? 0.5 : 1 }}>
              <MenuList />
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
              padding: '10px 16px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.palette.primary.dark,
              color: '#fff'
            }}
            onClick={drawerToggle}
          >
            <span style={{ fontSize: '0.75rem' }}>Hide Panel</span>
            <Button sx={{ minWidth: 0, color: '#fff' }}>
              {drawerOpen ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
            </Button>
          </Box>
        </Box>
      </MobileView>
    </>
  );

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? width : 'auto'
    
    }}>
      {matchUpMd ? (
        <MiniDrawerStyled
          variant={matchUpMd ? 'permanent' : 'temporary'}
          open={drawerOpen}
          sx={{
            '& .MuiDrawer-paper': {
              [theme.breakpoints.up('md')]: {
                top: '80px'
              }
            }
          }}
        >
          <Box sx={{ cursor: isDraftOrPending ? 'not-allowed' : 'pointer' }}>{drawer}</Box>
        </MiniDrawerStyled>
      ) : (
        <Drawer
          variant={matchUpMd ? 'persistent' : 'temporary'}
          anchor="left"
          open={drawerOpen}
          onClose={drawerToggle}
          
          sx={
            drawerOpen
              ? {
                  '& .MuiDrawer-paper': {
                    width: width,
                    backgroundColor: '#34699c',
                    paddingTop: '10px',
                    borderRight: 'none',
                    [theme.breakpoints.up('md')]: {
                      top: '60px'
                    }
                  }
                }
              : {
                  '& .MuiDrawer-paper': {
                    [theme.breakpoints.up('md')]: {
                      top: '60px',
                      borderRight: 'none',
                      zIndex: 1099,
                      overflowX: 'hidden',
                      width: '78px',
                      visibility: 'visible !important',
                      transform: 'none !important',
                      paddingTop: '10px',
                       backgroundColor: theme.palette.primary.main
                    }
                  },
                  transform: 'none !important'
                }
          }
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          <Box sx={{ cursor: isDraftOrPending ? 'not-allowed' : 'pointer' }}>{drawer}</Box>
        </Drawer>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
