
import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box,
  TextField, Avatar, Pagination
} from '@mui/material';

import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientsRequest } from 'container/PatientContainer/slice';

const ROWS_PER_PAGE = 10;

const PatientsCard = () => {
  const dispatch = useDispatch();
  const { patients, loading } = useSelector((state) => state.patients);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getPatientsRequest());
  }, [dispatch]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredPatients = patients
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((p) => p?.name?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil((filteredPatients?.length || 0) / ROWS_PER_PAGE);
  const paginatedPatients = filteredPatients?.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  return (
    <Grid container spacing={3}>

      {/* SEARCH */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <SearchOutlined />
              <TextField
                placeholder="Search patients..."
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* TABLE */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>

            {loading && (
              <Typography align="center">Loading...</Typography>
            )}

            {!loading && filteredPatients?.length === 0 && (
              <Typography align="center" color="text.secondary" mt={3}>
                No patients found
              </Typography>
            )}

            {/* COLUMN HEADERS */}
            {!loading && filteredPatients?.length > 0 && (
              <Grid container alignItems="center"
                sx={{ py: 1, borderBottom: '2px solid #e0e0e0', mb: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">Patient</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">Contact</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">Age</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">Gender</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2" fontWeight="bold" color="text.secondary">Token</Typography>
                </Grid>
              </Grid>
            )}

            {/* PATIENT ROWS */}
            {!loading && paginatedPatients?.map((p) => (
              <Grid
                container key={p._id} alignItems="center"
                sx={{ py: 2, borderTop: '1px solid #eee', '&:hover': { backgroundColor: '#fafafa' } }}
              >
                <Grid item xs={4} display="flex" alignItems="center" gap={2}>
                  <Avatar>{p?.name?.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight="bold">{p?.name || 'N/A'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {p?._id || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={3}>
                  <Typography color="primary">{p?.email || '-'}</Typography>
                  <Typography variant="body2" color="text.secondary">{p?.phone || '-'}</Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography>{p?.age || '-'}</Typography>
                </Grid>

                <Grid item xs={2}>
                  <Typography>{p?.gender || '-'}</Typography>
                </Grid>

                <Grid item xs={1}>
                  <Typography fontWeight="bold">{p?.tokenNumber || '-'}</Typography>
                </Grid>
              </Grid>
            ))}

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Showing {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filteredPatients.length)} of {filteredPatients.length} patients
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': { color: '#38c1b3' },
                    '& .Mui-selected': {
                      backgroundColor: '#38c1b3 !important',
                      color: '#fff'
                    }
                  }}
                />
              </Box>
            )}

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PatientsCard;