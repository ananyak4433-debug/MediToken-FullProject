export const getSideMenu = (role, menu) => {
  switch (role) {
    case 'Vendor,Surveyor':
      return menu.vendor;
    default:
       return menu.vendor;
      break;
  }
};
