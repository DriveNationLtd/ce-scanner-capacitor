import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { DBProvider } from './context/DBProvider'
import { BrowserRouter } from 'react-router-dom'

import { BrowserRouter as Router, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { SingleEvent } from './components/events/SingleEvent'
import Layout from './Layout'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "events/:eventId",
        element: <SingleEvent />,
      },
      {
        path: "about",
        element: <>About</>,
      },
      {
        path: "dashboard",
        element: <>Dashboard</>,
      },
      {
        path: "*",
        element: <>404</>,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DBProvider>
      <RouterProvider router={router} />
    </DBProvider>
  </React.StrictMode>,
)
