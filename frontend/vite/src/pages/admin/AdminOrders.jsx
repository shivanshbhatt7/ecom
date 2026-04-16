// import axios from 'axios'
// import React, { useEffect, useState } from 'react'

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const accessToken = localStorage.getItem("accessToken")
//   console.log('orders', orders);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const { data } = await axios.get(l", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         })
//         if (data.success) setOrders(data.orders)
//       } catch (error) {
//         console.log("Failed to fetch Admin", error);

//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchOrders();

//   }, [accessToken])

//   if (loading) {
//     return <div className='text-center py-20 text-gray-500 '>
//       Loading All Orders....
//     </div>
//   }

//   return (
//     // <div className="pl-[350px] py-20 pr-20 mx-auto px-4">
//     //   <h1 className="text-3xl font-bold mb-6">Admin - All Orders</h1>

//     //   {orders.length === 0 ? (
//     //     <p className="text-gray-500">No orders found.</p>
//     //   ) : (
//     //     <div className="overflow-x-auto">
//     //       <table className="w-full border border-gray-200 text-left text-sm">
//     //         <thead className="bg-gray-100">
//     //           <tr>
//     //             <th className="px-4 py-2 border">Order ID</th>
//     //             <th className="px-4 py-2 border">User</th>
//     //             <th className="px-4 py-2 border">Products</th>
//     //             <th className="px-4 py-2 border">Amount</th>
//     //             <th className="px-4 py-2 border">Status</th>
//     //             <th className="px-4 py-2 border">Date</th>
//     //           </tr>
//     //         </thead>
//     //         <tbody>
//     //           {orders.map((order) => (
//     //             <tr key={order._id} className="hover:bg-gray-50">
//     //               <td className="px-4 py-2 border">{order._id}</td>
//     //               <td className="px-4 py-2 border">
//     //                 {order.user?.name} <br />
//     //                 <span className="text-xs text-gray-500">{order.user?.email}</span>
//     //               </td>
//     //               <td className="px-4 py-2 border">
//     //                 {order.products.map((p, idx) => (
//     //                   <div key={idx} className="text-sm">
//     //                     {p.productName} × {p.quantity}
//     //                   </div>
//     //                 ))}
//     //               </td>
//     //               <td className="px-4 py-2 border font-semibold">
//     //                 ₹{order.amount.toLocaleString("en-IN")}
//     //               </td>
//     //               <td className="px-4 py-2 border">
//     //                 <span
//     //                   className={`px-2 py-1 rounded text-xs font-medium ${order.status === "Paid"
//     //                     ? "bg-green-100 text-green-700"
//     //                     : order.status === "Pending"
//     //                       ? "bg-yellow-100 text-yellow-700"
//     //                       : "bg-red-100 text-red-700"
//     //                     }`}
//     //                 >
//     //                   {order.status}
//     //                 </span>
//     //               </td>
//     //               <td className="px-4 py-2 border">
//     //                 {new Date(order.createdAt).toLocaleDateString()}
//     //               </td>
//     //             </tr>
//     //           ))}
//     //         </tbody>
//     //       </table>
//     //     </div>
//     //   )}
//     // </div>
//     <div className="
//   min-h-screen 
//   bg-gray-100 
//   px-3 sm:px-6 lg:px-8 
//   py-20 md:py-20 
//   md:ml-[220px] lg:ml-[300px]
// ">
//   <div className="max-w-6xl mx-auto">
//     <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 mt-7 sm:mb-6">
//       Admin - All Orders
//     </h1>

//     {orders.length === 0 ? (
//       <p className="text-gray-500 text-sm sm:text-base">
//         No orders found.
//       </p>
//     ) : (
//       <>
//         {/* 📱 MOBILE VIEW (Cards) */}
//         <div className="flex flex-col gap-4  sm:hidden">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white p-4 rounded-xl shadow border"
//             >
//               <p className="text-xs break-all text-gray-500">
//                 {order._id}
//               </p>

//               <p className="font-medium mt-1">
//                 {order.user?.name}
//               </p>

//               <p className="text-xs text-gray-500">
//                 {order.user?.email}
//               </p>

//               <div className="mt-2 text-sm">
//                 {order.products.map((p, idx) => (
//                   <div key={idx}>
//                     {p.productName} × {p.quantity}
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-2 flex justify-between items-center">
//                 <span className="font-semibold text-sm">
//                   ₹{order.amount.toLocaleString("en-IN")}
//                 </span>

