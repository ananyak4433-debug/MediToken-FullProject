// import dashboard from './dashboard';
// import RoleMenu from 'menu-items/roleMenu';

// // ==============================|| MENU ITEMS ||============================== //

// // ---Roles ---
// // Arbitrator
// // Claimant
// // Lawyer
// // Mediator
// // Expert
// // Respondent

// const menuItems = {
//   items: [dashboard],
//   vendor: [RoleMenu]
// };

// export default menuItems;



// import dashboard from './dashboard';
// import vendors from './vendors';
// import departments from './departments';
// import supportTypes from './supportTypes';

// const menuItems = {
//   items: [
//     dashboard,
//     vendors,
//     departments,
//     supportTypes
//   ]
// };

// export default menuItems;


import dashboard from './dashboard';
import vendors from './vendors';
import departments from './departments';
import support from './support';
import supportType from './supportType'


const menuItems = {
  items: [
    dashboard,
    vendors,
    departments,
    support,
    supportType
  ]
};

export default menuItems;