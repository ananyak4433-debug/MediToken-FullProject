
import React, { useEffect, useState } from "react";
import {
  Box, Grid, Typography, Card,
  TextField, Button, Avatar, Chip, MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { getBookings, updateBookingStatus } from "container/BookingContainer/slice";
import { getDoctors } from "container/DoctorContainer/slice";
import appConfig from "../../config";
import AddBookingForm from '../bookings/AddBookingsForm';

export default function BookingsCard() {
  const dispatch = useDispatch();
  const { bookingsList = [], loading } = useSelector((state) => state.bookings || {});
  const { doctorsList = [] } = useSelector((state) => state.doctors || {});

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [date, setDate] = useState("");
  const [viewData, setViewData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '', patientAge: '', patientGender: '',
    doctorId: '', appointmentDay: '', appointmentTime: '', notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [selectedDept, setSelectedDept] = useState('');

const SPECIALIZATIONS = [
  'General OPD', 'Cardiology', 'Dermatology', 'Neurology',
  'Orthopaedics', 'Pediatricis', 'Pharmacy', 'Gynecology',
  'Ophthalmology', 'ENT', 'Dental', 'Radiology'
];

const deptDoctors = doctorsList.filter(
  d => d.specialization === selectedDept && d.status === 'active'
);

const handleDeptChange = (dept) => {
  setSelectedDept(dept);
  setFormData(f => ({ ...f, doctorId: '', appointmentDay: '', appointmentTime: '' }));
  setAvailableSlots([]);
};


  useEffect(() => {
    dispatch(getBookings());
    dispatch(getDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (date) {
      dispatch(getBookings({ date }));
    } else {
      dispatch(getBookings());
    }
  }, [date, dispatch]);

  // ================= SLOT GENERATOR =================
  const generateSlots = (startTime, endTime, breakStart, breakEnd, interval = 15) => {
    const slots = [];
    const toMin = (t) => { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const toLabel = (min) => { let h = Math.floor(min / 60); const m = min % 60; const p = h >= 12 ? 'PM' : 'AM'; if (h > 12) h -= 12; if (h === 0) h = 12; return `${h}:${m.toString().padStart(2, '0')} ${p}`; };
    const start = toMin(startTime), end = toMin(endTime), bStart = toMin(breakStart), bEnd = toMin(breakEnd);
    if (!start || !end) return [];
    for (let t = start; t < end; t += interval) {
      if (bStart && bEnd && t >= bStart && t < bEnd) continue;
      slots.push(toLabel(t));
    }
    return slots;
  };

  const getDateFromDay = (dayName) => {
    const today = new Date();
    const todayIndex = today.getDay();
    const targetIndex = DAYS.indexOf(dayName);
    const diff = targetIndex - todayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  };

  // ================= HANDLERS =================
  const handleView = (row) => setViewData(row);

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(updateBookingStatus({ id, status: 'cancelled' }));
    }
  };

  const handleDoctorChange = (doctorId) => {
    setFormData(f => ({ ...f, doctorId, appointmentDay: '', appointmentTime: '' }));
    setAvailableSlots([]);
  };

  const handleDayChange = (day) => {
    const doctor = doctorsList.find(d => d._id === formData.doctorId);
    const avail = doctor?.availability?.find(a => a.day === day);
    const slots = avail ? generateSlots(avail.startTime, avail.endTime, avail.breakStart, avail.breakEnd) : [];
    setFormData(f => ({ ...f, appointmentDay: day, appointmentTime: '' }));
    setAvailableSlots(slots);
  };

  const handleBookingSubmit = async () => {
    try {
      const doctor = doctorsList.find(d => d._id === formData.doctorId);
      const appointmentDate = getDateFromDay(formData.appointmentDay);
      const res = await fetch(`${appConfig.ip}/appointments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          appointmentDate,
          vendorId: doctor?.vendorId?._id || doctor?.vendorId,
        })
      });
      const data = await res.json();
      if (data.success) {
        setOpenForm(false);
        setFormData({ patientName: '', patientAge: '', patientGender: '', doctorId: '', appointmentDay: '', appointmentTime: '', notes: '' });
        setAvailableSlots([]);
        dispatch(getBookings({ date }));
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // ================= FILTER =================
  const filteredRows = bookingsList
  .slice()
  .sort((a, b) => b.tokenNumber - a.tokenNumber) // ✅ latest token first
  .filter(row =>
    `${row.patientName} ${row.doctorId?.name} ${row._id}`
      .toLowerCase().includes(search.toLowerCase())
  )
  .filter(row => {
    if (filter === "All")       return true;
    if (filter === "Pending")   return row.status === "booked";
    if (filter === "Confirmed") return row.status === "serving";
    if (filter === "Cancelled") return row.status === "cancelled";
    if (filter === "Completed") return row.status === "completed";
    return true;
  });

  // ================= STATS =================
  const stats = {
    total:     bookingsList.length,
    pending:   bookingsList.filter(r => r.status === "booked").length,
    confirmed: bookingsList.filter(r => r.status === "serving").length,
    cancelled: bookingsList.filter(r => r.status === "cancelled").length
  };

  const statusColor = (status) => {
    if (status === "booked")    return "warning";
    if (status === "serving")   return "success";
    if (status === "cancelled") return "error";
    if (status === "completed") return "primary";
    return "default";
  };

  const statusLabel = (status) => {
    if (status === "booked")    return "Pending";
    if (status === "serving")   return "Confirmed";
    if (status === "cancelled") return "Cancelled";
    if (status === "completed") return "Completed";
    return status;
  };

  return (
    <Box>
      {/* STATS */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Total Bookings", value: stats.total,     color: "text.primary" },
          { label: "Pending",        value: stats.pending,   color: "warning.main" },
          { label: "Confirmed",      value: stats.confirmed, color: "success.main" },
          { label: "Cancelled",      value: stats.cancelled, color: "error.main" }
        ].map(s => (
          <Grid item xs={3} key={s.label}>
            <Card sx={{ p: 2 }}>
              <Typography variant="body2">{s.label}</Typography>
              <Typography variant="h5" color={s.color}>{s.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SEARCH + FILTER */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Search by patient, doctor or booking ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon /> }}
          sx={{ width: "35%" }}
        />
        <TextField
          type="date" size="small"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Box display="flex" gap={1}>
          {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map(item => {
            const isActive = filter === item;
            return (
              <Button key={item} onClick={() => setFilter(item)}
                sx={{
                  textTransform: "none", borderRadius: "10px",
                  px: 2, py: 0.5, fontSize: "13px",
                  bgcolor: isActive ? "#e6f4ea" : "#f1f3f5",
                  color: isActive ? "#2eaf9e" : "#555",
                  border: `1px solid ${isActive ? "#2eaf9e" : "#e0e0e0"}`,
                  "&:hover": { bgcolor: isActive ? "#d7f0e4" : "#e9ecef" }
                }}
              >{item}</Button>
            );
          })}
        </Box>
        {/* <Button variant="contained"
          onClick={() => setOpenForm(true)}
          sx={{ ml: "auto", bgcolor: "#2eaf9e", textTransform: "none", borderRadius: "8px", "&:hover": { bgcolor: "#21796f" } }}
        >
          + New Booking
        </Button> */}
      </Box>

      {/* TABLE */}
      <Card>
        <Box p={2}>
          <Grid container sx={{ fontWeight: "bold", mb: 1 }}>
            <Grid item xs={2}>BOOKING ID</Grid>
            <Grid item xs={2}>PATIENT</Grid>
            <Grid item xs={2}>DOCTOR / DEPT.</Grid>
            <Grid item xs={2}>DATE & TIME</Grid>
            <Grid item xs={1}>TOKEN</Grid>
            <Grid item xs={1}>STATUS</Grid>
            <Grid item xs={2}>ACTIONS</Grid>
          </Grid>

          {loading && <Typography textAlign="center">Loading...</Typography>}

          {!loading && filteredRows.length === 0 && (
            <Typography textAlign="center" mt={3} color="text.secondary">
              No bookings found
            </Typography>
          )}

          {!loading && filteredRows.map(row => (
            <Grid container key={row._id} alignItems="center"
              sx={{ py: 1.5, borderTop: "1px solid #eee" }}>

              <Grid item xs={2}>
                <Typography variant="caption" color="text.secondary">
                  #{row._id?.slice(-6).toUpperCase()}
                </Typography>
              </Grid>

              <Grid item xs={2} display="flex" gap={1} alignItems="center">
                <Avatar>{row.patientName?.charAt(0)?.toUpperCase()}</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">{row.patientName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Age {row.patientAge} · {row.patientGender}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="body2">{row.doctorId?.name || 'N/A'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.doctorId?.specialization || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography variant="body2">{row.appointmentDay}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.appointmentTime}
                </Typography>
              </Grid>

              <Grid item xs={1}>
                <Typography fontWeight="bold">#{row.tokenNumber}</Typography>
              </Grid>

              <Grid item xs={1}>
                <Chip
                  label={statusLabel(row.status)}
                  color={statusColor(row.status)}
                  size="small"
                />
              </Grid>

              <Grid item xs={2} display="flex" gap={1}>
                <Button size="small" variant="outlined" color="success"
                  onClick={() => handleView(row)}>
                  View
                </Button>
                {row.status === 'booked' && (
                  <Button size="small" variant="outlined" color="error"
                    onClick={() => handleCancel(row._id)}>
                    Cancel
                  </Button>
                )}
              </Grid>

            </Grid>
          ))}
        </Box>
      </Card>

      {/* VIEW MODAL */}
      {viewData && (
        <Box
          sx={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setViewData(null)}
        >
          <Card sx={{ p: 3, width: 420 }} onClick={e => e.stopPropagation()}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Appointment Details
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">PATIENT</Typography>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar>{viewData.patientName?.charAt(0)?.toUpperCase()}</Avatar>
              <Box>
                <Typography fontWeight="bold">{viewData.patientName}</Typography>
                <Typography variant="caption">
                  Age {viewData.patientAge} · {viewData.patientGender}
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" color="text.secondary">DOCTOR</Typography>
            <Typography fontWeight="bold">{viewData.doctorId?.name || 'N/A'}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              {viewData.doctorId?.specialization || 'N/A'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">APPOINTMENT</Typography>
            <Typography>📅 {viewData.appointmentDay} — {viewData.appointmentTime}</Typography>
            <Typography>🎫 Token #{viewData.tokenNumber}</Typography>
            <Box mt={1}>
              <Chip
                label={statusLabel(viewData.status)}
                color={statusColor(viewData.status)}
                size="small"
              />
            </Box>

            {viewData.notes && (
              <>
                <Typography variant="subtitle2" color="text.secondary" mt={2}>NOTES</Typography>
                <Typography variant="body2">{viewData.notes}</Typography>
              </>
            )}

            <Button fullWidth variant="outlined" sx={{ mt: 3 }}
              onClick={() => setViewData(null)}>
              Close
            </Button>
          </Card>
        </Box>
      )}

      <AddBookingForm open={openForm} onClose={() => setOpenForm(false)} />

    </Box>
  );
}