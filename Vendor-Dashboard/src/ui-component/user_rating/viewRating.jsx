import { Box, Typography, IconButton, Grid, useTheme, Divider, Card, CardContent, Stack, Avatar, Paper, Chip } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import PersonIcon from '@mui/icons-material/Person';
import { Close as CloseIcon, Business as BusinessIcon } from '@mui/icons-material';

const ViewRatingDetail = ({ drawerOpen, setDrawerOpen, item }) => {
  const theme = useTheme();
  const primary = '#34699c';
  const lightGreen = '#e8f5e9';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  function capitalizeWords(str) {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const DetailSection = ({ icon, title, children }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2.5,
        borderColor: `${primary}30`,
        '&:hover': { boxShadow: '0 2px 8px rgba(1,152,99,0.1)' }
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
          <Avatar sx={{ bgcolor: lightGreen, color: primary, width: 32, height: 32 }}>{icon}</Avatar>
          <Typography variant="h5" fontWeight={600} color={primary}>
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );

  const DetailItem = ({ label, value, icon, isSubtitle }) => (
    <Box mb={1.5}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        {icon && (
          <Box component="span" sx={{ mr: 1, color: primary }}>
            {icon}
          </Box>
        )}
        {label}
      </Typography>
      <Typography
        variant={isSubtitle ? 'h6' : 'body1'}
        sx={{ fontWeight: isSubtitle ? 600 : 500, color: theme.palette.text.primary, ml: icon ? 2.5 : 0 }}
      >
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '80%', md: '70%', lg: 800 },
          background: '#fff',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
          borderLeft: `4px solid ${primary}`
        }
      }}
    >
      <Box p={3} height="100%" display="flex" flexDirection="column">
        {/* Header */}
        <Box flexGrow={1} overflow="auto" pr={1}>
          <Card sx={{ mb: 3, bgcolor: '#f0f9f6', borderRadius: 2, color: primary, boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <Typography
                    variant="h2"
                    fontWeight={700}
                    color={primary}
                    mr={2}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '350px'
                    }}
                  >
                    {capitalizeWords(item.comments)}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    bgcolor: lightGreen,
                    color: primary,
                    '&:hover': { bgcolor: '#ffffff' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Stack direction="row" flexWrap="wrap">
                <Typography sx={{ color: 'white', fontWeight: 400 }}>{item.starRating}</Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <DetailSection icon={<BusinessIcon />} title="Basic Information">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <DetailItem label="Facility ID" value={item.facilityId} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DetailItem label="Facility Title" value={capitalizeWords(item.facilityTitle)} />
              </Grid>
                 <Grid item xs={12}>
                <DetailItem label="Comments" value={capitalizeWords(item.comments)} />
              </Grid>
            </Grid>
          </DetailSection>

          {/*  Audit Trail (Admin) Details */}
          <DetailSection icon={<PersonIcon />} title=" Audit Trail (Admin)">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DetailItem label="Created" value={item?.createdUser || item?.createdBy || 'N/A'} />
                {formatDate(item?.createdOn)}
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem label=" Last Modified" value={item?.modifiedUser || item?.modifiedBy || 'N/A'} />
                {formatDate(item?.modifiedOn)}
              </Grid>
            </Grid>
          </DetailSection>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ViewRatingDetail;
