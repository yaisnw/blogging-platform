import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import SignupPage from './components/pages/SignupPage';
import LoginPage from './components/pages/LoginPage';
import OAuth from './components/pages/OAuth';
import NavBar from './components/organisms/NavBar';
import HomePage from './components/pages/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="home"></Navigate>,
  },
  {
    path: '/signup',
    element: <SignupPage/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  },
  {
    path: '/oauth',
    element: <OAuth/>
  },
  {
    path: '/home',
    element: <NavBar/>,
    children: [
      {
        path: '',
        element: <HomePage/>
      }
    ]
  }

]);

export default router;
