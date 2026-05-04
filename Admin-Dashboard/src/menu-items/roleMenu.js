
import {
  IconLayoutDashboard,
  IconBuildingStore,
  IconBuildingHospital,
  IconHelpCircle,
  IconHeadset
} from '@tabler/icons-react';

// ==============================|| ICONS ||============================== //

const icons = {
  IconLayoutDashboard,
  IconBuildingStore,
  IconBuildingHospital,
  IconHelpCircle,
  IconHeadset
};

// ==============================|| ROLE MENU ||============================== //

const RoleMenu = {
  id: 'admin-menu',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconLayoutDashboard,
      breadcrumbs: false
    },
    {
      id: 'vendors',
      title: 'Vendors',
      type: 'item',
      url: '/vendors',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'departments',
      title: 'Departments',
      type: 'item',
      url: '/departments',
      icon: icons.IconBuildingHospital,
      breadcrumbs: false
    },
     {
      id: 'support',
      title: 'Support',
      type: 'item',
      url: '/support',
      icon: icons.IconHeadset,
      breadcrumbs: false
    },
    {
      id: 'support-types',
      title: 'Support Types',
      type: 'item',
      url: '/support-types',
      icon: icons.IconHelpCircle,
      breadcrumbs: false
    }
  ]
};

export default RoleMenu;