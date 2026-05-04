import { IconBuildingStore } from '@tabler/icons-react';

const icons = { IconBuildingStore };

const vendors = {
  id: 'vendors',
  title: 'Vendors',
  type: 'group',
  children: [
    {
      id: 'vendors-page',
      title: 'Vendors',
      type: 'item',
      url: '/vendors',
      icon: icons.IconBuildingStore,
      breadcrumbs: false
    }
  ]
};

export default vendors;