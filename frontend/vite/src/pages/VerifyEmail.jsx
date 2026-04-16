import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/verify`,
        {}, // body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatus("✅ Email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setStatus("❌ Verification failed. Invalid or expired token.");
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="relative w-full h-[760px] bg-pink-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;