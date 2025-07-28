import { RouteObject } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import BookmarkFormPage from './pages/BookmarkFormPage';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';

export const Routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/bookmark-form',
    element: <BookmarkFormPage />,
    errorElement: <ErrorPage />,
  },
];