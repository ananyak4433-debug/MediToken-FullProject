import React, { useState } from "react";
import {
    Box, Grid, TextField, Button,
    MenuItem, Typography, Card
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors } from "container/DoctorContainer/slice";
import { getBookings } from "container/BookingContainer/slice";
import appConfig from "../../config";

const SPECIALIZATIONS = [
    'General OPD', 'Cardiology', 'Dermatology', 'Neurology',
    'Orthopaedics', 'Pediatricis', 'Pharmacy', 'Gynecology',
    'Ophthalmology', 'ENT', 'Dental', 'Radiology'
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateSlots = (startTime, endTime, breakStart, breakEnd, interval = 15) => {
    const slots = [];
    const toMin = (t) => { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const toLabel = (min) => {
        let h = Math.floor(min / 60); const m = min % 60;
        const p = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12; if (h === 0) h = 12;
        return `${h}:${m.toString().padStart(2, '0')} ${p}`;
    };
    const start = toMin(startTime), end = toMin(endTime);
    const bStart = toMin(breakStart), bEnd = toMin(breakEnd);
    if (!start || !end) return [];
    for (let t = start; t < end; t += interval) {
        if (bStart && bEnd && t >= bStart && t < bEnd) continue;
        slots.push(toLabel(t));
    }
    return slots;
};

export default function AddBookingForm({ open, onClose }) {
    const dispatch = useDispatch();
    const { doctorsList = [] } = useSelector((state) => state.doctors || {});

    const [selectedDept, setSelectedDept] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [formData, setFormData] = useState({
        patientName: '', patientAge: '', patientGender: '',
        doctorId: '', appointmentDay: '', appointmentTime: '', notes: ''
    });

    // ✅ doctors filtered by selected department and active status
    const deptDoctors = doctorsList.filter(
        d => d.specialization === selectedDept && d.status === 'active'
    );

    const getDateFromDay = (dayName) => {
        const today = new Date();
        const todayIndex = today.getDay();
        const targetIndex = DAYS.indexOf(dayName);
        const diff = targetIndex - todayIndex;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        return targetDate.toISOString().split('T')[0];
    };

    const handleDeptChange = (dept) => {
        setSelectedDept(dept);
        setFormData(f => ({ ...f, doctorId: '', appointmentDay: '', appointmentTime: '' }));
        setAvailableSlots([]);
    };

    const handleDoctorChange = (doctorId) => {
        setFormData(f => ({ ...f, doctorId, appointmentDay: '', appointmentTime: '' }));
        setAvailableSlots([]);
    };

    const handleDayChange = (day) => {
        const doctor = doctorsList.find(d => d._id === formData.doctorId);
        const avail = doctor?.availability?.find(a => a.day === day);
        const slots = avail
            ? generateSlots(avail.startTime, avail.endTime, avail.breakStart, avail.breakEnd)
            : [];
        setFormData(f => ({ ...f, appointmentDay: day, appointmentTime: '' }));
        setAvailableSlots(slots);
    };

    const handleClose = () => {
        setSelectedDept('');
        setAvailableSlots([]);
        setFormData({
            patientName: '', patientAge: '', patientGender: '',
            doctorId: '', appointmentDay: '', appointmentTime: '', notes: ''
        });
        onClose();
    };

    const handleSubmit = async () => {
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
                dispatch(getBookings());
                handleClose();
            } else {
                alert(data.message || 'Booking failed');
            }
        } catch (err) {
            alert('Network error');
        }
    };

    if (!open) return null;

    return (
        <Box
            sx={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                bgcolor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999
            }}
            onClick={handleClose}
        >
            <Card sx={{ p: 3, width: 500, maxHeight: '90vh', overflowY: 'auto' }}
                onClick={e => e.stopPropagation()}>

                <Typography variant="h6" fontWeight="bold" mb={2}>New Booking</Typography>

                <Grid container spacing={2}>

                    {/* Patient Name */}
                    <Grid item xs={12}>
                        <TextField fullWidth size="small" label="Patient Name"
                            value={formData.patientName}
                            onChange={e => setFormData(f => ({ ...f, patientName: e.target.value }))}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: { maxHeight: 200, zIndex: 99999 } // ✅
                                    }
                                }
                            }}
                        />
                    </Grid>

                    {/* Age + Gender */}
                    <Grid item xs={6}>
                        <TextField fullWidth size="small" label="Age" type="number"
                            value={formData.patientAge}
                            onChange={e => setFormData(f => ({ ...f, patientAge: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField select fullWidth size="small" label="Gender"
                            value={formData.patientGender}
                            onChange={e => setFormData(f => ({ ...f, patientGender: e.target.value }))}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: { maxHeight: 200, zIndex: 99999 } // ✅
                                    }
                                }
                            }}
                        >
                            {['Male', 'Female', 'Other'].map(g => (
                                <MenuItem key={g} value={g.toLowerCase()}>{g}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Department */}
                    <Grid item xs={12}>
                        <TextField select fullWidth size="small" label="Select Department"
                            value={selectedDept}
                            onChange={e => handleDeptChange(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 200 } // ✅ limits dropdown height
                                }
                            }}
                        ></TextField>
                    </Grid>

                    {/* Doctor — only after dept selected */}
                    {selectedDept && (
                        <Grid item xs={12}>
                            {deptDoctors.length === 0 ? (
                                <Typography variant="body2" color="error">
                                    No active doctors available for {selectedDept}
                                </Typography>
                            ) : (
                                <TextField select fullWidth size="small" label="Select Doctor"
                                    value={formData.doctorId}
                                    onChange={e => handleDoctorChange(e.target.value)}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: { maxHeight: 200, zIndex: 99999 } // ✅
                                            }
                                        }
                                    }}
                                >
                                    {deptDoctors.map(doc => (
                                        <MenuItem key={doc._id} value={doc._id}>
                                            {doc.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </Grid>
                    )}

                    {/* Day — only after doctor selected */}
                    {formData.doctorId && (
                        <Grid item xs={12}>
                            <TextField select fullWidth size="small" label="Select Day"
                                value={formData.appointmentDay}
                                onChange={e => handleDayChange(e.target.value)}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            style: { maxHeight: 200, zIndex: 99999 } // ✅
                                        }
                                    }
                                }}
                            >
                                {doctorsList.find(d => d._id === formData.doctorId)
                                    ?.availability?.map(a => (
                                        <MenuItem key={a.day} value={a.day}>{a.day}</MenuItem>
                                    ))}
                            </TextField>
                        </Grid>
                    )}

                    {/* Time Slots — only after day selected */}
                    {availableSlots.length > 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body2" mb={1} color="text.secondary">
                                Select Time Slot
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1}>
                                {availableSlots.map(slot => (
                                    <Button key={slot} size="small"
                                        variant={formData.appointmentTime === slot ? 'contained' : 'outlined'}
                                        onClick={() => setFormData(f => ({ ...f, appointmentTime: slot }))}
                                        sx={{
                                            bgcolor: formData.appointmentTime === slot ? '#38c1b3' : 'transparent',
                                            borderColor: '#38c1b3',
                                            color: formData.appointmentTime === slot ? '#fff' : '#38c1b3',
                                            '&:hover': { bgcolor: '#38c1b3', color: '#fff' }
                                        }}
                                    >
                                        {slot}
                                    </Button>
                                ))}
                            </Box>
                        </Grid>
                    )}

                    {/* Notes */}
                    <Grid item xs={12}>
                        <TextField fullWidth size="small" label="Notes (optional)"
                            multiline rows={3}
                            value={formData.notes}
                            onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                        />
                    </Grid>

                </Grid>

                <Box display="flex" gap={2} mt={3}>
                    <Button fullWidth variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button fullWidth variant="contained"
                        disabled={
                            !formData.patientName || !formData.doctorId ||
                            !formData.appointmentDay || !formData.appointmentTime
                        }
                        onClick={handleSubmit}
                        sx={{ bgcolor: '#38c1b3', '&:hover': { bgcolor: '#32a087' } }}
                    >
                        Confirm Booking
                    </Button>
                </Box>

            </Card>
        </Box>
    );
}