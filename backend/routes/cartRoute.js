const express = require("express");
const { isAuthenticated , isAdmin } = require("../middleware/isAuthenticated");

const { getCart, addToCart, updateQuantity, removeFromCart } = require("../controllers/cartController");



const route = express.Router()

route.get("/", isAuthenticated,getCart)
route.post("/add",isAuthenticated,addToCart)
route.put("/update",isAuthenticated,updateQuantity)
route.delete("/remove",isAuthenticated,removeFromCart)

module.exports = route  