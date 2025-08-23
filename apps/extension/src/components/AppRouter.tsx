import { Routes } from '@/routes'
import { isChromeExtension } from '@/utils/extension'
import { createBrowserRouter, createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './errors/ErrorBoundary'

const router = isChromeExtension ? createMemoryRouter(Routes) : createBrowserRouter(Routes)

const AppRouter = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default AppRouter
