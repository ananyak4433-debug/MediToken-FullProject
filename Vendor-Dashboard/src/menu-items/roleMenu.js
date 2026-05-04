// import {
//   IconLayoutDashboard,
//   IconUsers,          // Staff
//   IconStethoscope,     //Doctor
//   IconClock,          // Token Queue
//   IconCalendarEvent ,  // Bookings
//   IconUserHeart      //Patients
// } from '@tabler/icons-react';
// // constant
// const icons = {
//   IconLayoutDashboard,
//   IconUsers,
//   IconStethoscope,
//   IconClock,
//   IconCalendarEvent,
//   IconUserHeart
// };

// const RoleMenu = {
//   id: 'dashboard',
//   title: '',
//   type: 'group',
//   children: [
//     {
//       id: 'dashboard',
//       title: 'Dashboard',
//       type: 'item',
//       url: '/dashboard',
//       icon: icons.IconLayoutDashboard,
//       breadcrumbs: false
//     },
//     {
//       id: 'staff',
//       title: 'Staff',
//       type: 'item',
//       url: '/staff',
//       icon: icons.IconUsers,
//       breadcrumbs: false
//     },
//     {
//       id: 'doctors',
//       title: 'Doctors',
//       type: 'item',
//       url: '/doctors',
//       icon: icons.IconStethoscope,
//       breadcrumbs: false
//     },
//     {
//       id: 'patients',
//       title: 'Patients',
//       type: 'item',
//       url: '/patients',
//       icon: icons.IconUserHeart,
//       breadcrumbs: false
//     },
//     {
//       id: 'tokenQueue',
//       title: 'Token Queue',
//       type: 'item',
//       url: '/tokenQueue',
//       icon: icons.IconClock,
//       breadcrumbs: false
//     },
//     {
//       id: 'bookings',
//       title: 'Bookings',
//       type: 'item',
//       url: '/bookings',
//       icon: icons.IconCalendarEvent,
//       breadcrumbs: false
//     }
     
//     // {
//     //   id: 'facility',
//     //   title: 'Facilities',
//     //   type: 'item',
//     //   url: '/facility',
//     //   icon: icons.IconShieldCheck,
//     //   breadcrumbs: false
//     // },
//     //     {
//     //   id: 'userManagment',
//     //   title: 'Users',
//     //   type: 'item',
//     //   url: '/userManagment',
//     //   icon: icons.IconFileImport,
//     //   breadcrumbs: false
//     // },

//     //     {
//     //   id: 'reportedIssues',
//     //   title: 'Issues',
//     //   type: 'item',
//     //   url: '/reportedIssues',
//     //   icon: icons.IconAlertTriangle,
//     //   breadcrumbs: false
//     // },
//     // {
//     //   id: 'userfeedback',
//     //   title: 'User Feedback',
//     //   type: 'item',
//     //   url: '/userfeedback',
//     //   icon: icons.IconMessageCircle ,
//     //   breadcrumbs: false
//     // },
//     //     {
//     //   id: 'rating',
//     //   title: 'Ratings & Feedback',
//     //   type: 'item',
//     //   url: '/rating',
//     //   icon: icons.IconStar,
//     //   breadcrumbs: false
//     // },




//   ]
// };

// export default RoleMenu;







import {
  IconLayoutDashboard,
  IconUsers,          // Staff
  IconStethoscope,   // Doctor
  IconClock,         // Token Queue
  IconCalendarEvent, // Bookings
  IconUserHeart,     // Patients
  IconHeadset        // ✅ Support
} from '@tabler/icons-react';

// constant
const icons = {
  IconLayoutDashboard,
  IconUsers,
  IconStethoscope,
  IconClock,
  IconCalendarEvent,
  IconUserHeart,
  IconHeadset // ✅ add here
};

const RoleMenu = {
  id: 'dashboard',
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
      id: 'staff',
      title: 'Staff',
      type: 'item',
      url: '/staff',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'doctors',
      title: 'Doctors',
      type: 'item',
      url: '/doctors',
      icon: icons.IconStethoscope,
      breadcrumbs: false
    },
    {
      id: 'patients',
      title: 'Patients',
      type: 'item',
      url: '/patients',
      icon: icons.IconUserHeart,
      breadcrumbs: false
    },
    {
      id: 'tokenQueue',
      title: 'Token Queue',
      type: 'item',
      url: '/tokenQueue',
      icon: icons.IconClock,
      breadcrumbs: false
    },
    {
      id: 'bookings',
      title: 'Bookings',
      type: 'item',
      url: '/bookings',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },

    
    {
  id: 'support',
  title: 'Support',
  type: 'item',
  url: '/support',
  icon: icons.IconHeadset,
  breadcrumbs: false
}

   
  ]
};

export default RoleMenu;