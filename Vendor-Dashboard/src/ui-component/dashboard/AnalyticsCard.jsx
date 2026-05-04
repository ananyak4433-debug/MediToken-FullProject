import React, { useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Chip, Avatar, Divider
} from '@mui/material';
import {
  UserOutlined, HomeOutlined, ClockCircleOutlined, MessageOutlined,
  RiseOutlined, MedicineBoxOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getBookings } from 'container/BookingContainer/slice';
import { getDoctors } from 'container/DoctorContainer/slice';
import { getStaff } from 'container/StaffContainer/slice';
import { userMe } from 'container/LoginContainer/slice';  // ✅ ADD

const AnalyticsCard = () => {
  const dispatch = useDispatch();

  const { bookingsList = [] } = useSelector((state) => state.bookings || {});
  const { doctorsList = [] } = useSelector((state) => state.doctors || {});
  const { staffList = [] } = useSelector((state) => state.staff || {});

  const userData = useSelector((state) => state?.login?.userData || {});
  const userLoading = useSelector((state) => state?.login?.loading);  // ✅ ADD
  const vendorId = userData?._id || userData?.id;

  // ✅ Step 1 — always fetch userMe first on mount
  useEffect(() => {
    dispatch(userMe());
  }, [dispatch]);

  // ✅ Step 2 — only fetch after userMe is done AND vendorId is ready
  useEffect(() => {
    if (!userLoading && vendorId) {
      dispatch(getBookings());
      dispatch(getDoctors());
      dispatch(getStaff());
    }
  }, [dispatch, vendorId, userLoading]);  // ✅ depends on both

  const todayTotal     = bookingsList.length;
  const todayBooked    = bookingsList.filter(a => a.status === 'booked').length;
  const todayServing   = bookingsList.filter(a => a.status === 'serving').length;
  const todayCompleted = bookingsList.filter(a => a.status === 'completed').length;
  const todayCancelled = bookingsList.filter(a => a.status === 'cancelled').length;
  const activeDoctors  = doctorsList.filter(d => d.status === 'active').length;
  const activeStaff    = staffList.filter(s => s.status === 'active').length;

  const stats = [
    {
      title: 'Tokens Today',
      value: todayTotal,
      change: `${todayBooked} Waiting`,
      icon: <UserOutlined style={{ fontSize: 18 }} />,
      color: '#4CAF50', bg: '#E8F5E9'
    },
    {
      title: 'Active Bookings',
      value: todayBooked + todayServing,
      change: `${todayServing} Now Serving`,
      icon: <HomeOutlined style={{ fontSize: 18 }} />,
      color: '#2196F3', bg: '#E3F2FD'
    },
    {
      title: 'Active Doctors',
      value: activeDoctors,
      change: `${doctorsList.length} Total Doctors`,
      icon: <MedicineBoxOutlined style={{ fontSize: 18 }} />,
      color: '#9C27B0', bg: '#F3E5F5'
    },
    {
      title: 'Completed',
      value: todayCompleted,
      change: `${todayCancelled} Cancelled`,
      icon: <MessageOutlined style={{ fontSize: 18 }} />,
      color: '#009688', bg: '#E0F2F1'
    }
  ];

  const activeQueue = bookingsList
    .filter(a => a.status === 'serving' || a.status === 'booked')
    .slice(0, 6);

  const deptMap = {};
  bookingsList.forEach(a => {
    const dept = a.doctorId?.specialization || 'Unknown';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptList = Object.entries(deptMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxDept = deptList[0]?.[1] || 1;

  const getStatusColor = (status) => {
    if (status === 'serving') return 'success';
    if (status === 'booked')  return 'warning';
    return 'default';
  };

  const getStatusLabel = (status) => {
    if (status === 'serving') return 'In progress';
    if (status === 'booked')  return 'Waiting';
    return status;
  };

  const deptColors = ['#4CAF50','#2196F3','#9C27B0','#FF9800','#F44336','#009688'];

  // ✅ Show loading state while userMe is pending
  if (userLoading && !vendorId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="text.secondary">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2.5}>

      {stats.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{
            borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0', height: '100%'
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" fontSize={12} fontWeight={500}>
                    {item.title.toUpperCase()}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} mt={0.5} mb={0.5}>
                    {item.value}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <RiseOutlined style={{ fontSize: 11, color: item.color }} />
                    <Typography variant="caption" sx={{ color: item.color, fontWeight: 500 }}>
                      {item.change}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  backgroundColor: item.bg, color: item.color,
                  p: 1.2, borderRadius: 2, fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 42, height: 42
                }}>
                  {item.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12} md={5}>
        <Card sx={{
          borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0', height: '100%'
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{
                  bgcolor: '#E3F2FD', color: '#2196F3',
                  p: 0.8, borderRadius: 1.5, fontSize: 14,
                  display: 'flex', alignItems: 'center'
                }}>
                  <UserOutlined />
                </Box>
                <Typography variant="h6" fontWeight={600} fontSize={15}>
                  Active Token Queue
                </Typography>
              </Box>
            </Box>

            {activeQueue.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary" fontSize={13}>
                  No active tokens for today
                </Typography>
              </Box>
            ) : (
              activeQueue.map((row, index) => (
                <Box key={index}>
                  <Box
                    display="flex" justifyContent="space-between" alignItems="center"
                    py={1.2}
                    sx={{ '&:hover': { bgcolor: '#fafafa' }, borderRadius: 1, px: 0.5 }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{
                        width: 34, height: 34, fontSize: 13, fontWeight: 700,
                        bgcolor: row.status === 'serving' ? '#E8F5E9' : '#FFF3E0',
                        color: row.status === 'serving' ? '#4CAF50' : '#FF9800'
                      }}>
                        {row.patientName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} fontSize={13}>
                          T-{String(row.tokenNumber).padStart(4, '0')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.patientName || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" fontSize={12}>
                      {row.doctorId?.specialization || 'N/A'}
                    </Typography>
                    <Typography variant="caption" fontWeight={500} fontSize={12}>
                      {row.appointmentTime || 'N/A'}
                    </Typography>
                    <Chip
                      label={getStatusLabel(row.status)}
                      color={getStatusColor(row.status)}
                      size="small"
                      sx={{ fontSize: 11, height: 22 }}
                    />
                  </Box>
                  {index < activeQueue.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card sx={{
          borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0', height: '100%'
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{
                  bgcolor: '#F3E5F5', color: '#9C27B0',
                  p: 0.8, borderRadius: 1.5, fontSize: 14,
                  display: 'flex', alignItems: 'center'
                }}>
                  <ClockCircleOutlined />
                </Box>
                <Typography variant="h6" fontWeight={600} fontSize={15}>
                  Department Load Today
                </Typography>
              </Box>
              <Typography variant="caption" sx={{
                color: '#888', fontWeight: 500,
                bgcolor: '#f5f5f5', px: 1.5, py: 0.5, borderRadius: 5
              }}>
                {todayTotal} total tokens
              </Typography>
            </Box>

            {deptList.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary" fontSize={13}>
                  No bookings for today
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {deptList.map(([dept, count], index) => (
                  <Grid item xs={12} key={dept}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="body2" fontWeight={500} sx={{ minWidth: 130, fontSize: 13 }}>
                        {dept}
                      </Typography>
                      <Box flex={1} sx={{ bgcolor: '#f5f5f5', borderRadius: 5, height: 8, overflow: 'hidden' }}>
                        <Box sx={{
                          width: `${(count / maxDept) * 100}%`,
                          bgcolor: deptColors[index % deptColors.length],
                          height: '100%', borderRadius: 5,
                          transition: 'width 0.5s ease'
                        }} />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight={700} fontSize={13}>{count}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({Math.round((count / todayTotal) * 100)}%)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    {[
                      { label: 'Waiting',   value: todayBooked,    color: '#FF9800' },
                      { label: 'Serving',   value: todayServing,   color: '#4CAF50' },
                      { label: 'Completed', value: todayCompleted, color: '#2196F3' },
                      { label: 'Cancelled', value: todayCancelled, color: '#F44336' },
                    ].map(s => (
                      <Box key={s.label} textAlign="center">
                        <Typography fontWeight={700} fontSize={18} color={s.color}>{s.value}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default AnalyticsCard;