// assets import
import { IconUsers } from '@tabler/icons-react';

// constant
const icons = { IconUsers };

// ==============================|| PATIENT MENU ITEM ||============================== //

const patients = {
  id: 'patients',
  title: 'Patients',
  type: 'group',
  children: [
    {
      id: 'patients',
      title: 'Patients',
      type: 'item',
      url: '/patients',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
  ]
};

export default patients;