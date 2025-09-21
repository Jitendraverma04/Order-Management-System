import React from 'react'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';


import {RouterProvider,createBrowserRouter,Navigate} from 'react-router-dom';
import {CartProvider} from './assets/CartContext.jsx';
import { ToastContainer, toast } from 'react-toastify';

import Layout from './Pages/Layout';
import WebPage from './Pages/WebPage';
import ErrorPage from './Pages/ErrorPage';
import HelloPage from './Pages/HelloPage';
import CartPage from './Pages/CartPage';

import CategoryItems from './items-page/CategoryItems.jsx';
import Category from './Pages/Category.jsx';


//import AdminLayoutPage from './Admin-Dashboard/Admin-Pages/AdminLayoutPage.jsx';
import AnalyticsPage from './Admin-Dashboard/Admin-Pages/AnalyticsPage.jsx';
import AddItem from './Admin-Dashboard/Admin-Pages/AddItem.jsx'
import Dashboard from './Admin-Dashboard/Admin-Pages/Dashboard.jsx';
import NewTable from './Admin-Dashboard/Admin-Pages/NewTable.jsx';
import OrderHistoryPage from './Admin-Dashboard/Admin-Pages/OrderHistoryPage.jsx';
import Authentication from './Admin-Dashboard/Authentication/Authentication.jsx';
import ProtectedRoute from './Admin-Dashboard/Authentication/ProctectedRoute.jsx';
import Register from './Admin-Dashboard/Authentication/Register.jsx';
import Login from './Admin-Dashboard/Authentication/Login.jsx';
import ToolsPage from './Admin-Dashboard/Admin-Pages/ToolsPage.jsx';
import ReportsPage from './Admin-Dashboard/Admin-Pages/ReportsPage.jsx';
import CustomersPage from './Admin-Dashboard/Admin-Pages/CustomersPage.jsx';
import Customize from './Admin-Dashboard/Admin-Pages/Customize.jsx'
import CustomizeItems from './Admin-Dashboard/Admin-Pages/CustomizeItems.jsx';

function App() {

const router = createBrowserRouter([

  { path: "/", element: <WebPage /> },
  { path: "order/errorPage", element: <ErrorPage /> }, 
  { path: "order/:tableId",element:<HelloPage/>},

  {
    element: <Layout />,
    children: [
        { path: "order/:tableId/menu/:categoryName", element: <CategoryItems/> },  
       { path: "order/:tableId/menu/",element:<Category/>},
       { path: "order/:tableId/cart",element:<CartPage/>},  
    ],
  },



  {
    path: "/my-system/admin/authentication",
    element: <Authentication />
  },

  {
    path: "/my-system/admin",
    element: <ProtectedRoute />,

    children: [   
      { path: "", element: <Navigate to="dashboard" replace /> },

      //Custom opteration
      { path: "additem", element: <AddItem /> },
      { path: "orderhistorypage", element: <OrderHistoryPage /> },
      { path: "newtable", element: <NewTable /> },

      { path: "analytics", element: <AnalyticsPage /> },
      { path: "dashboard", element: <Dashboard/> },
      {path:"tools",element:<ToolsPage/>},
      {path:"reports",element:<ReportsPage/>},
      {path:"customers",element:<CustomersPage/>},
      {path:"customize",element:<Customize/>},
      {path:"customizeItems/:categoryName",element:<CustomizeItems/>},
      

      {path:"register",element:<Register/>},
      {path:"login",element:<Login/>}
    ]
  }
  

]);

  


  return (
    <div className="App">
              
              <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" />

      <CartProvider>
     <RouterProvider router={router}/>
      </CartProvider>

    </div>
  )
}

export default App
