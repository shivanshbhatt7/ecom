require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./database/db.js");

const userRoute = require("./routes/userRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const productRoute = require("./routes/productRoute.js");

const cors = require("cors");

// ✅ PORT FIX
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: "https://ecom-new-neon.vercel.app", // ✅ FRONTEND URL
  credentials: true
}));
// https://ecom-back-1y2l.onrender.com
// https://ecom-new-neon.vercel.app
// ✅ MIDDLEWARE
app.use(express.json());
console.log("MONGO_URI:", process.env.MONGO_URI);
// ✅ ROUTES
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/v1/user", userRoute);
console.log("User route working...");
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

// ✅ CONNECT DB + START SERVER
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed ❌", err);
  });
