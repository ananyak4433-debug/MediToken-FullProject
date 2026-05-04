// renderItem.js
import React from 'react';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography'; 
import dateFormat from 'dateformat';
import { useTheme } from '@mui/material';
import styles from './style';
const getStatusColor = (status) => {
  switch (status) {
    case 'open': 
      return { text: '#27a5d6', bg: '#27a5d640' };
    case 'active':
      return { text: '#019863', bg: '#0198632e' };
    case 'rejected':
      return { text: '#ff0000bd', bg: '#ff00002b' };
    case 'draft':
      return { text: '#f39c12', bg: '#f39c1236' };
    case 'inactive':
      return { text: '#6c757d', bg: '#6c757d2e' };
    case 'inProgress':
      return { text: '#f39c12', bg: '#f39c1236' };
    case 'cancelled':
      return { text: '#ffffff', bg: '#f86c6b' };
    case 'created':
      return { text: '#ffffff', bg: '#20a8d8' };
    case 'suspended':
      return { text: '#ffffff', bg: '#808080' };
    case 'draft':
      return { text: '#ffffff', bg: '#808080' };
    case 'closed':
      return { text: '#019863', bg: '#0198632e' };
    case 'deleted':
      return { text: '#ffffff', bg: '#ff0000' };
    case 'inProgress':
      return { text: 'rgb(12,102,204)', bg: '#27a5d63b' };
    default:
      return { text: '#ffffff', bg: 'blue' };
  }
};

const renderItem = (data, type, res = '', key = '') => {
  const theme = useTheme();
  const style = styles(theme);
  let returnData = '';

  switch (type) {
    case 'string':
      if (key === 'status') {
        const colors = getStatusColor(data);
        return (
          <Typography
            variant="body2"
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <Chip
              label={data === 'inProgress' ? 'In Progress' : data}
              sx={{
                ...style.chipLabel,
                backgroundColor: colors.bg,
                color: colors.text,
                fontWeight: 600
              }}
              size="small"
            />
          </Typography>
        );
      } else if (key === 'amount') {
        returnData = data ? data : '-';
      } else if (key === 'emissnfactor') {
        returnData = <span className="">{data && data ? data.toFixed(2) : '-'}</span>;
      } else if (key === 'valueInKgCO2e') {
        returnData = <span className="">{data && data ? data.toFixed(2) : '0'}</span>;
      } else {
        returnData = data || '-';
      }
      break;
    case 'object':
      returnData = (data && data.name) || '-';
      break;
    case 'date':
      returnData = data ? dateFormat(data, 'mediumDate') : '-';
      break;
    case 'custom':
      if (key === 'mobileNo') {
        returnData = data ? data.callingCode + data[key] : '-';
      } else {
        returnData = (data && data[key]) || '-';
      }
      break;
    case 'number':
      returnData = data || '-';
      break;
    case 'boolean':
      returnData = String(data);
      break;
    default:
      returnData = '';
  }
  return returnData;
};

export { renderItem, getStatusColor };
