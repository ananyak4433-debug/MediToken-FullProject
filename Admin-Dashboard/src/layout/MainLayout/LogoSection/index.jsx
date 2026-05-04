// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// material-ui
import Box from '@mui/material/Box';

// project imports
// import config from 'config';
import Logo from 'ui-component/Logo';
// import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  // const defaultId = useSelector((state) => state.customization.defaultId);
  // const dispatch = useDispatch();
  return (
    <Box sx={{ height: '55px', display: 'flex', justifyContent: 'left',alignItems:'center' }}>
      <Logo />
    </Box>
  );
};

export default LogoSection;
