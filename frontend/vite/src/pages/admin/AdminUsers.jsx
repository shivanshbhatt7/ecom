import axios from "axios";
import { Edit, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import profile from "../../../public/profile.avif";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user?.firstName || ""} ${user?.lastName || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-26 lg:pl-[320px]">
      
      {/* ===== Header ===== */}
      <h1 className="font-bold text-2xl sm:text-3xl">User Management</h1>
      <p className="text-gray-600 mt-1">
        View and manage registered users
      </p>

      {/* ===== Search ===== */}
      <div className="relative w-full sm:w-[320px] mt-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          placeholder="Search users..."
        />
      </div>

      {/* ===== Users Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-pink-100 p-5 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePic || profile}
                alt="profile"
                className="rounded-full w-14 h-14 object-cover border border-pink-600"
              />

              <div className="overflow-hidden">
                <h1 className="font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-sm text-gray-700 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              
              <Button
                variant="outline"
                className="w-full cursor-pointer sm:w-auto bg-white"
                onClick={() =>
                  navigate(`/dashboard/users/${user?._id}`)
                }
              >
                <Edit size={16} />
                Edit
              </Button>

              <Button
                className="w-full cursor-pointer hover:shadow-2xl sm:w-auto bg-blue-600 text-white"
                onClick={() =>
                  navigate(`/dashboard/users/orders/${user?._id}`)
                }
              >
                <Eye size={16} />
                Orders
              </Button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;