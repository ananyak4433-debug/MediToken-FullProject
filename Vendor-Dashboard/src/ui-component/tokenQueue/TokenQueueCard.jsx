
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointments, updateAppointmentStatus } from "container/TokenQueueContainer/slice";
import {
  Box, Grid, Typography, Card, Chip,
  TextField, Button, Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function TokenQueueCard() {
  const dispatch = useDispatch();
  const { appointmentsList = [], loading } = useSelector((state) => state.appointments || {});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => { dispatch(getAppointments()); }, [dispatch]);

  // In TokenQueueCard.jsx
  useEffect(() => {
    dispatch(getAppointments());

    // ✅ auto-refresh every 60 seconds
    const interval = setInterval(() => {
      dispatch(getAppointments());
    }, 60000);

    return () => clearInterval(interval); // cleanup
  }, [dispatch]);

  // ================= FILTER =================
  const filteredRows = appointmentsList
    .filter(row =>
      `${row.patientName} ${row.tokenNumber}`
        .toLowerCase().includes(search.toLowerCase())
    )
    .filter(row => {
      if (filter === "All") return true;
      if (filter === "Waiting") return row.status === "booked";
      if (filter === "Serving") return row.status === "serving";
      if (filter === "Done") return row.status === "completed";
      return true;
    })
    .sort((a, b) => b.tokenNumber - a.tokenNumber);

  // ================= STATS =================
  const stats = {
    total: appointmentsList.length,
    waiting: appointmentsList.filter(r => r.status === "booked").length,
    serving: appointmentsList.filter(r => r.status === "serving").length,
    done: appointmentsList.filter(r => r.status === "completed").length
  };

  // const statusColor = (status) => {
  //   if (status === "booked") return "warning";
  //   if (status === "serving") return "success";
  //   if (status === "completed") return "primary";
  //   return "default";
  // };

  const statusColor = (status) => {
    if (status === "booked") return { backgroundColor: '#FFF4DE', color: '#EF9F27' };  // amber
    if (status === "serving") return { backgroundColor: '#EAF4FF', color: '#2196F3' };  // blue
    if (status === "completed") return { backgroundColor: '#E8F5EE', color: '#1D9E75' };  // green
    // if (status === "cancelled")  return { backgroundColor: '#fdecea', color: '#ef4444' };  // red
    return { backgroundColor: '#f0f0f0', color: '#888' };
  };

  const statusLabel = (status) => {
    if (status === "booked") return "Waiting";
    if (status === "serving") return "Serving";
    if (status === "completed") return "Done";
    return status;
  };

  return (
    <Box>
      {/* STATS */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Total Today", value: stats.total },
          { label: "Waiting", value: stats.waiting },
          { label: "Now Serving", value: stats.serving },
          { label: "Completed", value: stats.done }
        ].map(s => (
          <Grid item xs={3} key={s.label}>
            <Card sx={{ p: 2 }}>
              <Typography variant="body2">{s.label}</Typography>
              <Typography variant="h5">{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SEARCH + FILTERS */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          size="small"
          placeholder="Search by patient name or token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon /> }}
          sx={{ width: "40%" }}
        />
        <Box display="flex" gap={1}>
          {["All", "Waiting", "Serving", "Done"].map(item => {
            const isActive = filter === item;
            return (
              <Button key={item} onClick={() => setFilter(item)}
                sx={{
                  textTransform: "none", borderRadius: "10px",
                  px: 2.5, py: 0.7, fontSize: "13px",
                  bgcolor: isActive ? "#e6f4ea" : "#f1f3f5",
                  color: isActive ? "#2eaf9e" : "#555",
                  border: `1px solid ${isActive ? "#2eaf9e" : "#e0e0e0"}`,
                  "&:hover": { bgcolor: isActive ? "#d7f0e4" : "#e9ecef" }
                }}
              >{item}</Button>
            );
          })}
        </Box>
      </Box>

      {/* TABLE */}
      <Card>
        <Box p={2}>
          <Grid container sx={{ fontWeight: "bold", mb: 1 }}>
            <Grid item xs={2}>TOKEN</Grid>
            <Grid item xs={3}>PATIENT</Grid>
            <Grid item xs={3}>DOCTOR / DEPT.</Grid>
            <Grid item xs={2}>TIME</Grid>
            <Grid item xs={2}>STATUS</Grid>
          </Grid>

          {loading && <Typography textAlign="center">Loading...</Typography>}

          {!loading && filteredRows.length === 0 && (
            <Typography textAlign="center" mt={3} color="text.secondary">
              No appointments for today
            </Typography>
          )}

          {!loading && filteredRows.map(row => (

            <Grid container key={row._id} alignItems="center"
              sx={{ py: 1.5, borderTop: "1px solid #eee" }}>

              <Grid item xs={2}>


                <Typography fontWeight="bold"> #{row.tokenNumber}


                </Typography>


              </Grid>


              <Grid item xs={3} display="flex" alignItems="center" gap={1}>
                <Avatar>{row.patientName?.charAt(0)?.toUpperCase()}</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">{row.patientName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.patientAge} · {row.patientGender}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={3}>
                <Typography variant="body2">
                  {row.doctorId?.name || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.doctorId?.specialization || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="body2">{row.appointmentTime}</Typography>
                <Typography variant="caption" color="text.secondary">{row.appointmentDay}</Typography>
              </Grid>

              <Grid item xs={2}>
                {/* <Chip
                  label={statusLabel(row.status)}
                  color={statusColor(row.status)}
                  size="small"
                /> */}
                <Chip
                  label={statusLabel(row.status)}
                  size="small"
                  sx={{
                    ...statusColor(row.status),
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                />


              </Grid>

              {/* ACTIONS */}
              <Grid item xs={12} mt={1} display="flex" gap={1}>
                {row.status === "booked" && (
                  <Button size="small" variant="outlined" color="success"
                    onClick={() => dispatch(updateAppointmentStatus({ id: row._id, status: "serving" }))}>
                    Call Patient
                  </Button>
                )}
                {row.status === "serving" && (
                  <Button size="small" variant="outlined" color="primary"
                    onClick={() => dispatch(updateAppointmentStatus({ id: row._id, status: "completed" }))}>
                    Mark Done
                  </Button>
                )}
                {row.status === "booked" && (
                  <Button size="small" variant="outlined" color="error"
                    onClick={() => dispatch(updateAppointmentStatus({ id: row._id, status: "cancelled" }))}>
                    Cancel
                  </Button>
                )}
              </Grid>

            </Grid>
          ))}
        </Box>
      </Card>
    </Box>
  );
}