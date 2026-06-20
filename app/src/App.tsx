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
import Home from './components/Home'
import AddCar from './components/AddCar';
import CarDetails from './components/CarDetails';
import MyCars from './components/MyCars';
import EditCar from './components/EditCar';

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

const addCarRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/add',
  beforeLoad: () => {
    if (!localStorage.getItem('token')) {
      throw redirect({ to: '/login' });
    }
  },
  component: AddCar
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

const carDetailsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/car/$carId',
  component: CarDetails,
});

const myCarsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/my-cars',
  component: MyCars
});

const editCarRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/edit/$carId',
  component: EditCar
});

const routeTree = rootRoute.addChildren([
  mainLayoutRoute.addChildren([
    indexRoute,
    addCarRoute,
    carDetailsRoute,
    myCarsRoute,
    editCarRoute
  ]),
  loginRoute
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}