
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/authGuard';

// ==============================|| PAGE IMPORTS ||============================== //

const DashboardDefault  = Loadable(lazy(() => import('ui-component/dashboard')));
const VendorsPage       = Loadable(lazy(() => import('ui-component/vendors')));
const DepartmentsPage   = Loadable(lazy(() => import('ui-component/departments')));
const SupportPage       = Loadable(lazy(() => import('ui-component/support')));  
const SupportTypesPage  = Loadable(lazy(() => import('ui-component/supportTypes')));
const NopageFound       = Loadable(lazy(() => import('ui-component/common/no-page/NoPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard user={['Vendor', 'Surveyor', 'Requester']}>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '',
      element: <Navigate to="dashboard" replace />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'vendors',
      element: <VendorsPage />
    },
    {
      path: 'departments',
      element: <DepartmentsPage />
    },
    {
      path: 'support',
      element: <SupportPage />
    },
    {
      path: 'support-types',
      element: <SupportTypesPage />
    },
    {
      path: '*',
      element: <NopageFound />
    }
  ]
};

export default MainRoutes;