//                 <span
//                   className={`px-2 py-1 rounded text-xs font-medium ${
//                     order.status === "Paid"
//                       ? "bg-green-100 text-green-700"
//                       : order.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {order.status}
//                 </span>
//               </div>

//               <p className="text-xs text-gray-400 mt-2">
//                 {new Date(order.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* 📲💻 TABLE VIEW */}
//         <div className="hidden sm:block overflow-x-auto">
//           <table className="w-full border border-gray-200 text-left text-xs sm:text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-3 sm:px-4 py-2 border">Order ID</th>
//                 <th className="px-3 sm:px-4 py-2 border">User</th>
//                 <th className="px-3 sm:px-4 py-2 border">Products</th>
//                 <th className="px-3 sm:px-4 py-2 border">Amount</th>
//                 <th className="px-3 sm:px-4 py-2 border">Status</th>
//                 <th className="px-3 sm:px-4 py-2 border">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50">
//                   <td className="px-3 sm:px-4 py-2 border break-all">
//                     {order._id}
//                   </td>

//                   <td className="px-3 sm:px-4 py-2 border">
//                     {order.user?.name}
//                     <br />
//                     <span className="text-xs text-gray-500">
//                       {order.user?.email}
//                     </span>
//                   </td>

//                   <td className="px-3 sm:px-4 py-2 border">
//                     {order.products.map((p, idx) => (
//                       <div key={idx}>
//                         {p.productName} × {p.quantity}
//                       </div>
//                     ))}
//                   </td>

//                   <td className="px-3 sm:px-4 py-2 border font-semibold">
//                     ₹{order.amount.toLocaleString("en-IN")}
//                   </td>

//                   <td className="px-3 sm:px-4 py-2 border">
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-medium ${
//                         order.status === "Paid"
//                           ? "bg-green-100 text-green-700"
//                           : order.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>

//                   <td className="px-3 sm:px-4 py-2 border">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </>
//     )}
//   </div>
// </div>
// )}
// export default AdminOrders;

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'   // ✅ added

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const accessToken = localStorage.getItem("accessToken")
  const navigate = useNavigate()   // ✅ added

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        if (data.success) setOrders(data.orders)
      } catch (error) {
        console.log("Failed to fetch Admin", error);
      } finally {
        setLoading(false)
      }
    }
    fetchOrders();
  }, [accessToken])

  if (loading) {
    return <div className='text-center py-20 text-gray-500 '>
      Loading All Orders....
    </div>
  }

  return (
    <div className="
      min-h-screen 
      bg-gray-100 
      px-3 sm:px-6 lg:px-8 
      py-20 md:py-20 
      md:ml-[220px] lg:ml-[300px]
    ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 mt-7 sm:mb-6">
          Admin - All Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">
            No orders found.
          </p>
        ) : (
          <>
            {/* 📱 MOBILE VIEW */}
            <div className="flex flex-col gap-4 sm:hidden">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-xl shadow border">

                  {/* ✅ CLICKABLE ORDER ID */}
                  <p
                    onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                    className="text-xs break-all text-blue-600 cursor-pointer hover:underline font-medium"
                  >
                    {order._id}
                  </p>

                  <p className="font-medium mt-1">
                    {order.user?.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {order.user?.email}
                  </p>

                  <div className="mt-2 text-sm">
                    {order.products.map((p, idx) => (
                      <div key={idx}>
                        {p.productName} × {p.quantity}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-semibold text-sm">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </span>

                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* 📲💻 TABLE VIEW */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border border-gray-200 text-left text-xs sm:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 border">Order ID</th>
                    <th className="px-3 sm:px-4 py-2 border">User</th>
                    <th className="px-3 sm:px-4 py-2 border">Products</th>
                    <th className="px-3 sm:px-4 py-2 border">Amount</th>
                    <th className="px-3 sm:px-4 py-2 border">Status</th>
                    <th className="px-3 sm:px-4 py-2 border">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">

                      {/* ✅ CLICKABLE ORDER ID */}
                      <td className="px-3 sm:px-4 py-2 border break-all">
                        <span
                          onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                          className="text-blue-600 cursor-pointer hover:underline font-medium"
                        >
                          {order._id}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-2 border">
                        {order.user?.name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {order.user?.email}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-2 border">
                        {order.products.map((p, idx) => (
                          <div key={idx}>
                            {p.productName} × {p.quantity}
                          </div>
                        ))}
                      </td>

                      <td className="px-3 sm:px-4 py-2 border font-semibold">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-3 sm:px-4 py-2 border">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-2 border">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminOrders