import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const Sig = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/register`,
        formData,
      );

      if (response.data.success) {
        toast.success("OTP sent to email");

        // ✅ pass email to verify page
        navigate("/verify", { state: { email: formData.email } });
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-b from-white via-gray-100 to-blue-100 rounded-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            {/* Brand Name */}
            <div className="mb-10">
              <h1 className="inline-block px-6 py-3 rounded-full border-2 border-gray-800 font-bold text-xl">
                Electro
              </h1>
            </div>

            {/* Form Section */}
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl text-center mb-2 font-bold">
                Create an Account
              </h2>

              <p className="text-gray-600 text-center mb-8">
                Join our community and unlock exclusive features
              </p>

              <form className="space-y-6 "  onSubmit={SubmitHandler}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-6 py-3 bg-white rounded-full border border-gray-300 outline-none text-sm placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-6 py-3 bg-white rounded-full border border-gray-300 outline-none text-sm placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-3 bg-white rounded-full border border-gray-300 outline-none text-sm placeholder:text-gray-600"
                  />
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    type={showpassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-6 py-3 bg-white rounded-full border border-gray-300 outline-none text-sm placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute right-3 top-3.5"
                  >
                    {showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
               <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center cursor-pointer gap-2 rounded-full py-3 font-semibold transition-all duration-300 
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-400 hover:bg-blue-500 hover:scale-[1.02]"
  }`}
>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 text-sm">or</span>
                  <div className="grow border-t border-gray-300"></div>
                </div>
                <p className=" text-center mb-2 sm:mb-0">
                  Already have an account ?{" "}
                  <Link
                    to="/login"
                    className="hover:underline hover:text-blue-600 underline text-black-800"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2">
            {/* Image */}
            <img
              src="/5.jpg"
              className="w-full h-full object-cover"
              alt="banner image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sig;
