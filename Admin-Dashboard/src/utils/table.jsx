import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

import styles from '../style';

const ReusableTable = ({ columns, data }) => {
  const theme = useTheme();
  const style = styles(theme);
  return (
    <TableContainer component={Paper}>
      <Table sx={style.tableStyle} size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field} sx={style.tableHeader}>
                <Typography sx={style.tableHeaderLabel}>{col.headerName}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} sx={idx % 2 === 0 ? style.tableRow1 : style.tableRow2}>
              {columns.map((col) => (
                <TableCell key={col.field} sx={style.tablebody}>
                  {col.render ? col.render(row, idx) : row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;