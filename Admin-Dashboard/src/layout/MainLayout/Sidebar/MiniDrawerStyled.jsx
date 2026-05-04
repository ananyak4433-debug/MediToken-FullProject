import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { drawerWidth } from 'store/constant';
import { largeDrawerWidth } from 'store/constant';
import { useMediaQuery } from '@mui/system';

function openedMixin(theme) {
  const largeScreen = useMediaQuery('(min-width:1650px)');
  const width = largeScreen ? largeDrawerWidth : drawerWidth;
  return {
    width: width,
    borderRight: 'none',
    zIndex: 1099,
    background: '#f0f9f6',
    overflowX: 'hidden',
    boxShadow: 'none',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen + 200
    })
  };
}

function closedMixin(theme) {
  return {
    borderRight: 'none',
    zIndex: 1099,
    background: 'white',
    overflowX: 'hidden',
    width: 65,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen + 200
    })
  };
}

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  borderRight: '0px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  }),
  [theme.breakpoints.down('md')]: {
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      top: '0 !important',
      left: '0',
      zIndex: 1200
    }
  }
}));

export default MiniDrawerStyled;
