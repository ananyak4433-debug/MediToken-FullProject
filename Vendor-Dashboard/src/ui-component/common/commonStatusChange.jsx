import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

// Define available status options
const STATUS_OPTIONS = [
  {value:'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'closed', label: 'Close' },
  { value: 'open', label: 'Open' },
  { value: 'inProgress', label: 'In Progress' }
];

const StatusChangeModal = ({ open, facility, onClose, onConfirm, type , title = 'Change Facility Status' }) => {
  const theme = useTheme();
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (facility) {
      setNewStatus(facility.status || '');
    }
  }, [facility]);

  const handleConfirm = () => {
    if (newStatus && newStatus !== facility.status) {
      onConfirm(newStatus);
    }
    if (newStatus === facility.status) {
      onClose();
    }
  };

  if (!facility) return null;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="status-change-dialog-title" maxWidth="xs" fullWidth>
      <DialogTitle id="status-change-dialog-title" sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Current Status:
          <Box
            component="span"
            sx={{
              ml: 1,
              fontWeight: 600,
              color: theme.palette.primary.main,
              textTransform: 'capitalize'
            }}
          >
            {facility.status || 'N/A'}
          </Box>
        </Typography>

        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="new-status-label">New Status</InputLabel>
          <Select labelId="new-status-label" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} label="New Status">
            {STATUS_OPTIONS.filter((option) => {
              if (type === 'issue') {
                return ['open', 'closed', 'inProgress'].includes(option.value);
              } else {
                if (facility.status === 'open' || facility.status === 'closed') {
                  return option.value === 'open' || option.value === 'closed';
                } else {
                  return option.value === 'active' || option.value === 'inactive';
                }
              }
            }).map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.value === facility.status}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            mt: 1,
            py: 1.5,
            fontWeight: 400,
            fontSize: 12,
            color: 'red',
            borderRadius: 2,
            border: '1px solid red',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'red',
              border: '1px solid red',
              backgroundImage: 'none'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{
            mt: 1,
            py: 1.5,
            fontWeight: 400,
            fontSize: 12,
            color: 'white !important',
            backgroundColor: '#34699c',
            borderRadius: 2,
            border: '1px solid #34699c',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'black !important',
              border: '1px solid #34699c'
            }
          }}
          disabled={!newStatus || newStatus === facility.status}
        >
          Confirm Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusChangeModal;
