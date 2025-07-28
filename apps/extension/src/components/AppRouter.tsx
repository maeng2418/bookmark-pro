import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { router } from '../lib/router';

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}