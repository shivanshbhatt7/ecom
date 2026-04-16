import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
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
  }

  const navigate = useNavigate();

  const SubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/register`, formData,{
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(response.data.success){
        navigate("/verify");
        toast.success(response.data.message);
      }
    }
     catch(error){
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          
            <div className="flex flex-col gap-3">

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                    onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    type={showpassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute right-3 top-2.5"
                  >
                    {showpassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Button onClick={SubmitHandler} className="w-full mt-2 cursor-pointer bg-pink-500 hover:bg-pink-600 text-white">
                {loading ? "Creating account..." : "Signup"}
              </Button>

              <p className="text-gray-70 text-sm text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="hover:underline text-pink-800"
                >
                  Login
                </Link>
              </p>

            </div>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;