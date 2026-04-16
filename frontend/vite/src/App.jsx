import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./pages/Navbar";

import Home from "./pages/Home";

import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Footer from "./components/ui/Footer";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import AddProduct from "./pages/admin/AddProduct";
import AdminSales from "./pages/admin/AdminSales";  
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import Dashboard from "./pages/Dashboard";
import AddressForm from "./pages/AddressForm";
import ProtectedRoute from "./components/ui/ProductedRoute";
import  { Toaster } from "react-hot-toast";
import SingleProduct from "./pages/SingleProduct";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetails from "./pages/admin/OrderDetails";
import Sig from "./pages/Sig";
import Lo from "./pages/Lo";

const router = createBrowserRouter([

  
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Sig />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Lo />
      </>
    ),
  },
  {
    path: "/verify",
    element: (
      <>
        <Verify />
      </>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify/:token",
    element: (
      <>
        <VerifyEmail />
      </>
    ),
  },
  {
    path: "/products",
    element: (
      <>
        <Navbar />
        <Products  />
      </>
    ),
  },
  // ✅ CATEGORY ROUTE (ADD THIS)
{
  path: "/products/category/:category",
  element: (
    <>
      <Navbar />
      <Products />
    </>
  ),
},
  {
    path: "/products/:id",
    element: (
      <>
        <Navbar />
        {/* <Products /> */}
        <SingleProduct />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/address",
    element: (
      <ProtectedRoute>
        <AddressForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-success",
    element: (
      <ProtectedRoute>
        <OrderSuccess />
      </ProtectedRoute>
    ),
  },
  {
    path:"/dashboard",
    element: (
  <ProtectedRoute adminOnly={true}>
    <div className="hidden md:block">
      <Navbar />
    </div>
    <Dashboard />
  </ProtectedRoute>
),
    children: [
      {
        path: "../",
        element: < Home/>,
      },
      {
        path: "sales",
        element: <AdminSales />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrders />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },
      {
        path:"orders/:id",
         element:<OrderDetails />
      }
    ],
  },
]);

const App = () => {
   <Toaster position="top-center" reverseOrder={false} />
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
