import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { DBProvider } from './context/DBProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DBProvider>
      <App />
    </DBProvider>
  </React.StrictMode>,
)
