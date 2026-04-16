import OrderCard from "@/components/OrderCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ShowUserOrders = () => {
  const params = useParams();
  const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (res.data.success) {
      setUserOrder(res.data.orders);
    }
  };
  console.log(userOrder);

  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    // <div className='pl-[350px] py-20'>
    //   <OrderCard userOrder={userOrder}/>
    // </div>
    <div
      className="
  min-h-screen 
  bg-gray-100 
  px-3 sm:px-6 lg:px-8 
  py-20 md:py-20 
  md:ml-[220px] lg:ml-[300px]
"
    >
      <div className="max-w-6xl mx-auto">
        <OrderCard userOrder={userOrder} />
      </div>
    </div>
  );
};

export default ShowUserOrders;
