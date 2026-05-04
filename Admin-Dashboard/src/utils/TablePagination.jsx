import React from 'react';
import { Pagination as MuiPagination, Stack, Box } from '@mui/material';

const Pagination = ({ countPagination, page, handlePageClick }) => {
  const handleChange = (event, value) => {
    handlePageClick({ selected: value - 1 });
  };

  return (
    <Box className="paginationDiv" sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      {countPagination >= 1 && (
        <MuiPagination
          count={countPagination}
          page={page + 1}
          onChange={handleChange}
          showFirstButton
          showLastButton
          siblingCount={2}
          boundaryCount={2}
          sx={{
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: '#34699c',
              color: '#fff'
            }
          }}
        />
      )}
    </Box>
  );
};

export default Pagination;
