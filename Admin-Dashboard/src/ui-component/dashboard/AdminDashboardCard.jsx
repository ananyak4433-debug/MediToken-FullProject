
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid, Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow, Divider
} from '@mui/material';
import {
  UserOutlined, ApartmentOutlined, QuestionCircleOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { getVendorsRequest } from 'container/VendorContainer/slice';
import { getDepartmentsRequest } from 'container/departmentsContainer/slice';
import { getSupportTypesRequest } from 'container/SupportTypeContainer/slice';  // ← add this

const AdminDashboardCard = () => {
  const dispatch = useDispatch();
  const { vendors = [] }         = useSelector((state) => state.vendors);
  const { departments = [] }     = useSelector((state) => state.departments);
  const { supportTypes = [] }    = useSelector((state) => state.supportType);  // ← add this

  useEffect(() => {
    dispatch(getVendorsRequest());
    dispatch(getDepartmentsRequest());
    dispatch(getSupportTypesRequest());   // ← add this
  }, [dispatch]);

  const activeVendors    = vendors.filter((v) => v.status === 'Active' || v.isActive === true);
  const activeDepts      = departments.filter((d) => d.status === 'Active' || d.isActive === true);
  const activeSupportTypes = supportTypes.filter((s) => s.status === 'active');  // ← add this

  const stats = [
    {
      title: 'Total Vendors',
      value: vendors.length,
      sub: `${activeVendors.length} active`,
      icon: <UserOutlined style={{ fontSize: 22 }} />,
      color: '#1D9E75',
      bg: '#E8F5EE'
    },
    {
      title: 'Departments',
      value: departments.length,
      sub: activeDepts.length === departments.length ? 'All Active' : `${activeDepts.length} active`,
      icon: <ApartmentOutlined style={{ fontSize: 22 }} />,
      color: '#2196F3',
      bg: '#EAF4FF'
    },
    {
      title: 'Support Types',
      value: supportTypes.length,                                                          // ← real data
      sub: activeSupportTypes.length === supportTypes.length ? 'All Configured' : `${activeSupportTypes.length} active`,  // ← real data
      icon: <QuestionCircleOutlined style={{ fontSize: 22 }} />,
      color: '#EF9F27',
      bg: '#FFF4DE'
    },
    {
      title: 'Support Requests',
      value: '0',
      sub: 'No pending requests',
      icon: <CheckCircleOutlined style={{ fontSize: 22 }} />,
      color: '#00A76F',
      bg: '#E8FFF5'
    }
  ];

  const recentVendors = vendors.slice(0, 5);
  const recentDepts   = departments.slice(0, 5);

  const getStatusColor = (status, isActive) => {
    const s = status?.toLowerCase();
    if (s === 'active' || isActive === true) return { bg: '#E8F5EE', color: '#1D9E75' };
    if (s === 'pending') return { bg: '#FFF4DE', color: '#EF9F27' };
    return { bg: '#F3F4F6', color: '#6B7280' };
  };

  const getStatusLabel = (item) => {
    if (item.status) return item.status;
    return item.isActive ? 'Active' : 'Inactive';
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Grid container spacing={2.5}>

        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ background: '#dde3e2', borderRadius: 3, p: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#000000', mb: 0.5 }}>
              Admin Control Panel 👋
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.75)' }}>
              Manage vendors, departments and support types across the platform.
            </Typography>
          </Box>
        </Grid>

        {/* Stat Cards */}
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              border: '1px solid #f0f0f0',
              height: '100%',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h3" fontWeight={700} sx={{ my: 0.5, color: '#111827' }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: item.color, fontWeight: 500 }}>
                      {item.sub}
                    </Typography>
                  </Box>
                  <Box sx={{
                    backgroundColor: item.bg,
                    color: item.color,
                    p: 1.2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Recent Vendors */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid #f0f0f0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" fontWeight={600} color="#111827">Recent Vendors</Typography>
                <Typography variant="body2" sx={{ color: '#1D9E75', fontWeight: 500, cursor: 'pointer' }}>View all →</Typography>
              </Box>
              <Divider />
              {vendors.length === 0 ? (
                <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">No vendors found.</Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#FAFAFA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Vendor</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Location</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentVendors.map((vendor, index) => {
                      const sc = getStatusColor(vendor.status, vendor.isActive);
                      return (
                        <TableRow key={vendor._id || index} sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}>
                          <TableCell sx={{ fontWeight: 500, color: '#111827', fontSize: 15 }}>
                            {vendor.name || vendor.vendorName || vendor.hospitalName || '—'}
                          </TableCell>
                          <TableCell sx={{ color: '#6B7280', fontSize: 15 }}>
                            {vendor.location || vendor.city || vendor.address || '—'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: 20, fontSize: 13, fontWeight: 600, backgroundColor: sc.bg, color: sc.color, textTransform: 'capitalize' }}>
                              {getStatusLabel(vendor)}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Departments */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid #f0f0f0',
            height: '100%'
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" fontWeight={600} color="#111827">Departments Overview</Typography>
                <Typography variant="body2" sx={{ color: '#1D9E75', fontWeight: 500, cursor: 'pointer' }}>View all →</Typography>
              </Box>
              <Divider />
              {departments.length === 0 ? (
                <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">No departments found.</Typography>
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#FAFAFA' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 13, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDepts.map((dept, index) => {
                      const sc = getStatusColor(dept.status, dept.isActive);
                      return (
                        <TableRow key={dept._id || index} sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}>
                          <TableCell sx={{ fontWeight: 500, color: '#111827', fontSize: 15 }}>
                            {dept.name || dept.departmentName || '—'}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'inline-block', px: 1.5, py: 0.4, borderRadius: 20, fontSize: 13, fontWeight: 600, backgroundColor: sc.bg, color: sc.color, textTransform: 'capitalize' }}>
                              {dept.status || (dept.isActive ? 'Active' : 'Inactive')}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboardCard;