import colors from 'assets/scss/_themes-vars.module.scss';
import { color } from 'framer-motion';

const style = (theme) => ({
  tableStyle: {
    '&.MuiTable-root': {
      minWidth: 650
    }
  },
  tableHeader: {
    '&.MuiTableCell-root': {
      backgroundColor: colors.secondaryMain,
      color: colors.paper,
      fontWeight: 'bold',
      height: '60px'
    }
  },
  tablebody: {
    '&.MuiTableCell-root': {
      height: '55px'
    }
  },
  tableHeaderLabel: {
    '&.MuiTypography-root': {
      color: colors.paper,
      fontWeight: 'bold'
    }
  },
  tableRow1: {
    '&.MuiTableRow-root': {
      backgroundColor: colors.paper,
      '&:hover': {
        backgroundColor: colors.hoverColor
      }
    }
  },
  tableRow2: {
    '&.MuiTableRow-root': {
      backgroundColor: colors.tableGreay,
      '&:hover': {
        backgroundColor: colors.hoverColor
      }
    }
  },
  tableChipStyle1: {
    '&.MuiChip-root': {
      borderRadius: '5px',
      fontWeight: 'bold',
      color: 'white',
      background: colors.chipBrColor
    }
  },
  tableChipStyle2: {
    '&.MuiChip-root': {
      borderRadius: '5px',
      fontWeight: 'bold',
      color: colors.paper,
      background: colors.chipgrColor
    }
  },
  IcconButton: {
    '&.MuiButtonBase-root': {
      backgroundColor: colors.secondaryDark,
      color: colors.paper,
      borderRadius: '5px',
      padding: '5px',
      '&:hover': {
        backgroundColor: '#1565c0'
      }
    }
  },
  IcconButton2: {
    '&.MuiButtonBase-root': {
      backgroundColor: colors.actionRedColor,
      color: colors.paper,
      borderRadius: '5px',
      padding: '5px',
      '&:hover': {
        backgroundColor: '#1b5e20'
      }
    }
  },
  IcconButton3: {
    '&.MuiButtonBase-root': {
      backgroundColor: colors.actionGrColor,
      color: colors.paper,
      borderRadius: '5px',
      padding: '5px',
      '&:hover': {
        backgroundColor: '#b71c1c'
      }
    }
  },
  searchBox: {
    marginRight: '60px',
    marginBottom: '20px',
    // marginTop: '0px',
    maxWidth: { xs: '350px', lg: 'full' },
    backgroundColor: colors.paper,
    '&  .MuiFormControl-root': {
      maxWidth: '300px'
    },
    '& .MuiInputBase-input': {
      fontSize: '1rem',
      fontWeight: 'normal'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[400], // Default outline color (e.g., a light grey from your theme)
      borderRadius: '25px' // Ensure rounded corners on the outline
    },
    // Change outline color on hover
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.dark // Primary color on hover
    },
    // Change outline color when focused
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.dark, // A darker primary color when focused
      borderWidth: '1px' // Keep default border width or adjust as needed
    }
  },
  searchIcon: {
    color: colors.darkPaper,
    opacity: 0.5,
    fontSize: '20px'
  },
  activityTxt: {
    '&.MuiTypography-root': {
      textTransform: 'capitalize',
      fontWeight: 400,
      color: '#707070',
      fontSize: '14px',
      lineHeight: '2rem',
      position: 'relative',
      '&::after': {
        content: '":"',
        position: 'absolute',
        right: 2,
        fontWeight: 700
      }
    }
  },
  activityTxt2: {
    '&.MuiTypography-root': {
      textTransform: 'capitalize',
      fontWeight: 500,
      color: '#5c6873',
      fontSize: '14px',
      lineHeight: '2rem'
    }
  },
  userDetailsView: {
    '&.MuiGrid-root': {
      backgroundColor: '#3dcd58',
      borderTopLeftRadius: '10px',
      borderBottomLeftRadius: '10px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2
    }
  },
  userDetailsImg: {
    '&.MuiBox-root': {
      width: '100%',
      height: 'auto',
      maxWidth: '200px'
    }
  },
  userDetailsTxt2: {
    '&.MuiTypography-root': {
      fontWeight: 400,
      paddingTop: '8px',
      paddingBottom: '8px',
      position: 'relative',
      color: '#707070',
      '&::after': {
        content: '":"',
        position: 'absolute',
        right: 2,
        fontWeight: 700
      }
    }
  },
  userDetailsTxt3: {
    '&.MuiTypography-root': {
      display: 'block',
      width: '100%',
      paddingTop: '10px',
      paddingLeft: '8px',
      paddingBottom: '10px',
      fontSize: '14px',
      fontWeight: 400,
      color: '#5c6873',
      backgroundColor: 'hwb(168deg 89% 8% / 91%)',
      backgroundClip: 'padding-box',
      borderRadius: '0.25rem',
      overflow: 'auto'
    }
  },

  masterDataBtns: {
    '&.MuiButtonBase-root': {
      color: '#242121c9',
      backgroundColor: 'white',
      borderColor: '#3dcd58',
      width: '90px',
      paddingBottom: '7px',
      paddingTop: '7px',
      boxShadow: '0 0 0 0 rgba(65, 181, 222, 0.5)',
      borderRadius: '30px',
      marginRight: '20px',
      marginLeft: '0px',
      '&:hover': {
        color: '#fcf9f9 !important',
        backgroundColor: '#3dcd58',
        borderColor: '#3dcd58',
        boxShadow: '0 0 0 0 rgba(65, 181, 222, 0) !important'
      },
      '&:active': {
        color: '#fcf9f9 !important',
        backgroundColor: '#3dcd58',
        borderColor: '#3dcd58',
        width: '112px',
        boxShadow: '0 0 0 0 rgba(65, 181, 222, 0) !important'
      }
    }
  }
});

export default style