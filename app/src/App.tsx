import {
  Outlet,
  createRootRoute,
  createRoute,
  RouterProvider,
  createRouter
} from '@tanstack/react-router';
import CarList from './components/CarList';

import Auth from './components/Auth';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <></>
      <Outlet/>
    </>
  )
});

const indexRoute = createRoute({
 getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="main-layout">
      <></>
      <CarList/>
    </div>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Auth,
})

const routeTree = rootRoute.addChildren([indexRoute, loginRoute]);
const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
