const style = (theme) => ({
  commonLinkStyles: {
    color: '#222222b3 !important',
    textDecoration: 'none',
    padding: '6px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'underline',

    fontWeight: '500',
    '&:hover': {
    //   color: ${theme.palette.primary.dark} !important,
      textDecoration: 'underline'
      // backgroundColor: 'rgba(0, 0, 0, 0.05)'
    },
    '&.MuiLink-root': {
      textDecoration: 'none'
    }
  },

  ProjectTabSectionFilled: {
    '&.MuiTabs-root': {
      marginRight: '5px',
      borderRadius: '4px',
      backgroundColor: "#fff",
      color: '#fff',
      minHeight: '48px',
      marginTop: '80px',
       backgroundColor: `${theme.palette.primary.dark}`
    },
    '& .MuiTabs-flexContainer': {
      borderBottom: 'none',
      gap: '20px'
    },
    '& .MuiButtonBase-root.MuiTab-root': {
      alignItems: 'center',
      fontSize: '14px',
      fontFamily: theme.palette.fontFamily,
      borderRadius: '4px',
      height: '46px',
      minHeight: '46px',
      color: '#fff',
      fontWeight: 'normal',
      padding: '0px 15px 0px 15px',
      borderBottom: 'none'
    },

    '& .MuiTabs-indicator': {
      backgroundColor: '#fff',
      height: '3px'
    },
    '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
      color: '#fff',
      backgroundColor: theme.palette.primary.dark,
      fontWeight: '500',
      padding: '0px 15px 0px 15px',
      fontFamily: theme.palette.fontFamily,
      borderBottom: 'none'
    }
  },
  ProjectTabSection: {
    '&.MuiTabs-root': {
      marginRight: '5px',
      borderRadius: '4px',
      backgroundColor: "#fff",
      color: '#000',
      minHeight: '48px'
    },
    '& .MuiTabs-flexContainer': {
      borderBottom: 'none',
      gap: '20px'
    },
    '& .MuiButtonBase-root.MuiTab-root': {
      alignItems: 'center',
      fontSize: '14px',
      fontFamily: theme.palette.fontFamily,
      borderRadius: '4px',
      height: '46px',
      minHeight: '46px',
      color: '#000',
      fontWeight: 'normal',
      padding: '0px 15px 0px 15px',
      borderBottom: 'none'
    },
    '& .MuiTabs-indicator': {
    //   backgroundColor: ${theme.palette.primary.dark},
      height: '2px'
    },
    '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
    //   color: ${theme.palette.primary.dark},
      backgroundColor: "#fff",
      fontWeight: '500',
      padding: '0px 15px 0px 15px',
      fontFamily: theme.palette.fontFamily,
      borderBottom: 'none'
    }
  },
  simplifiedValueStyle: {
    '&.MuiBox-root': {
      position: 'relative',
      pl: '10px',
      '&::before': {
        content: '":"',
        position: 'absolute',
        left: '2px',
        fontWeight: 700,
        color: theme.palette.text.secondary || '#707070'
      }
    }
  },
  simplifiedLabelStyle: {
    '&.MuiTypography-root': {
      fontWeight: 600,
      fontSize: '14px',
      color: theme.palette.text.secondary || '#707070',
      margin: 0,
      textTransform: 'capitalize !important'
    }
  },
  tableStyle: {
    '&.MuiTable-root': {
      minWidth: 650
    }
  },
  // Add tableHeaderStyle here
  tableHeaderStyle: {
    backgroundColor: '#757575', // Use theme color for header background
    color: 'white !important', // Text color for header
    whiteSpace: 'nowrap',
    padding: '10px !important'
  },
  // Add tableCellStyle here
  tableCellStyle: {
    padding: '10px' // Consistent padding for body cells
  },
  cmnTitleDark: {
    '&.MuiTypography-root': {
      color: theme.palette.grey[700],
      fontWeight: 500
    }
  },
  cmnTitle: {
    '&.MuiTypography-root': {
      color: theme.palette.primary.dark,
      fontWeight: 500,
      mb: 2
    }
  },
  cmnTextContent: {
    '&.MuiTypography-root': {
      mt: 2,
      lineHeight: 1.5,
      color: theme.palette.text.secondary,
      fontWeight: 'normal'
    }
  },

  cmnBtn: {
    '&.MuiButtonBase-root': {
      textTransform: 'none', // Prevent uppercase
      padding: '6px 20px',
      // borderRadius: '5px',
      borderRadius: '25px !important'
    },
    borderRadius: '25px !important',
    '&.Mui-disabled': {
      borderColor: 'divider',
      color: 'text.disabled',
      backgroundColor: 'action.disabledBackground'
    }
  },
  cmnBtnOutline: {
    '&.MuiButtonBase-root': {
      borderColor: '#34699c',
      color: '#34699c',

      '&:hover': {
        borderColor: '#34699c',
        color:'#fff',
        bgcolor:'#34699c'
      }
    }
  },
  cmnBtnFilled: {
    '&.MuiButtonBase-root': {
      backgroundColor: theme.palette.primary.dark, // Example primary color
      color: '#fff',

      '&:hover': {
        backgroundColor: theme.palette.primary.dark
      },
      '&.Mui-disabled': {
        opacity: 0.5, // reduce opacity
        backgroundColor: theme.palette.primary.dark // keep same base color
      }
    }
  },
  cmnBtnLink: {
    '&.MuiButtonBase-root': {
      color: theme.palette.primary.dark, // eoPepLink color
      textTransform: 'none', // Prevent uppercase
      fontSize: '1rem',
      fontWeight: 500,
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },
  cmnDrawerHeadBg: {
    '&.MuiBox-root': {
      backgroundColor: 'white'
      // backgroundColor: '#ace8b0',
      // backgroundColor: 'linear-gradient(180deg, rgba(51, 243, 64, 0.1) 0%, rgba(240, 240, 240, 0.05) 100%)'
    }
  },
  cmnDrawerPadding: {
    '&.MuiBox-root': {
      padding: '25px 50px 30px 50px'
    }
  },
  graphBox: {
    '&.MuiBox-root': {
      textAlign: 'center',
      width: '100%'
    }
  },
  dougnutContainer: {
    '&.MuiBox-root': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& canvas': {
        maxWidth: '320px', // Example value, adjust as needed
        maxHeight: '320px' // Example value, adjust as needed
      }
    }
  },
  totalValue: {
    '&.MuiTypography-root': {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: theme.spacing(1),
      textAlign: 'center',
      paddingBottom: '20px'
    }
  },
  BarChartWrapper: {
    '&.MuiBox-root': {
      minHeight: '340px', // Adjust this value as needed to make the chart visible
      width: '100%', // Ensures it takes full width of its Grid item
      position: 'relative', // Necessary for Chart.js responsiveness
      display: 'flex', // Use flexbox for centering content if needed
      justifyContent: 'center',
      alignItems: 'center',
 width: '100%',
  minHeight: 400, // Ensure enough height
  overflow: 'visible' // allow labels to overflow if needed
    }
  },
  summaryGraphTitle: {
    '&.MuiTypography-root': {
      mt: 3,
      textAlign: 'center',
      mb: 3
    }
  },
  summaryBorder: {
    marginTop: ' 0rem !important',
    borderTop: '1px solid rgba(3, 3, 3, 0.32)',
    marginBottom: '40px'
  },
  graphContent: {
    '&.MuiBox-root': {
      maxWidth: '800px',
      margin: '0 auto'
    }
  },
  focusedBorderSx: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.dark
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'black'
    },
    '& .MuiInputBase-input': {
      fontSize: '.9rem',
      fontWeight: 'normal'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[400], // Default outline color (e.g., a light grey from your theme)
      borderRadius: '8px' // Ensure rounded corners on the outline
    }
  },
  autocompletestyle: {
    '&.MuiAutocomplete-root .MuiOutlinedInput-root': {
      paddingTop: '8px',
      paddingBottom: '8px'
    }
  },
  DetailLabel: {
    '&.MuiTypography-root': {
      fontSize: '14px',
      color: '#707070',
      margin: '0',
      textTransform: 'capitalize',
      lineHeight: '2rem',
      position: 'relative',
      '&::after': {
        content: '":"',
        position: 'absolute',
        right: '2px',
        fontWeight: 700
      }
    }
  },
  DetailValue: {
    '&.MuiTypography-root': {
      display: 'block',
      width: '100%',
      padding: theme.spacing(0.375, 0.75), // approx 0.375rem 0.75rem
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#5c6873',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      height: 'auto',
      textTransform: 'capitalize',
      textAlign: 'justify',
      wordBreak: 'break-word'
    }
  },
  CommentTitle: {
    '&.MuiTypography-root': {
      fontSize: '14px',
      fontWeight: 600,
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(2)
    }
  },
  profileText: {
    '&.MuiTypography-root': {
      color: 'inherit',
      fontWeight: 500,
      marginTop: '3px',
      overflow: 'hidden', // Required: Hides content that overflows the element's box
      textOverflow: 'ellipsis', // Required: Displays an ellipsis (...) for clipped text
      whiteSpace: 'nowrap', // Required: Prevents the text from wrapping to the next line
      display: 'block'
    }
  },

  profileBox: {
    '&.MuiBox-root': {
      maxWidth: '400px',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      cursor: 'pointer',
      padding: '5px 16px',
      borderRadius: '8px',
      border: '1px solid #c9b6b614',
      color: '#45484ac9',
      ml: 1,
      mr: 4
    }
  },
  graphTotalBox: {
    '&.MuiBox-root': {
      backgroundColor: '#404040',
      color: '#fff',
      padding: '12px',
      borderRadius: '30px'
    }
  },
    graphTotalBoxOrange: {
    '&.MuiBox-root': {
      backgroundColor: '#fd6408',
      color: '#fff',
      padding: '12px',
      borderRadius: '30px'
    }
  }
});

export default style;