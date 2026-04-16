import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import profile from "../../../public/profile.avif";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";

const UserInfo = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.id;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    try {
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

      const res = await fetch(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        // ✅ update local state immediately
        setUpdateUser({
          firstName: data.user?.firstName || "",
          lastName: data.user?.lastName || "",
          email: data.user?.email || "",
          phoneNo: data.user?.phoneNo || "",
          address: data.user?.address || "",
          city: data.user?.city || "",
          zipCode: data.user?.zipCode || "",
          profilePic: data.user?.profilePic || "",
        });

        setFile(null);

        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`,
      );
      if (res.data.success) {
        setUpdateUser({
          firstName: res.data.user?.firstName || "",
          lastName: res.data.user?.lastName || "",
          email: res.data.user?.email || "",
          phoneNo: res.data.user?.phoneNo || "",
          address: res.data.user?.address || "",
          city: res.data.user?.city || "",
          zipCode: res.data.user?.zipCode || "",
          profilePic: res.data.user?.profilePic || "",
        });
        console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, [userId]);

  return (
    // <div className="pt-5 min-h-screen  bg-gray-100">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
    //       <div className="flex justify-between mt-20 gap-10 ">
    //         <Button onClick={() => navigate(-1)}>
    //           <ArrowLeft />
    //         </Button>
    //         <h1 className="font-bold mb-7 text-2xl text-gray-800">
    //           Update Profile
    //         </h1>
    //       </div>
    //       <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded shadow">
    //         {/* IMAGE */}
    //         <div className="flex flex-col items-center">
    //           <img
    //             src={updateUser?.profilePic || "/profile.avif"}
    //             alt="profile"
    //             className="w-32 h-32 rounded-full object-cover"
    //           />

    //           <Label className="mt-4 cursor-pointer text-white bg-pink-600 px-4 py-2 rounded hover:bg-pink-700">
    //             Change Picture
    //             <Input
    //               type="file"
    //               accept="image/*"
    //               className="hidden"
    //               onChange={handleFileChange}
    //             />
    //           </Label>
    //         </div>

    //         {/* FORM */}
    //         <form onSubmit={handleSubmit} className="space-y-4 w-max max-w-md">
    //           <Input
    //             name="firstName"
    //             value={updateUser?.firstName || ""}
    //             onChange={handleChange}
    //             placeholder="First Name"
    //           />
    //           <Input
    //             name="lastName"
    //             value={updateUser?.lastName || ""}
    //             onChange={handleChange}
    //             placeholder="Last Name"
    //           />
    //           <Input name="email" value={updateUser?.email || ""} disabled />
    //           <Input
    //             name="phoneNo"
    //             value={updateUser?.phoneNo || ""}
    //             onChange={handleChange}
    //             placeholder="Phone Number"
    //           />
    //           <Input
    //             name="address"
    //             value={updateUser?.address || ""}
    //             onChange={handleChange}
    //             placeholder="Address"
    //           />
    //           <Input
    //             name="city"
    //             value={updateUser?.city || ""}
    //             onChange={handleChange}
    //             placeholder="City"
    //           />
    //           <Input
    //             name="zipCode"
    //             value={updateUser?.zipCode || ""}
    //             onChange={handleChange}
    //             placeholder="Zip Code"
    //           />
    //           <div className="flex gap-3 items-center">
    //             <Label className="block text-sm font-medium">Role :</Label>
    //             <RadioGroup
    //               value={updateUser?.role}
    //               onValueChange={(value) =>
    //                 setUpdateUser({ ...updateUser, role: value })
    //               }
    //               className="flex items-center"
    //             >
    //               <div className="flex items-center space-x-2">
    //                 <RadioGroupItem value="user" id="user" />
    //                 <Label htmlFor="user">User</Label>
    //               </div>
    //               <div className="flex items-center space-x-2">
    //                 <RadioGroupItem value="admin" id="admin" />
    //                 <Label htmlFor="admin">Admin</Label>
    //               </div>
    //             </RadioGroup>
    //           </div>
    //           <Button className="w-full bg-pink-600 hover:bg-pink-700">
    //             Update Profile
    //           </Button>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 lg:px-8 py-16 sm:py-25">
  <div className="max-w-xl mx-auto">

    {/* HEADER */}
    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <Button onClick={() => navigate(-1)} className="p-2">
        <ArrowLeft />
      </Button>
      <h1 className="font-bold text-xl sm:text-2xl text-gray-800">
        Update Profile
      </h1>
    </div>

    {/* MAIN CARD */}
    <div className="flex flex-col md:flex-row gap-6 sm:gap-10 bg-white p-4 sm:p-6 rounded shadow">

      {/* IMAGE */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <img
          src={updateUser?.profilePic || "/profile.avif"}
          alt="profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
        />

        <Label className="mt-3 sm:mt-4 cursor-pointer text-white bg-pink-600 px-3 sm:px-4 py-2 rounded hover:bg-pink-700 text-sm sm:text-base">
          Change Picture
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 sm:space-y-4 w-full md:w-2/3"
      >
        <Input
          name="firstName"
          value={updateUser?.firstName || ""}
          onChange={handleChange}
          placeholder="First Name"
        />

        <Input
          name="lastName"
          value={updateUser?.lastName || ""}
          onChange={handleChange}
          placeholder="Last Name"
        />

        <Input name="email" value={updateUser?.email || ""} disabled />

        <Input
          name="phoneNo"
          value={updateUser?.phoneNo || ""}
          onChange={handleChange}
          placeholder="Phone Number"
        />

        <Input
          name="address"
          value={updateUser?.address || ""}
          onChange={handleChange}
          placeholder="Address"
        />

        <Input
          name="city"
          value={updateUser?.city || ""}
          onChange={handleChange}
          placeholder="City"
        />

        <Input
          name="zipCode"
          value={updateUser?.zipCode || ""}
          onChange={handleChange}
          placeholder="Zip Code"
        />

        {/* ROLE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Label className="text-sm font-medium">Role:</Label>

          <RadioGroup
            value={updateUser?.role}
            onValueChange={(value) =>
              setUpdateUser({ ...updateUser, role: value })
            }
            className="flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">User</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
        </div>

        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-sm sm:text-base">
          Update Profile
        </Button>
      </form>
    </div>
  </div>
</div>
  );
};

export default UserInfo;
