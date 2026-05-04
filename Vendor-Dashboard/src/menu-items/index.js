import dashboard from './dashboard';
import RoleMenu from 'menu-items/roleMenu';

// ==============================|| MENU ITEMS ||============================== //

// ---Roles ---
// Arbitrator
// Claimant
// Lawyer
// Mediator
// Expert
// Respondent

const menuItems = {
  items: [dashboard],
  vendor: [RoleMenu]
};

export default menuItems;
