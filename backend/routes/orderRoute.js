const express = require("express")
const { isAuthenticated ,isAdmin  } = require("../middleware/isAuthenticated");
const { createOrder, verifyPayment,getMyOrder, getSalesData ,getAllOrdersAdmin, getUserOrders ,getSingleOrder, updateOrderStatus} = require("../controllers/orderController");


const  route = express.Router()

route.post("/create-order",isAuthenticated,createOrder)
route.post("/verify-payment",isAuthenticated,verifyPayment)
route.get("/myorder",isAuthenticated,getMyOrder)
route.get("/all",isAuthenticated,isAdmin,getAllOrdersAdmin)
route.get("/user-order/:userId",isAuthenticated,isAdmin,getUserOrders)
route.get("/sales",isAuthenticated,isAdmin,getSalesData)
route.get("/:id",isAuthenticated,isAdmin, getSingleOrder);
route.put(
  "/update-status/:id",
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);
module.exports = route