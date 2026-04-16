const express = require("express");
const { addProduct, getAllProduct, deleteProduct, updateProduct } = require("../controllers/productController");
const { isAuthenticated , isAdmin } = require("../middleware/isAuthenticated");
const { multipleUpload } = require("../middleware/multer");



const route = express.Router()

route.post("/add", isAuthenticated ,isAdmin,multipleUpload ,addProduct)
route.get("/getallproducts",getAllProduct)
route.delete("/delete/:productId",isAuthenticated,isAdmin,deleteProduct)
route.put("/update/:productId",isAuthenticated,isAdmin,multipleUpload,updateProduct)

module.exports = route  