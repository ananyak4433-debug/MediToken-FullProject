import React from 'react';
import { TableBody, TableRow, TableCell, IconButton, Tooltip, Box, Typography, useTheme } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  History as HistoryIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Share as ShareIcon,
  CloudDownload as DownloadIcon,
  Close as CloseIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';
import CommentIcon from '@mui/icons-material/Comment';
import IosShareIcon from '@mui/icons-material/IosShare';
import { renderItem } from './ItemDisplay';
import NoDataMsg from './NodataMsg';
import styles from './style';

const TableRows = ({
  data = [],
  keys = [],
  config,
  currentPage,
  tableLimit,
  handleViewModel,
  handleFormModal,
  handleDeleteModal,
  handlProjectStatusModal,
  handleRevisionModal,
  createPdf,
  hasProjectDelete,
  hasProjectShare = false,
  hasDelete = true,
  hasEdit = true,
  hasComment = true,
  hasRevision = false,
  hasView = true,
  hasProjectView = false,
  hasProjectFile = false,
  hasProjectClose = false,
  hasPdfView = false,
  hasStatusChange = false,
  hasActionRow = true,
  hasMore = false,
  renderMoreComponent,
  hideArray = [],
  hasProjectStatusChange = false,
  handleMoreButtonClick,
  slNo = true,
  filter,
  msg,
  tableData,
  modal = '',
  ...props
}) => {
  const theme = useTheme();
  const style = styles(theme);
  console.log('==data', data);

  const user = JSON.parse(localStorage.getItem('PsbUser'));

  const cellContent = (keyItem, index, row) => {
    if (keyItem === 'starRating' && config[keyItem].type === 'number') {
      return renderItem(row[keyItem], config[keyItem].type, config[keyItem].res, keyItem);
    }

    if (keyItem === 'createdOn' && row[keyItem]) {
      return new Date(row[keyItem]).toLocaleDateString('en-GB');
      // formats to: DD/MM/YYYY
    }
    return renderItem(
      config[keyItem]?.label === 'Status'
        ? row.status
        : config[keyItem].type === 'number' && (row[keyItem] === undefined || row[keyItem] === '')
          ? '00'
          : config[keyItem].type === 'number' && (row[keyItem] !== undefined || row[keyItem] !== '')
            ? String(Number(row[keyItem]) + 1).padStart(2, '0')
            : config[keyItem].type === 'custom'
              ? row[config[keyItem].res]
              : row[keyItem],
      config[keyItem].type,
      config[keyItem].res,
      keyItem
    );
  };
  const formatRole = (role) => {
    if (!role) return '';
    // Insert space before uppercase letters, then capitalize first letter of each word
    return role
      .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter of the first word
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const visibleColumnCount = React.useMemo(() => {
    let count = 0;
    if (slNo) count++;
    keys.forEach((keyItem) => {
      if (config[keyItem] && !hideArray.includes(config[keyItem].label)) {
        count++;
      }
    });
    if (hasActionRow) count++;
    return count;
  }, [slNo, keys, config, hideArray, hasActionRow]);

  return (
    <TableBody>
      {data?.length > 0 ? (
        data.map((row, i) => (
          <TableRow
            key={i}
            sx={{
              backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'ellipsis',
              padding: '10px !important'
            }}
          >
            {slNo && <TableCell sx={{ width: '23px', padding: '10px !important' }}>{tableLimit * (currentPage - 1) + i + 1}</TableCell>}
            {keys.map((keyItem, index) => {
              if (!config[keyItem] || hideArray.includes(config[keyItem].label)) {
                return null;
              }
              return (
                <TableCell
                  key={index}
                  //  className={style.firstLetterCap}
                  sx={{
                    ...style.firstLetterCap,
                    // textTransform: 'capitalize',
                    ...(keyItem === 'projectId' ? {} : { maxWidth: '155px' }),
                    padding: '10px !important',
                    textAlign: config[keyItem]?.align === 'right' ? 'right' : 'left'
                  }}
                >
                  <Tooltip
                    title={keyItem === 'status' || keyItem === 'revision' ? '' : String(cellContent(keyItem, index, row)) || ''}
                    placement="top"
                    disableHoverListener={keyItem === 'starRating' || keyItem === 'avgStarRating'}
                    componentsProps={{
                      tooltip: {
                        sx: { textTransform: 'capitalize' }
                      }
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        ...style.tableRowLabel,
                        color:
                          keyItem === 'status'
                            ? row.status === 'Open'
                              ? `${theme.palette.success.main} !important`
                              : row.status === 'Pending'
                                ? `${theme.palette.warning.main} !important`
                                : row.status === 'Closed'
                                  ? `${theme.palette.error.main} !important`
                                  : `${theme.palette.text.primary} !important`
                            : `${theme.palette.text.primary} !important`,
                        fontWeight: keyItem === 'status' ? 600 : 400,
                        textTransform: keyItem === 'email' ? 'lowercase' : 'none'
                      }}
                    >
                      {keyItem === 'role' ? formatRole(row[keyItem]) : cellContent(keyItem, index, row)}
                    </Typography>
                  </Tooltip>
                </TableCell>
              );
            })}
            {hasActionRow && (
              <TableCell sx={{ whiteSpace: 'nowrap', padding: '10px !important' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {hasView && (
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        size="small"
                        sx={{ ...style.cmnIcon, ...style.cmnViewIcon }}
                        onClick={() => handleViewModel(row, modal)}
                      >
                        <VisibilityIcon sx={style.cmnSvg} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasEdit && row.status !== 'publish' && row.status !== 'deleted' && row.status !== 'completed' && (
                    <Tooltip title={row.status === 'rejected' ? 'Cannot edit rejected facility' : 'Edit'}>
                      <IconButton
                        color="info"
                        onClick={() => row.status !== 'rejected' && handleFormModal(row)}
                        size="small"
                        sx={{ ...style.cmnIcon, ...style.cmnEditIcon }}
                        disabled={row.status === 'rejected'} // disables click but keeps visible
                      >
                        <EditIcon sx={style.cmnSvg} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {hasComment && (
                    <Tooltip title="Reply">
                      <IconButton
                        color="info"
                        onClick={() => handleFormModal(row)}
                        size="small"
                        sx={{ ...style.cmnIcon, ...style.cmnEditIcon }}
                      >
                        <CommentIcon sx={style.cmnSvg} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {hasStatusChange && (
                    <Tooltip
                      title={
                        row.status === 'rejected' || row.status === 'draft'
                          ? 'This request is closed — status cannot be changed'
                          : 'Change status'
                      }
                    >
                      <IconButton
                        color="warning"
                        onClick={() => handlProjectStatusModal(row)}
                        size="small"
                        sx={{ ...style.cmnIcon, ...style.cmnStatusIcon }}
                        disabled={row.status === 'rejected' || row.status === 'draft'}
                      >
                        <BlockIcon fontSize="small" sx={style.cmnSvg} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {hasDelete && row.status !== 'publish' && (
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteModal(row)}
                        size="small"
                        sx={{ ...style.cmnIcon, ...style.cmnStatusIcon }}
                      >
                        <DeleteIcon fontSize="small" sx={style.cmnSvg} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {/* Add other action buttons as needed */}
                </Box>
              </TableCell>
            )}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={visibleColumnCount} sx={{ textAlign: 'center', py: 3 }}>
            <NoDataMsg msg={msg} tableData={tableData} filter={filter} />
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default TableRows;
