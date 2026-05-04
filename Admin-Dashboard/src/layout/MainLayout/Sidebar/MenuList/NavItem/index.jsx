import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box } from '@mui/system';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level, lastItem }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
  const largeScreen = useMediaQuery('(min-width:1650px)');
  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  const isSelected = customization.isOpen.findIndex((id) => id === item.id) > -1;

  const Icon = item.icon;

  const itemIcon = item?.icon ? (
    <Icon
      stroke={1.5}
      size="1.3rem"
      style={{ color: isSelected ? '#2BB6A3' : '#6B7280' }}
    />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: isSelected ? 8 : 6,
        height: isSelected ? 8 : 6,
        color: isSelected ? '#2BB6A3' : '#6B7280'
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  let itemTarget = '_self';
  if (item.target) itemTarget = '_blank';

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    ))
  };

  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (item) => {
    dispatch({ type: MENU_OPEN, item });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
  };

  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);

    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, item });
    }
  }, [pathname, dispatch, item]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      selected={isSelected}
      onClick={() => itemHandler(item)}
      sx={{
        paddingY: 0,
        paddingRight: 0,
        // marginBottom: lastItem === item?.id ? '120px' : '12px',
        marginBottom: '2px',


        '&.Mui-selected': {
          backgroundColor: 'rgba(43, 182, 163, 0.12)'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: '12px',
          borderRadius: `${customization.borderRadius}px`,
          py: 1,
          pl: `${level * 10}px`,
          pr: 2,
          ml: leftDrawerOpened ? 0 : -1,

          backgroundColor: isSelected
            ? 'rgba(43, 182, 163, 0.12)'
            : 'transparent',

          color: isSelected ? '#2BB6A3' : '#111827',
          position: 'relative',
          transition: 'all 0.2s ease',

          // 🔹 ICON STYLE (clean - no heavy background)
          '& .MuiListItemIcon-root': {
            minWidth: 'auto',
            color: isSelected ? '#2BB6A3' : '#6B7280'
          },

          // 🔹 HOVER EFFECT
          '&:hover': {
            backgroundColor: 'rgba(43, 182, 163, 0.08)',
            color: '#2BB6A3',

            '& .MuiListItemIcon-root': {
              color: '#2BB6A3'
            }
          }
        }}
      >
        <ListItemIcon>{itemIcon}</ListItemIcon>

        <ListItemText
          primary={
            <Typography
              variant={
                isSelected
                  ? largeScreen
                    ? 'selectedSideMenu'
                    : 'h6'
                  : largeScreen
                  ? 'sideMenu'
                  : 'body1'
              }
              sx={{ fontSize: '14px', fontWeight: 500 }}
            >
              {item.title}
            </Typography>
          }
          secondary={
            item.caption && (
              <Typography
                variant="caption"
                sx={{ ...theme.typography.subMenuCaption }}
                display="block"
              >
                {item.caption}
              </Typography>
            )
          }
        />

        {item.chip && (
          <Chip
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </Box>
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  lastItem: PropTypes.string
};

export default NavItem;