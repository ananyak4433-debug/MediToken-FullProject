import { IconTicket  } from '@tabler/icons-react';

const icons = { IconTicket  };

const support = {
  id: 'supportType',
  title: 'Support Type',
  type: 'group',
  children: [
    {
      id: 'supportType-page',
      title: 'Support Type',
      type: 'item',
      url: '/support-types', 
      icon: icons.IconTicket ,
      breadcrumbs: false
    }
  ]
};

export default support;