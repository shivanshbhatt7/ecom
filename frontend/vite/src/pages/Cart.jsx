import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import profile from "@/assets/profile.avif";
import { toast } from "sonner";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);

  const subtotal = Number(cart?.totalPrice || 0);
  const shipping = subtotal > 499 ? 0 : 100;
  const tax = Number((subtotal * 0.0).toFixed(2)) ;
  const total = subtotal + shipping + tax;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = `${import.meta.env.VITE_URL}/api/v1/cart`;
  const accessToken = localStorage.getItem("accessToken");

  // ✅ UPDATE QUANTITY
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res?.data?.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // ✅ REMOVE ITEM
  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { productId },
      });

      if (res?.data?.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product removed");
      }
    } catch {
      toast.error("Failed to remove");
    }
  };

  // ✅ LOAD CART
  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res?.data?.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch {
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="pt-25 bg-gradient-to-b to-white via-gray-100 from-blue-300  min-h-screen px-3 sm:px-6 lg:px-8">
      {cart?.items?.filter((p) => p?.productId)?.length > 0 ? (
        <div className="max-w-7xl mx-auto">

          <h1 className="text-xl sm:text-2xl font-bold mb-6">
            Shopping Cart
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* 🛒 LEFT */}
            <div className="flex flex-col gap-4 flex-1">
              {cart.items
                .filter((p) => p?.productId)
                .map((product, index) => {
                  const item = product.productId;

                  const price = Number(item?.productPrice || 0);
                  const quantity = Number(product?.quantity || 0);
                  const totalPrice = price * quantity;

                  return (
                    <Card key={index} className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between">

                        {/* PRODUCT */}
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={item?.productImg?.[0]?.url || profile}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                          />

                          <div>
                            <h1 className="font-semibold text-sm sm:text-base line-clamp-2">
                              {item?.productName}
                            </h1>
                            <p className="text-gray-600 text-sm">₹{price}</p>
                          </div>
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateQuantity(item?._id, "decrease")
                            }
                            className='cursor-pointer hover:text-red-500'
                          >
                            -
                          </Button>

                          <span>{quantity}</span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateQuantity(item?._id, "increase")
                            }
                            className='cursor-pointer hover:text-green-600'
                          >
                            +
                          </Button>
                        </div>

                        {/* PRICE + REMOVE */}
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold">₹{totalPrice}</p>

                          <button
                            onClick={() => handleRemove(item?._id)}
                            className="cursor-pointer pt-2 hover:text-red-500 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>

            {/* 💰 RIGHT */}
            <div className="w-full lg:w-[350px]">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹{tax}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input placeholder="Promo Code" />
                      <Button className='cursor-pointer' variant="outline">Apply</Button>
                    </div>

                    <Button
                      className="w-full bg-green-600 cursor-pointer text-white hover:bg-green-700"
                      onClick={() => navigate("/address")}
                    >
                      PLACE ORDER
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>* Free shipping above ₹299</p>
                    <p>* Secure checkout</p>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <ShoppingCart className="w-14 h-14 text-pink-600" />
          <h2 className="mt-4 text-xl font-bold">Your Cart is Empty</h2>
          <Button
            onClick={() => navigate("/products")}
            className="mt-4 bg-pink-600"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;