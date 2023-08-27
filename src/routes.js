import { useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import UserPage from './pages/MultiStepForm';
import LoginPage from './pages/LoginPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/app',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <UserPage /> },
      ],
    },
  ]);

  return routes;
}
