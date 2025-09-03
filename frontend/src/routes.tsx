import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import SignupPage from './components/pages/SignupPage';
import LoginPage from './components/pages/LoginPage';
import OAuth from './components/pages/OAuth';
import NavBar from './components/organisms/NavBar';
import HomePage from './components/pages/HomePage';
import MyPostsPage from './components/pages/MyPostsPage';
import PostEditorPage from './components/pages/PostEditorPage';
import PostViewerPage from './components/pages/PostViewerPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="home"></Navigate>,
  },
  {
    path: '/signup',
    element: <SignupPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/oauth',
    element: <OAuth />
  },
  {
    path: '/home',
    element: <NavBar />,
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'myPosts',
        element: <MyPostsPage />,
      },
      {
        path: 'posts/:id',
        element: <PostViewerPage />
      }

    ],
  },
  {
    path: 'createPost',
    element: <PostEditorPage />
  },
  {
    path: '/createPost/:id',
    element: <PostEditorPage />
  }



]);

export default router;
