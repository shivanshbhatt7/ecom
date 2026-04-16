import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [],
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    
    <div
      className="min-h-screen bg-gradient-to-tr from-yellow-300 via-pink-200 to-yellow-500 
  px-3 sm:px-6 lg:px-8 
  py-20 md:py-30
  md:ml-[220px] lg:ml-[300px]"
    >
      {/* ===== Stats Cards ===== */}
      <div
        className="grid gap-4 sm:gap-6 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-4 
    mb-6 sm:mb-8"
      >
        <Card className="bg-red-700 hover:shadow-2xl text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl sm:text-3xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>

        <Card className="bg-purple-700 hover:shadow-2xl text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl sm:text-3xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>

        <Card className="bg-blue-700 hover:shadow-2xl text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl sm:text-3xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>

        <Card className="bg-green-700 hover:shadow-2xl  text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl sm:text-3xl font-bold">
            ₹ {stats.totalSales}
          </CardContent>
        </Card>
      </div>

      {/* ===== Sales Chart ===== */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Sales (Last 30 Days)
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.sales || []}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                className="sm:text-xs"
              />

              <YAxis tick={{ fontSize: 10 }} />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
