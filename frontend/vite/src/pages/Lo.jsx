

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Lo = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = import.meta.env.VITE_URL ;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent double click

    // ✅ validation
    if (!formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      console.log("API:", `${API_URL}/api/v1/user/login`);

      const response = await axios.post(
        `${API_URL}/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const token = response.data.accessToken;

        if (!token) {
          return toast.error("Token missing");
        }

        // ✅ save token
        localStorage.setItem("accessToken", token);

        // ✅ redux user
        dispatch(setUser(response.data.user));

        toast.success(response.data.message || "Login successful");

        navigate("/");
      }
    } catch (error) {
  console.log("FULL ERROR:", error);

  if (error.response) {
    // Backend response आया
    toast.error(error.response.data.message);
  } else if (error.request) {
    // Request गया but response नहीं आया
    toast.error("Server not responding");
  } else {
    // कोई और error
    toast.error("Something went wrong");
  }
}finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-b from-white via-gray-100 to-blue-100 rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-10">
              <h1 className="inline-block px-6 py-3 rounded-full border-2 border-gray-800 font-bold text-xl">
                Electro
              </h1>
            </div>

            <div className="max-w-md mx-auto">
              <h2 className="text-3xl text-center mb-2 font-bold">
                Welcome Back
              </h2>

              <p className="text-gray-600 text-center mb-8">
                Sign in to your account
              </p>

              <form onSubmit={SubmitHandler} className="space-y-6">
                
                {/* EMAIL */}
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-3 rounded-full border outline-none"
                />

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    name="password"
                    type={showpassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-6 py-3 rounded-full border outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute right-3 top-3.5"
                  >
                    {showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-full py-3 cursor-pointer font-semibold transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-400 hover:bg-blue-500 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Logging in..." : "Sign in"}
                </button>

                <div className="flex items-center my-6">
                  <div className="grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 text-sm">or</span>
                  <div className="grow border-t border-gray-300"></div>
                </div>

                <p className="text-center">
                  Don't have an account?{" "}
                  <Link to="/signup" className="underline">
                    Sign up
                  </Link>
                </p>

              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2">
            <img
              src="/5.jpg"
              className="w-full h-full object-cover"
              alt="banner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lo;