
import { IconHelp } from '@tabler/icons-react';

const icons = { IconHelp };

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'support-page',
      title: 'Support',
      type: 'item',
      url: '/support',
      icon: icons.IconHelp,
      breadcrumbs: false
    }
  ]
};

export default support;