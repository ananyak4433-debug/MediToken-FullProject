// assets import
import { IconClock } from '@tabler/icons-react';

// constant
const icons = { IconClock };

// ==============================|| TOKEN QUEUE MENU ITEM ||============================== //

const tokenQueue = {
  id: 'tokenQueue',
  title: 'Token Queue',
  type: 'group',
  children: [
    {
      id: 'token-queue',
      title: 'Token Queue',
      type: 'item',
      url: '/token-queue',
      icon: icons.IconClock,
      breadcrumbs: false
    }
  ]
};

export default tokenQueue;