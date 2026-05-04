import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';

const NavGroup = ({ item }) => {
  const lastItem = item?.children?.[item.children.length - 1]?.id;

  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} lastItem={lastItem} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <List disablePadding sx={{ mb: 0 }} subheader={null}>
      {items}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;