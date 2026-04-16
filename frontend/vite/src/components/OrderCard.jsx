import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();
  return (

    <div className="px-3 sm:px-6 rounded-xl lg:px-10 py-4 flex flex-col gap-3">
      <div className=" w-full max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex  items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
        </div>

        {/* EMPTY STATE */}
        {userOrder?.length === 0 ? (
          <p className="text-gray-800 text-lg sm:text-2xl text-center">
            No Orders found for this user
          </p>
        ) : (
          <div className=" space-y-4 sm:space-y-6 w-full">
            {userOrder?.map((order) => (
              <div
                key={order._id}
                className="shadow-lg bg-gray-200 rounded-2xl p-4 sm:p-5 border border-gray-200"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-col rounded-xl sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <h2 className="text-sm sm:text-lg font-semibold break-all">
                    Order ID: <span className="text-gray-600">{order._id}</span>
                  </h2>

                  <p className="text-sm sm:text-base text-gray-500">
                    Amount:{" "}
                    <span className="font-bold">
                      {order.currency} {order.amount.toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* USER INFO */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="mb-2 sm:mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User:</span>{" "}
                      {order.user?.firstName || "Unknown"}{" "}
                      {order.user?.lastName}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 break-all">
                      Email: {order.user?.email || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`w-fit text-xs sm:text-sm ${
                      order.status === "Paid"
                        ? "bg-green-500"
                        : order.status === "Failed"
                          ? "bg-red-500"
                          : "bg-orange-300"
                    } text-white px-3 py-1 rounded-lg`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* PRODUCTS */}
                <div>
                  <h3 className="font-medium mb-2 text-sm sm:text-base">
                    Products:
                  </h3>

                  <ul className="space-y-2">
                    {order.products.map((product, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 p-3 rounded-lg"
                      >
                        {/* PRODUCT LEFT */}
                        <div className="flex items-center gap-3">
                          <img
                            onClick={() =>
                              navigate(`/products/${product?.productId?._id}`)
                            }
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover cursor-pointer rounded"
                            src={product?.productId?.productImg?.[0]?.url}
                            alt=""
                          />

                          <span className="text-sm sm:text-base max-w-[200px] sm:max-w-[300px] line-clamp-2">
                            {product?.productId?.productName}
                          </span>
                        </div>

                        {/* PRODUCT RIGHT */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-xs sm:text-sm">
                          <span className="break-all">
                            {product?.productId?._id}
                          </span>

                          <span className="font-medium">
                            ₹{product?.productId?.productPrice} ×{" "}
                            {product?.quantity}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
