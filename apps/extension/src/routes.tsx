import { RouteObject } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import BookmarkFormPage from "./pages/BookmarkFormPage";
import ErrorPage from "./pages/ErrorPage";
import MainPage from "./pages/MainPage";

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/bookmark-form",
        element: <BookmarkFormPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <ErrorPage />,
  },
];
