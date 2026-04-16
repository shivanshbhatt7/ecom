import { ShoppingCart } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setCart } from "@/redux/productSlice";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product;

  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Add to Cart Function
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
        toast.success("Product added to Cart ");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product ");
    }
  };

  return (
    <div className="shadow-md rounded-xl overflow-hidden w-full sm:w-[180px] bg-white hover:shadow-2xl">
      
      {/* Image Section */}
      <div className="w-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            src={productImg[0]?.url}
            onClick={() => navigate(`./${product._id}`)}
            alt="product"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        )}
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="px-2 py-2 space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-full h-8" />
        </div>
      ) : (
        <div className="px-2 py-2 space-y-1">
          <h1 className="font-semibold text-sm line-clamp-2">
            {productName}
          </h1>

          <h2 className="font-bold text-sm">
            ₹{productPrice}
          </h2>

          <Button
            disabled={!accessToken}
            onClick={() => navigate(`/products/${product._id}`)}
            className="bg-[radial-gradient(circle,_rgba(0,0,0,1)_0%,_rgba(157,158,157,1)_50%,_rgba(0,0,0,1)_100%)] text-white hover:scale-105 cursor-pointer text-xs sm:text-sm py-2 w-full flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4 " />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;