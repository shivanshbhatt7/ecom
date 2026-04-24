import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

const ProductDesc = ({ product }) => {
  const [showPopup, setShowPopup] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product added to cart");
        setShowPopup(true);
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Session expired, login again");
        navigate("/login");
      }
    }
  };

  return (
    <>
      {/* ✅ SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl text-center shadow-2xl w-[90%] max-w-sm">
            <h2 className="text-xl font-semibold text-green-600 mb-2 ">
              Added to Cart ✅
            </h2>
            <p className="text-gray-600 text-sm">
              Your product has been added successfully.
            </p>
            <Button
              className="mt-4 w-full cursor-pointer"
              onClick={() => setShowPopup(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}

      {/* ✅ PRODUCT DETAILS */}
      <div className="flex flex-col gap-5 w-full">

        {/* Product Title */}
        <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl text-gray-900 leading-snug">
          {product.productName}
        </h1>

        {/* Category + Brand */}
        <p className="text-gray-500 text-sm sm:text-base">
          {product.category} • <span className="font-medium">{product.brand}</span>
        </p>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200"></div>

        {/* Price Section */}
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            ₹{product.productPrice}
          </h2>

          <span className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-md">
            In Stock
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {product.productDesc}
        </p>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200"></div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => addToCart(product._id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold 
          w-full sm:w-fit px-8 py-3 rounded-xl shadow-md hover:shadow-lg 
          transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          🛒 Add to Cart
        </Button>

      </div>
    </>
  );
};

export default ProductDesc;