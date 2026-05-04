// assets import
import { IconCalendarEvent } from '@tabler/icons-react';

// constant
const icons = { IconCalendarEvent };

// ==============================|| BOOKINGS MENU ITEM ||============================== //

const bookings = {
  id: 'bookings',
  title: 'Bookings',
  type: 'group',
  children: [
    {
      id: 'bookings',
      title: 'Bookings',
      type: 'item',
      url: '/bookings',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    }
  ]
};

export default bookings;