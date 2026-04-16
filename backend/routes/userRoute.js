const express = require("express");

const {
  register,
  verifyUser,
  reVerifyUser,
  login,
  logout,
  forgetPassword,
  verifyOTP,
  changePassword,
  allUsers,
  getUserById,
  updateUser,
} = require("../controllers/userController");

const { isAdmin, isAuthenticated } = require("../middleware/isAuthenticated");
const { singleUpload } = require("../middleware/multer");

const route = express.Router();

route.post("/register", register);
route.post("/verify", verifyUser);
route.post("/reverify", reVerifyUser);
route.post("/login", login);
route.post("/logout", isAuthenticated, logout);

route.post("/forget-password", forgetPassword); // ❗ removed isAuthenticated

route.post("/verify-otp/:email", verifyOTP);
route.post("/change-password/:email", changePassword);

route.get("/all-users", isAuthenticated, isAdmin, allUsers);
route.get("/get-user/:userId", getUserById);

route.put("/update/:userId", isAuthenticated,  singleUpload, updateUser);
/*route.put("/update", isAuthenticated, singleUpload, updateUser); */

// user updates own profile
route.put("/update/me", isAuthenticated, singleUpload, updateUser);



module.exports = route;