import {
  Outlet,
  createRootRoute,
  createRoute,
  RouterProvider,
  createRouter,
  redirect
} from '@tanstack/react-router';
import Header from './components/Header';
import Auth from './components/Auth';
import Home from './components/Home';

const rootRoute = createRootRoute({
  component: () => <Outlet />
});

const mainLayoutRoute = createRoute({
  id: 'mainLayout',
  getParentRoute: () => rootRoute,
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/',
  component: Home
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (localStorage.getItem('token')) {
      throw redirect({ to: '/' });
    }
  },
  component: Auth,
});

const routeTree = rootRoute.addChildren([
  mainLayoutRoute.addChildren([indexRoute]),
  loginRoute
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}