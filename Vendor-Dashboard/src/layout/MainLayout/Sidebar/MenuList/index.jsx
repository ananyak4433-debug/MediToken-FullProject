import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSideMenu } from 'utils/getSideMenu';
import { useNavigate } from 'react-router-dom';
import { Modal, Box as MuiBox, Button } from '@mui/material';
import { useState } from 'react';

const MenuList = () => {
  const login = useSelector((state) => state.login);
  const userData = useSelector((state) => state?.arbitratorReducer?.profileUpdate?.user?.data || {});
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const isDraft = userData?.custom_status === 'Draft';
  let menuItems = getSideMenu(login?.data?.message?.roles, menuItem);

  useEffect(() => {
    menuItems = getSideMenu(login?.data?.message?.roles, menuItem);
  }, [login]);

  const handleMenuClick = (e) => {
    if (isDraft) {
      e.preventDefault();
      e.stopPropagation();
      setModalOpen(true);
      return false;
    }
    return true;
  };

  const handleProfileRedirect = () => {
    setModalOpen(false);
    navigate('/profile');
  };

  const navItems =
    menuItems &&
    menuItems.map((item) => {
      switch (item.type) {
        case 'group':
          return <NavGroup key={item.id} item={item} onClick={handleMenuClick} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });

  return (
    <>
      {navItems}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="draft-modal-title"
        aria-describedby="draft-modal-description"
      >
        <MuiBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography id="draft-modal-title" variant="h6" component="h2">
            Profile Incomplete
          </Typography>
          <Typography id="draft-modal-description" sx={{ mt: 2, mb: 3 }}>
            Please fill your profile details to access the menu items.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleProfileRedirect} fullWidth>
            Go to Profile
          </Button>
        </MuiBox>
      </Modal>
    </>
  );
};

export default MenuList;
