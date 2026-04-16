import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Users,
  Pencil,
  Menu,
  X,
  House,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home",icon: <House/>   },
    { to: "/dashboard/sales", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/dashboard/add-product", label: "Add Product", icon: <PackagePlus /> },
    { to: "/dashboard/products", label: "Products", icon: <PackageSearch /> },
    { to: "/dashboard/users", label: "Users", icon: <Users /> },
    { to: "/dashboard/orders", label: "Orders", icon: <Pencil /> },
  ];

  return (
    <>
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 w-full  flex justify-between items-center p-4 z-50">
        <h1 className="font-bold">Dashboard</h1>
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* 📱 MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-pink-50 border-r p-6 space-y-3 transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between mb-6">
          <h2 className="font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {navLinks.map((item, i) => (
          <NavLink
            key={i}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl ${
                isActive ? "bg-pink-600 text-white" : ""
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* 💻 DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[220px] lg:w-[300px] border-r p-6">
        <div className="pt-16 space-y-2">
          {navLinks.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl font-semibold ${
                  isActive ? "bg-pink-600 text-white" : ""
                }`
              }
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;