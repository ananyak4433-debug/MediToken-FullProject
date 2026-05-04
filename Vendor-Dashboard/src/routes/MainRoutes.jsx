
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/authGuard';

// ✅ Import your new Staff Page
// import StaffPage from 'views/staff';
// import AddDoctorForm from 'ui-component/staff/AddStaffsForm'

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('ui-component/dashboard')));
const DoctorsMenu = Loadable(lazy(() => import('ui-component/doctors')));
const PatientsMenu = Loadable(lazy(() => import('ui-component/patients')));
const TokenMenu = Loadable(lazy(() => import('ui-component/tokenQueue')));
const BookingsMenu = Loadable(lazy(() => import('ui-component/bookings')));
const StaffMenu = Loadable(lazy(() => import('ui-component/staff')));
const SupportMenu = Loadable(lazy(() => import('ui-component/support/SupportDashboard')));

// ❌ REMOVE this (old static staff UI)
// const StaffMenu = Loadable(lazy(() => import('ui-component/staff')));

const NopageFound = Loadable(lazy(() => import('ui-component/common/no-page/NoPage')));

const UserFeedbackPage = Loadable(lazy(() => import('ui-component/user_feedback/index')));
const UserRatingPage = Loadable(lazy(() => import('ui-component/user_rating/index')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard user={['Vendor,Surveyor', 'Vendor', 'Requester']}>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Navigate to="/dashboard" replace={true} />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    {
      path: '/doctors',
      element: <DoctorsMenu />
    },
    {
      path: '/patients',
      element: <PatientsMenu />
    },
    {
      path: '/tokenQueue',
      element: <TokenMenu />
    },
    {
      path: '/bookings',
      element: <BookingsMenu />
    },
    {
      path: '/staff',
      element: <StaffMenu />
    },
    {
      path: '/support',
      element: <SupportMenu />
    },

    // Optional fallback
    {
      path: '*',
      element: <NopageFound />
    }
  ]
};

export default MainRoutes;