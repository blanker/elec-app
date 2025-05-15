import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router";
import routes from './routes';
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { MenuProvider } from "@/context/menu-context";

// defaultAlgorithm
createRoot(document.getElementById('root')).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <MenuProvider>
      <RouterProvider router={routes} />
    </MenuProvider>
  </ThemeProvider>
)
