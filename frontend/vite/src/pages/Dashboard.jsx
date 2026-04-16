import { Outlet } from "react-router-dom";
import React from 'react'

import Sidebar from '@/components/Sidebar'

const Dashboard = () => {
  return (
    <div className="flex ">
      <Sidebar/>
      <div className="flex-1">
        <Outlet/>
      </div>
    </div>
  )
}

export default Dashboard