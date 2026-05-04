// assets import
import { IconUsers } from '@tabler/icons-react';

// constant
const icons = { IconUsers };

// ==============================|| STAFF MENU ITEM ||============================== //

const staff = {
  id: 'staff',
  title: 'Staff',
  type: 'group',
  children: [
    {
      id: 'staff',
      title: 'Staff',
      type: 'item',
      url: '/staff',
      icon: "users",
      breadcrumbs: false
    }
  ]
};

export default staff;