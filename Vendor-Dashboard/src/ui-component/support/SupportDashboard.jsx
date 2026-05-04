
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDepartments, submitSupport,
  resetSubmitSuccess, getMyRequests
} from 'container/SupportContainer/slice';
import MainCard from 'ui-component/cards/MainCard';
import {
  Box, Typography, Card, CardContent, TextField,
  MenuItem, Button, CircularProgress, Alert,
  Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { userMe } from 'container/LoginContainer/slice';

const statusStyle = (status) => {
  if (status === 'Open') return { background: '#e0f5f2', color: '#077a6d' };
  if (status === 'Pending') return { background: '#fef3dc', color: '#8a5c00' };
  return { background: '#f0f0ee', color: '#7a8a88' };
};

const Support = () => {
  const dispatch = useDispatch();
  const { departments, loading, submitSuccess, submitLoading, error, myRequests, requestLoading } =
    useSelector((state) => state.support);

  const userData = useSelector((state) => state?.login?.userData || {});
  const vendorId = userData?._id || userData?.id;

  const [form, setForm] = useState({
    name: '', email: '', supportType: '', subject: '', message: ''
  });
  const [tab, setTab] = useState(0);

  // useEffect(() => {
  //   dispatch(getDepartments());
  //   dispatch(getMyRequests());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(userMe());
    dispatch(getDepartments());
  }, [dispatch]);


  useEffect(() => {
    if (vendorId) {
      dispatch(getMyRequests());
    }
  }, [dispatch, vendorId]);

  useEffect(() => {
    if (submitSuccess) {
      setForm({ name: '', email: '', supportType: '', subject: '', message: '' });
      dispatch(getMyRequests()); // refresh list after submit
      const timer = setTimeout(() => dispatch(resetSubmitSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, dispatch]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.supportType || !form.subject || !form.message) return;
    dispatch(submitSupport(form));
  };

  return (
    <MainCard sx={{ boxShadow: 'none' }}>
      <Box>

        {/* HEADER */}
        <Box sx={{ p: 1.5, mb: 3, display: 'flex', alignItems: 'center', bgcolor: '#f2f5f8', borderRadius: 2 }}>
          <Box sx={{ background: '#2eaf9e', color: '#fff', borderRadius: '50%', height: 40, width: 40, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SupportAgentIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Support</Typography>
            <Typography sx={{ fontSize: 13 }}>Submit a support request 🎧</Typography>
          </Box>
        </Box>

        {/* TABS */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Tab label="Submit a Request" />
          <Tab label={`My Requests (${myRequests.length})`} />
        </Tabs>

        {/* TAB 1 — FORM */}
        {tab === 0 && (
          <Box display="flex" gap={3} flexWrap="wrap">
            <Card sx={{ flex: 1, minWidth: 320, borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>Submit a Request</Typography>

                {submitSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>Your request has been submitted successfully!</Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error?.message || error?.toString() || 'Something went wrong'}
                  </Alert>
                )}

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField label="Your Name" name="name" size="small" fullWidth value={form.name} onChange={handleChange} />
                  <TextField label="Email Address" name="email" size="small" fullWidth value={form.email} onChange={handleChange} type="email" />

                  <TextField select label="Support Type" name="supportType" size="small" fullWidth value={form.supportType} onChange={handleChange}>
                    {loading ? (
                      <MenuItem disabled><CircularProgress size={16} sx={{ mr: 1 }} /> Loading...</MenuItem>
                    ) : departments.length === 0 ? (
                      <MenuItem disabled>No support types available</MenuItem>
                    ) : (
                      departments.map(dept => (
                        <MenuItem key={dept._id} value={dept.typeName}>
                          {dept.typeName}
                        </MenuItem>
                      ))
                    )}
                  </TextField>

                  <TextField label="Subject" name="subject" size="small" fullWidth value={form.subject} onChange={handleChange} />
                  <TextField label="Message" name="message" multiline rows={4} size="small" fullWidth placeholder="Describe your issue in detail..." value={form.message} onChange={handleChange} />

                  <Button
                    variant="contained" fullWidth disabled={submitLoading} onClick={handleSubmit}
                    sx={{ bgcolor: '#2eaf9e', textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: '#21796f' } }}
                  >
                    {submitLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit Request'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* INFO PANEL */}
            <Box display="flex" flexDirection="column" gap={2} sx={{ width: 260 }}>
              {[
                { icon: '📧', title: 'Email Support', desc: 'support@meditoken.com', sub: 'Response within 24 hours' },
                { icon: '📞', title: 'Phone Support', desc: '+91 98765 43210', sub: 'Mon–Fri, 9AM to 6PM' },
                { icon: '💬', title: 'Live Chat', desc: 'Available on weekdays', sub: '9AM – 5PM IST' },
                { icon: '⏱️', title: 'Response Time', desc: 'Within 24 hours', sub: 'For all support tickets' }
              ].map((item, i) => (
                <Card key={i} sx={{ borderRadius: 3, boxShadow: 1 }}>
                  <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', py: '12px !important' }}>
                    <Typography fontSize={22}>{item.icon}</Typography>
                    <Box>
                      <Typography fontWeight="bold" fontSize={13}>{item.title}</Typography>
                      <Typography fontSize={13} color="primary">{item.desc}</Typography>
                      <Typography fontSize={11} color="text.secondary">{item.sub}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* TAB 2 — MY REQUESTS */}
        {tab === 1 && (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 0 }}>
              {requestLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
              ) : myRequests.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No requests submitted yet.</Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f8fdfc' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#7aaeaa', textTransform: 'uppercase' }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#7aaeaa', textTransform: 'uppercase' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#7aaeaa', textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#7aaeaa', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12, color: '#7aaeaa', textTransform: 'uppercase' }}>Admin Reply</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myRequests.map((req, i) => (
                      <TableRow key={req._id || i} sx={{ '&:hover': { background: '#f8fdfc' } }}>
                        <TableCell sx={{ fontWeight: 600, color: '#1a3a38' }}>{req.subject}</TableCell>
                        <TableCell sx={{ color: '#5a8a85' }}>{req.supportType}</TableCell>
                        <TableCell sx={{ color: '#9ab8b5', fontSize: 12 }}>
                          {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 20, fontSize: 11, fontWeight: 700, ...statusStyle(req.status) }}>
                            {req.status}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: 13, color: '#4a6a68' }}>
                          {req.replies?.length > 0
                            ? req.replies[req.replies.length - 1].message
                            : <span style={{ color: '#b0cecc' }}>No reply yet</span>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

      </Box>
    </MainCard>
  );
};

export default Support;