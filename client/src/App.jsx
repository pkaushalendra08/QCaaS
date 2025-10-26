import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home'
import Experiment from './pages/Experiment'
import Result from './pages/Result'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/experiment",
    element: <Experiment />,
  },
  {
    path: "/result",
    element: <Result />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )

}

export default App;