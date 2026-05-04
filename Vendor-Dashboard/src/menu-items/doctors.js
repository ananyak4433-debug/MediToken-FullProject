// assets import
import { IconUserHeart } from '@tabler/icons-react';

// constant
const icons = { IconUserHeart };

// ==============================|| DOCTOR MENU ITEM ||============================== //

const doctors = {
  id: 'doctors',
  title: 'Doctors',
  type: 'group',
  children: [
    {
      id: 'doctors',
      title: 'Doctors',
      type: 'item',
      url: '/doctors',
      icon: icons.IconUserHeart,
      breadcrumbs: false
    }
  ]
};

export default doctors;