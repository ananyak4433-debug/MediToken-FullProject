import { IconBuildingHospital } from '@tabler/icons-react';

const icons = { IconBuildingHospital };

const departments = {
  id: 'departments',
  title: 'Departments',
  type: 'group',
  children: [
    {
      id: 'departments-page',
      title: 'Departments',
      type: 'item',
      url: '/departments',
      icon: icons.IconBuildingHospital,
      breadcrumbs: false
    }
  ]
};

export default departments;