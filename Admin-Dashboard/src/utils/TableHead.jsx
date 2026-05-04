import React from 'react';
import { TableHead as MuiTableHead, TableRow, TableCell, useTheme, Typography } from '@mui/material';
import styles from './style';
const TableHead = ({ keys = [], config, hasAction = true, hideArray = [], slNo = true }) => {
  const theme = useTheme();
  const style = styles(theme);
  return (
    <MuiTableHead>
      <TableRow sx={{ backgroundColor: `#34699c`, boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.3)' }}>
        {slNo ? (
          <TableCell
            sx={{
              whiteSpace: 'nowrap',
              padding: '14px !important',
              color: 'white !important',
              fontSize: '25px',
              ...(keys?.length > 4 ? { width: '25px' } : {})
            }}
            align="left"
          >
            <Typography variant="body1" sx={style.tableHeaderLabel}>
              Sl No
            </Typography>
          </TableCell>
        ) : null}
        {keys.map((key, i) => {
          if (!config[key] || hideArray.includes(config[key].label)) {
            return null;
          }
          return (
            <TableCell
              key={i}
              sx={{
                padding: '14px !important',
                fontSize: '25px',
                whiteSpace: 'nowrap !important',
                color: 'white !important', // Consider using theme for colors
                // Apply overflow ellipsis styles here
                // We'll wrap content in Typography for actual ellipsis
                ...(keys?.length > 4 ? { maxWidth: '200px' } : { maxWidth: '400px' })
              }}
              align={config[key]?.align === 'right' ? 'right' : 'left'}
            >
              <Typography variant="body1" sx={style.tableHeaderLabel}>
                {config[key].label}
              </Typography>
            </TableCell>
          );
        })}
        {hasAction && (
          <TableCell
            sx={{
              whiteSpace: 'nowrap',
              fontSize: '25px',
              padding: '14px !important',
              color: 'white !important',
              ...(keys?.length > 4 ? { width: '25px' } : {})
            }}
            align="left"
          >
            <Typography variant="body1" sx={style.tableHeaderLabel}>
              Action 
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </MuiTableHead>
  );
};

export default TableHead;