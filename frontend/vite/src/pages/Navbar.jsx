import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  X,
  Menu,
  LayoutDashboard,
  Users,
  House,
  LogOut,
  LogIn,
  PackageSearch,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { clearUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.user?.user);
  const { cart } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const logooutHandler = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      if (accessToken && accessToken !== "null") {
        await axios.post(
          `${import.meta.env.VITE_URL}/api/v1/user/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout API error:", error.response?.data);
    }

    localStorage.removeItem("accessToken");
    dispatch(clearUser());
    navigate("/login");
    toast.success("Logged out");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <header
  className={`fixed top-0 w-full z-20 h-[70px] sm:h-[80px] flex items-center transition-all duration-300 ${
    scrolled
      ? "bg-black/80 backdrop-blur-md"
      : "bg-[radial-gradient(circle,_rgba(0,0,0,1)_0%,_rgba(157,158,157,1)_50%,_rgba(0,0,0,1)_100%)]"
  }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 w-full h-full">
        
        {/* LOGO */}
        <img
          onClick={() => navigate("/")}
          src="/a.png"
          alt=""
          className="w-[45px] sm:w-[60px] cursor-pointer"
        />
        {/* <img
          onClick={() => navigate("/")}
          src="/b.png"
          alt=""
          className="w-[55px] cursor-pointer"
        /> */}

        <h1 className="text-3xl text-white font-sans">
          {/* <b>卄ⲗŕ𝑣𝔦</b> */}
          <b> ᑌᑭKᗩᖇᖇᗩᑎ </b>
        </h1>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-10 items-center">
          <ul className="flex gap-7 items-center text-lg font-semibold">

            {/* HOME */}
            <NavLink to="/" end>
              {({ isActive }) => (
                <li className="relative group flex flex-col items-center cursor-pointer">
                  <House
                    className={`w-6 h-6 text-white hover:scale-125 ${
                      isActive ? "text-white" : ""
                    }`}
                  />
                  {isActive && (
                    <span className="w-9 h-[4px] bg-yellow-500 mt-2 rounded"></span>
                  )}
                  <span className="absolute top-full text-white mt-2 opacity-0 group-hover:opacity-100 text-xs transition">
                    Home
                  </span>
                </li>
              )}
            </NavLink>

            {/* PRODUCTS */}
            <NavLink to="/products">
              {({ isActive }) => (
                <li className="relative group flex flex-col items-center cursor-pointer">
                  <PackageSearch
                    className={`w-6 h-6 text-white hover:scale-125 ${
                      isActive ? "text-white"  : ""
                    }`}
                  />
                  {isActive && (
                    <span className="w-9 h-[4px] bg-yellow-500 mt-2 rounded"></span>
                  )}
                  <span className="absolute top-full text-white mt-2 opacity-0 group-hover:opacity-100 text-xs transition">
                    Products
                  </span>
                </li>
              )}
            </NavLink>

            {/* PROFILE */}
            {user && (
              <NavLink to={`/profile/${user._id}`}>
                {({ isActive }) => (
                  <li className="relative group flex flex-col items-center cursor-pointer">
                    <Users
                      className={`w-6 h-6 text-white bg- hover:scale-125 ${
                        isActive ? "text-white" : ""
                      }`}
                    />
                    {isActive && (
                      <span className="w-9 h-[4px] bg-yellow-500 mt-2 rounded"></span>
                    )}
                    <span className="absolute top-full mt-2 opacity-0 text-white group-hover:opacity-100 text-xs transition">
                      Hello, {user.firstName}
                    </span>
                  </li>
                )}
              </NavLink>
            )}

            {/* DASHBOARD */}
            {admin && (
              <NavLink to="/dashboard/sales">
                {({ isActive }) => (
                  <li className="relative group flex flex-col items-center cursor-pointer">
                    <LayoutDashboard
                      className={`w-6 h-6 text-white hover:scale-125 ${
                        isActive ? "text-white" : ""
                      }`}
                    />
                    {isActive && (
                      <span className="w-9 h-[4px] bg-yellow-500 mt-2 rounded"></span>
                    )}
                    <span className="absolute  text-white top-full mt-2 opacity-0 group-hover:opacity-100 text-xs transition">
                      Dashboard
                    </span>
                  </li>
                )}
              </NavLink>
            )}
          </ul>

          {/* CART */}
          <NavLink to="/cart" className="relative">
            {({ isActive }) => (
              <>
                <ShoppingCart
                  className={`hover:scale-125 text-white ${
                    isActive ? "text-white" : ""
                  }`}
                />
                {isActive && (
                  <span className="absolute left-1/2 -translate-x-1/2 top-6 w-9 h-[4px] bg-yellow-500 mt-2 rounded"></span>
                )}
                <span className="absolute -top-2 -right-4 px-2 text-white text-xs">
                  {cart?.items?.length || 0}
                </span>
              </>
            )}
          </NavLink>

          {/* AUTH */}
          {user ? (
            <LogOut
              onClick={logooutHandler}
              className="hover:scale-125 cursor-pointer text-white hover:text-red-500 "
            />
          ) : (
            <LogIn
              onClick={() => navigate("/login")}
              className="hover:scale-125 cursor-pointer text-white hover:text-blue-500"
            />
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button className="md:hidden text-white flex items-center justify-center" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0  bg-black/40 z-40 md:hidden"
          />

          <div className="fixed top-0 left-0 h-full w-72  z-50 p-6">
            <div className="flex justify-end mb-6">
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="flex flex-col gap-4 text-white font-semibold">
              <NavLink to="/" onClick={() => setOpen(false)}>
                <div className="bg-white text-black px-5 py-3 rounded-full text-center">
                  HOME
                </div>
              </NavLink>

              <NavLink to="/products" onClick={() => setOpen(false)}>
                <div className="bg-white text-black px-5 py-3 rounded-full text-center">
                  PRODUCTS
                </div>
              </NavLink>

              {user && (
                <NavLink
                  to={`/profile/${user._id}`}
                  onClick={() => setOpen(false)}
                >
                  <div className="bg-white text-black px-5 py-3 rounded-full text-center">
                    HELLO, {user.firstName}
                  </div>
                </NavLink>
              )}

              {admin && (
                <NavLink
                  to="/dashboard/sales"
                  onClick={() => setOpen(false)}
                >
                  <div className="bg-white text-black px-5 py-3 rounded-full text-center">
                    DASHBOARD
                  </div>
                </NavLink>
              )}

              <NavLink to="/cart" onClick={() => setOpen(false)}>
                <div className="bg-white text-black px-5 py-3 rounded-full text-center">
                  CART ({cart?.items?.length || 0})
                </div>
              </NavLink>

              {user ? (
                <button
                  onClick={() => {
                    logooutHandler();
                    setOpen(false);
                  }}
                  className="bg-red-700 px-5 py-3 rounded-full"
                >
                  LOGOUT
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="bg-blue-500 px-5 py-3 rounded-full"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
