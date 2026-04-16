import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import {
  addAddress,
  deleteAddress,
  setSelectedAddress,
  setCart,
} from "@/redux/productSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const AddressForm = () => {
  console.log(import.meta.env.VITE_URL);
   const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const [paymentMethod, setPaymentMethod] = useState("");

  // ✅ ONLY ONE useSelector
  const { cart, addresses = [], selectedAddress } = useSelector(
    (store) => store.product
  );

  // ✅ safe selected address
  const selectedAddr =
    selectedAddress !== null && addresses.length > 0
      ? addresses[selectedAddress]
      : null;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

const [showForm, setShowForm] = useState(true);

React.useEffect(() => {
  if (addresses.length > 0) {
    setShowForm(false);
  }
}, [addresses]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 499 ? 0 : 100;
  const tax = parseFloat((subtotal * 0.00).toFixed(2));
  const total = subtotal + shipping + tax;

  // const handlePayment = async () => {
  //   const accessToken = localStorage.getItem("accessToken");

  //   try {
  //     // 🧾 Create order from backend
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
  //       {
  //         products: cart?.items?.map((item) => ({
  //           productId: item.productId._id,
  //           quantity: item.quantity,
  //         })),
  //         tax,
  //         shipping,
  //         amount: total,
  //         currency: "INR",
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       },
  //     );

  //     if (!data.success) {
  //       return toast.error("Something went wrong");
  //     }

  //     console.log("Razorpay data:", data);

  //     // 💳 Razorpay options
  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: data.order.amount,
  //       currency: data.order.currency,
  //       order_id: data.order.id, // Order ID from backend
  //       name: "Ekart",
  //       description: "Order Payment",

  //       handler: async function (response) {
  //         try {
  //           // 🔐 Verify payment on backend
  //           const verifyRes = await axios.post(
  //             `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
  //             response,
  //             {
  //               headers: { Authorization: `Bearer ${accessToken}` },
  //             },
  //           );

  //           if (verifyRes.data.success) {
  //             toast.success("✅ Payment Successful!");
  //             dispatch(setCart({ items: [], totalPrice: 0 }));

  //             navigate("/order-success");
  //           } else {
  //             toast.error("❌ Payment Verification failed");
  //           }
  //         } catch (error) {
  //           console.log(error);
  //           toast.error("Error verifying payment");
  //         }
  //       },
  //       modal: {
  //         ondismiss: async function () {
  //           // Handle user closing the popup
  //           await axios.post(
  //             `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
  //             {
  //               razorpay_order_id: data.order.id,
  //               paymentFailed: true,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${accessToken}`,
  //               },
  //             },
  //           );

  //           toast.error("Payment Cancelled or Failed");
  //         },
  //       },
  //       prefill: {
  //         name: formData.fullName,
  //         email: formData.email,
  //         contact: formData.phone,
  //       },
  //       theme: { color: "#F472B6" },
  //     };
  //     const rzp = new window.Razorpay(options);
  //     // Listen for payment failures
  //     rzp.on("payment.failed", async function (response) {
  //       await axios.post(
  //         `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
  //         {
  //           razorpay_order_id: data.order.id,
  //           paymentFailed: true,
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${accessToken}` },
  //         },
  //       );

  //       toast.error("Payment Failed. Please try again");
  //     });

  //     rzp.open();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong while processing payment");
  //   }
  // };
  const handlePayment = async () => {
  const accessToken = localStorage.getItem("accessToken");

  // ✅ check address
  if (!selectedAddr) {
    return toast.error("Please select address");
  }

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
      {
        products: cart?.items?.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          color: item.color || item.selectedColor,
          size: item.size,
        })),
        tax,
        shipping,
        amount: total,
        currency: "INR",

        // ✅ ADD THIS (MAIN FIX)
        shippingAddress: selectedAddr,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!data.success) {
      return toast.error("Something went wrong");
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      order_id: data.order.id,
      name: "Ekart",
      description: "Order Payment",

      handler: async function (response) {
        try {
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            response,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          if (verifyRes.data.success) {
            toast.success("✅ Payment Successful!");
            dispatch(setCart({ items: [], totalPrice: 0 }));
            navigate("/order-success");
          } else {
            toast.error("❌ Payment Verification failed");
          }
        } catch (error) {
          toast.error("Error verifying payment");
        }
      },

      modal: {
        ondismiss: async function () {
          await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          toast.error("Payment Cancelled or Failed");
        },
      },

      // ✅ USE SELECTED ADDRESS (not formData)
      prefill: {
        name: selectedAddr.fullName,
        email: selectedAddr.email,
        contact: selectedAddr.phone,
      },

      theme: { color: "#F472B6" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function () {
      await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
        {
          razorpay_order_id: data.order.id,
          paymentFailed: true,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.error("Payment Failed. Please try again");
    });

    rzp.open();
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while processing payment");
  }
};
  
  // const handleCheckout = async () => {
  //   if (!paymentMethod) {
  //     return toast.error("Please select payment method");
  //   }

  //   if (paymentMethod === "COD") {
  //     try {

  //       console.log("CHECKOUT ITEMS:", cart.items); 
  //       const { data } = await axios.post(
  //         `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
  //         {
  //           products: cart?.items?.map((item) => ({
  //             productId: item.productId._id,
  //             quantity: item.quantity,
  //             color: item.color || item.selectedColor,
  //             size:item.size
  //           })),
  //           tax,
  //           shipping,
  //           amount: total,
  //           currency: "INR",
  //           paymentMethod: "COD",
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${accessToken}` },
  //         },
  //       );

  //       if (data.success) {
  //         toast.success("Order placed (COD)");
  //         dispatch(setCart({ items: [], totalPrice: 0 }));
  //         navigate("/order-success");
  //       }
  //     } catch (error) {
  //       toast.error("Order failed");
  //     }
  //   } else {
  //     handlePayment(); // existing Razorpay
  //   }
  // };

  const handleCheckout = async () => {
  if (!paymentMethod) {
    return toast.error("Please select payment method");
  }

  if (!selectedAddr) {
    return toast.error("Please select address");
  }

  if (paymentMethod === "COD") {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            color: item.color || item.selectedColor,
            size: item.size,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
          paymentMethod: "COD",

          // ✅ ADD THIS (MAIN FIX)
          shippingAddress: selectedAddr,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (data.success) {
        toast.success("Order placed (COD)");
        dispatch(setCart({ items: [], totalPrice: 0 }));
        navigate("/order-success");
      }
    } catch (error) {
      toast.error("Order failed");
    }
  } else {
    handlePayment();
  }
};
  return (
   <div className="max-w-7xl  bg-gradient-to-b via-gray-100 to-blue-100  mx-auto px-3 sm:px-5 py-6 sm:py-10">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

    {/* LEFT SIDE (ADDRESS) */}
    <div className="space-y-4 p-4 sm:p-6 bg-white rounded-xl shadow">

      {showForm ? (
        <>
          <div>
            <Label>Full Name</Label>
            <Input name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>

          <div>
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            <Input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange} />
            <Input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
          </div>

          <Button className="w-full mt-3 cursor-pointer bg-pink-500 text-white " onClick={handleSave}>
            Save & Continue
          </Button>
        </>
      ) : (
        <div className="space-y-4">

          <h2 className="text-lg font-semibold">Saved Addresses</h2>

          {addresses.map((addr, index) => (
            <div
              key={index}
              onClick={() => dispatch(setSelectedAddress(index))}
              className={`border p-4 rounded-lg cursor-pointer relative transition ${
                selectedAddress === index
                  ? "border-pink-600 bg-pink-50"
                  : "border-gray-300"
              }`}
            >
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-sm">{addr.phone}</p>
              <p className="text-sm">{addr.email}</p>
              <p className="text-sm">
                {addr.address}, {addr.city}, {addr.state}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deleteAddress(index));
                }}
                className="absolute top-2 right-2 text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))}

          <Button variant="outline" className="w-full cursor-pointer" onClick={() => setShowForm(true)}>
            Add New Address
          </Button>

          {/* PAYMENT */}
          <div className="space-y-3">

            <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:shadow">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💵 Cash on Delivery
            </label>

            <label className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:shadow">
              <input
                type="radio"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💳 Online Payment
            </label>

            <Button
              disabled={selectedAddress === null || !paymentMethod}
              className="w-full text-white cursor-pointer bg-pink-600"
              onClick={handleCheckout}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}
    </div>

    {/* RIGHT SIDE (SUMMARY) */}
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-between text-sm sm:text-base">
            <span>Subtotal ({cart.items.length})</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="text-xs sm:text-sm text-gray-500 pt-3">
            <p>* Free shipping over ₹299</p>
            <p>* 30-days return</p>
          </div>

        </CardContent>
      </Card>
    </div>

  </div>
</div>
  );
};

export default AddressForm;
