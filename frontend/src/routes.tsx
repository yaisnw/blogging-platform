// src/routes.js
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import SignupPage from './components/pages/SignupPage';
import LoginPage from './components/pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="signup"></Navigate>,
  },
  {
    path: '/signup',
    element: <SignupPage/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  }
  

]);

export default router;
