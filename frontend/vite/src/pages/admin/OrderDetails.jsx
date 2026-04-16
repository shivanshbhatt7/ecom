import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  const accessToken = localStorage.getItem("accessToken");

  // 🔥 FETCH ORDER
  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setOrder(res.data.order);
        setStatus(res.data.order.status);
      } catch (err) {
        console.log(err);
      }
    };

    getOrder();
  }, [id]);

  // ✅ LOG AFTER STATE UPDATE
  useEffect(() => {
    if (order) {
      console.log("ORDER DATA:", order);
    }
  }, [order]);

  // 🔄 UPDATE STATUS
  const updateStatus = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/orders/update-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setOrder((prev) => ({
          ...prev,
          status: status,
        }));

        alert("Status updated successfully");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to update");
    }
  };

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 md:ml-[220px] lg:ml-[300px] px-3 sm:px-6 py-30">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="bg-white px-4 py-2 rounded cursor-pointer hover:shadow-xl shadow text-sm"
        >
          ← Back
        </button>

        <h1 className="text-xl sm:text-2xl font-bold">Order Details</h1>

        {/* 👤 USER INFO */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">User Info</h2>
          <p>
            <strong>Name:</strong> {order.user?.firstName}{" "}
            {order.user?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {order.user?.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.user?.phoneNo}
          </p>
        </div>

        {/* 📍 ADDRESS */}
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>
            <strong>Address:</strong> {order.user?.address || "N/A"}
          </p>
          <p>
            <strong>City:</strong> {order.user?.city || "N/A"}
          </p>
          <p>
            <strong>Pincode:</strong> {order.user?.zipCode || "N/A"}
          </p>
        </div> */}

       <div className="bg-white p-4 rounded shadow">
  <h2 className="font-semibold mb-2">Shipping Address</h2>

  {order.shippingAddress ? (
    <>
      <p>
        <strong>Name:</strong> {order.shippingAddress.fullName}
      </p>

      <p>
        <strong>Phone:</strong> {order.shippingAddress.phone}
      </p>

      <p>
        <strong>Email:</strong> {order.shippingAddress.email}
      </p>

      <p>
        <strong>Address:</strong> {order.shippingAddress.address}
      </p>

      <p>
        <strong>City:</strong> {order.shippingAddress.city}
      </p>

      <p>
        <strong>State:</strong> {order.shippingAddress.state}
      </p>

      <p>
        <strong>Pincode:</strong> {order.shippingAddress.zip}
      </p>

      <p>
        <strong>Country:</strong> {order.shippingAddress.country}
      </p>
    </>
  ) : (
    <p className="text-red-500">No shipping address found</p>
  )}
</div>

        {/* 🛍️ PRODUCTS */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Products</h2>

          {order.products?.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b py-3 last:border-none"
            >
              {/* Image */}
              <img
                src={item.productId?.productImg?.[0]?.url}
                alt=""
                className="w-16 h-16 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1">
                <p className="font-medium">{item.productId?.productName}</p>

                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>

                {/* 🎨 COLOR */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Color:</span>

                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.color || "gray" }}
                  />

                  <span className="text-sm font-semibold capitalize">
                    {item.color || "N/A"}
                  </span>
                </div>
                {/* 📏 SIZE */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm">Size:</span>

                  <span className="text-sm font-semibold">
                    {item.size || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 💳 PAYMENT + STATUS */}
        <div className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between gap-4">
          {/* LEFT */}
          <div>
            <h2 className="font-semibold mb-2">Payment Info</h2>

            <p className="flex items-center gap-2">
              <strong>Status:</strong>

              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Delivered"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </p>

            <p className="mt-1">
              <strong>Total Amount:</strong> ₹{order.amount}
            </p>
          </div>

          {/* RIGHT */}
          <div>
            <h2 className="font-semibold mb-2">Update Status</h2>

            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border px-3 py-2 cursor-pointer rounded text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Failed">Failed</option>
              </select>

              <button
                onClick={updateStatus}
                className="bg-pink-600 hover:bg-pink-700 cursor-pointer text-white px-4 py-2 rounded text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
