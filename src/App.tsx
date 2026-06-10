import type { RouteRecord } from 'vite-react-ssg'
import Home from './pages/Home'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Home />,
  },
]
