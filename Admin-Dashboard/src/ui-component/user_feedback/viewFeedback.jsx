

import { Box, Typography, IconButton, Grid, useTheme, Divider, Paper } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CommentIcon from '@mui/icons-material/Comment';

const ViewFeedbackDetail = ({ drawerOpen, setDrawerOpen, item }) => {
  const theme = useTheme();


  const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '80%', md: '60%', lg: '900px' },
          maxWidth: '100vw',
          backgroundColor: '#fafafa',
        }
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            User Feedback Details
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="large">
            <CloseIcon />
          </IconButton>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {/* Feedback Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CommentIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>Feedback</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {item?.comments || 'No feedback provided.'}
            </Typography>
          </Paper>

          {/* User Info Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>User Information</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Created On</Typography>
<Typography variant="body1">
  {item?.createdOn
    ? new Date(item.createdOn).toISOString().split('T')[0]
    : 'N/A'}
</Typography>              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Created User</Typography>
                <Typography variant="body1">{item?.createdUser || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>


        </Box>
      </Box>
    </Drawer>
  );
};

export default ViewFeedbackDetail;