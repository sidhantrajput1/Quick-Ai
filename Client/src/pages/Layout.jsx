import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import { SignIn, useUser } from "@clerk/clerk-react";




const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);

  const { user } = useUser();
  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img src={assets.logo} alt="logo" className="cursor-pointer" onClick={() => navigate("/")} />

        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6  text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6  text-gray-600 sm:hidden"
          />
        )}
      </nav>

      <div className="flex h-[calc(100vh-64px)] w-full">
        {/* Sidebar */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        {/* Main content / Dashboard */}
        <div className="flex-1 bg-[#F4F7FB] overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
