export default function componentStyleOverrides() {
  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1d3848', 
          color: '#FFFFFF' 
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '&.Mui-selected': {
            color: '#0F3A2D', 
            backgroundColor: '#fff', 
            '&:hover': {
              backgroundColor: '#fff' 
            },
            '& .MuiListItemIcon-root': {
              color: '#0F3A2D' 
            }
          },
          // '&:hover': {
          //   backgroundColor: '#fff', 
          //   color: '#0F3A2D',
          //   '& .MuiListItemIcon-root': {
          //     color: '#0F3A2D'
          //   }
          // }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#FFFFFF'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#FFFFFF' 
        }
      }
    }
  };
}
