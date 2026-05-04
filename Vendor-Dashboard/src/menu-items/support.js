// assets import
import { IconHelpCircle } from '@tabler/icons-react';

// constant
const icons = { IconHelpCircle };

// ==============================|| SUPPORT MENU ITEM ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'support',
      title: 'Support',
      type: 'item',
      url: '/support',
      icon: icons.IconHelpCircle,
      breadcrumbs: false
    }
  ]
};

export default support;