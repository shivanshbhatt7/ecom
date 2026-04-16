import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import MyOrder from "./MyOrder";
import axios from "axios";

const Profile = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user?.user);
  const id = user?._id;

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
  });

  const [file, setFile] = useState(null);

  // ✅ LOAD USER INTO FORM
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ ONLY RUN ON FIRST LOAD
    if (user && !updateUser.email) {
      setUpdateUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FILE CHANGE
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setUpdateUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(selectedFile), // preview
      }));
    }
  };

  // ✅ UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("accessToken");

      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);

      if (file) {
        formData.append("file", file);
      }

      const id = user?._id; // ✅ safest

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const data = res.data; // ✅ FIX

      if (data.success) {
        dispatch(setUser(data.user));

        setUpdateUser({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || "",
          phoneNo: data.user.phoneNo || "",
          address: data.user.address || "",
          city: data.user.city || "",
          zipCode: data.user.zipCode || "",
          profilePic: data.user.profilePic || "",
        });

        setFile(null);

        toast.success("Profile updated successfully");
        setShowPopup(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center shadow-lg">
            <h2 className="text-xl font-bold mb-2">Success ✅</h2>
            <p>Update Profile successfully!</p>
            <Button className="mt-4" onClick={() => setShowPopup(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
      <div className="pt-26 sm:pt-29 bg-gradient-to-b from- via-gray-100 to-blue-100 min-h-screen px-3  sm:px-5">
        <Tabs defaultValue="profile" className="max-w-2xl  mx-auto ">
          {/* Tabs Header */}
          <TabsList className="flex justify-center gap-2 sm:gap-4  flex-wrap">
            <TabsTrigger
              className="cursor-pointer hover:shadow-xl mt-3 sm:mt-5 text-sm  sm:text-base"
              value="profile"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer hover:shadow-xl mt-3 sm:mt-5 text-sm sm:text-base"
              value="orders"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <div className="flex flex-col  items-center">
              <h1 className="font-bold mb-5 sm:mb-7 text-xl sm:text-2xl text-center">
                Update Profile
              </h1>

              <div className="flex flex-col bg-gray-200 md:flex-row gap-6 sm:gap-10  p-4 sm:p-6 rounded-xl shadow w-full">
                {/* IMAGE SECTION */}
                <div className="flex flex-col items-center w-full md:w-1/3">
                  <img
                    src={updateUser.profilePic || "/profile.avif"}
                    alt="profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                  />

                  <Label className="mt-3 sm:mt-4 cursor-pointer text-white bg-red-700 px-3 sm:px-4 py-2 rounded hover:bg-red-800 text-sm sm:text-base">
                    Change Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>

                {/* FORM SECTION */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4 w-full md:w-2/3"
                >
                  <Input
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    // className='text-pink-800 border-slate-800'
                  />
                  <Input
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                  <Input name="email" value={updateUser.email} disabled />
                  <Input
                    name="phoneNo"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                  <Input
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                  <Input
                    name="city"
                    value={updateUser.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <Input
                    name="zipCode"
                    value={updateUser.zipCode}
                    onChange={handleChange}
                    placeholder="Zip Code"
                  />

                  <Button
                    className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white text-sm sm:text-base"
                  >
                    Update Profile
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <div className="mt-4 sm:mt-6">
              <MyOrder />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
