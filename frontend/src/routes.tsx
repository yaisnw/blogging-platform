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
import PublicPostsPage from './components/pages/PublicPostsPage';
import ProfilePage from './components/pages/ProfilePage';
import SearchPage from './components/pages/SearchPage';

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
        path: 'dashboard',
        element: <MyPostsPage />,
      },
      {
        path: 'posts',
        element: <PublicPostsPage />
      },
      {
        path: 'posts/:id/:title',
        element: <PostViewerPage />
      },
      {
        path: 'profile/:id?',
        element: <ProfilePage />
      },
      {
        path: 'createPost',
        element: <PostEditorPage />
      },
      {
        path: 'createPost/:id',
        element: <PostEditorPage />
      },
      {
        path: 'search',
        element: <SearchPage />
      }

    ],
  },




]);

export default router;
