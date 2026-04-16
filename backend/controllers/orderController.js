const Razorpay = require("razorpay");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const crypto = require("crypto");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
// const createOrder = async (req, res) => {
//   try {
//     const { products, amount, tax, shipping, currency } = req.body;

//     const options = {
//       amount: Math.round(Number(amount) * 100),
//       currency: currency || "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const razorpayOrder = await razorpayInstance.orders.create(options);

//     const newOrder = new orderModel({
//       user: req.user._id,

//       // ✅ FIXED HERE
//       products: products.map((item) => ({
//         productId: item.productId,
//         quantity: item.quantity,
//         color: item.color || "N/A",
//         size: item.size || "N/A",
//       })),

//       amount,
//       tax,
//       shipping,
//       currency,
//       status: "Pending",
//       razorpayOrderId: razorpayOrder.id,
//     });

//     await newOrder.save();
//     console.log("REQ PRODUCTS:", products);

//     res.json({
//       success: true,
//       order: razorpayOrder,
//       dbOrder: newOrder,
//     });
//   } catch (error) {
//     console.error("❌ Error in create Order:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const {
      products,
      amount,
      tax,
      shipping,
      currency,
      paymentMethod,
      shippingAddress, // ✅ NEW
    } = req.body;

    // 🛑 Validation (important)
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    // 💳 Razorpay order (only for ONLINE)
    let razorpayOrder = null;

    if (paymentMethod !== "COD") {
      const options = {
        amount: Math.round(Number(amount) * 100),
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      };

      razorpayOrder = await razorpayInstance.orders.create(options);
    }

    // 🧾 Save order in DB
    const newOrder = new orderModel({
      user: req.user._id,

   products: products.map((item) => ({
  productId: item.productId,
  quantity: item.quantity,
})),

      amount,
      tax,
      shipping,
      currency,
      paymentMethod: paymentMethod || "ONLINE",

      // ✅ MAIN FIX
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
      },

      status: paymentMethod === "COD" ? "Confirmed" : "Pending",

      // ✅ Only for ONLINE
      razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
    });

    await newOrder.save();

    console.log("✅ Order Created:", newOrder);

    res.json({
      success: true,
      order: razorpayOrder, // for Razorpay
      dbOrder: newOrder,    // your DB order
    });

  } catch (error) {
    console.error("❌ Error in create Order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;

    const userId = req.user._id;

    if (paymentFailed) {
      const order = await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true },
      );

      return res.status(400).json({
        success: false,
        message: "Payment failed",
        order,
      });
    }
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");
    if (expectedSignature === razorpay_signature) {
      const order = await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        { new: true },
      );
      await cartModel.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } },
      );
      return res.json({
        success: true,
        message: "Payment Successful",
        order,
      });
    } else {
      await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true },
      );
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }
  } catch (error) {
    console.error("❌ Error in verify Payment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin Only
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; // User will come from URL

    const orders = await orderModel
      .find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      }) // fetch product details
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error Fetching user order : ", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate("products.productId", "productName productPrice productImg");

    res.status(200).json({
      success: true,
      orders, // ✅ IMPORTANT
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

const getSalesData = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await orderModel.countDocuments({
  status: { $in: ["Paid", "Confirmed"] },
});

    // ✅ TOTAL SALES
    const totalSaleAgg = await orderModel.aggregate([
    {   $match: { status: { $in: ["Paid", "Confirmed"] } }},
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalSales = totalSaleAgg.length > 0 ? totalSaleAgg[0].total : 0;

    // ✅ LAST 30 DAYS DATE LIST
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const formatted = d.toISOString().split("T")[0];
      last30Days.push({ date: formatted, amount: 0 });
    }

    // ✅ FETCH SALES FROM DB
  const salesData = await orderModel.aggregate([
  {
    $match: {
      status: { $in: ["Paid", "Confirmed"] },
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt",
        },
      },
      amount: { $sum: "$amount" },
    },
  },
]);

    // ✅ MERGE DATA (IMPORTANT)
    const salesMap = {};
    salesData.forEach((item) => {
      salesMap[item._id] = item.amount;
    });

    const finalSales = last30Days.map((day) => ({
      date: day.date,
      amount: salesMap[day.date] || 0,
    }));

    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: finalSales,
    });

  } catch (error) {
    console.error("❌ SALES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel
      .findById(id)
      .populate("user")
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ check status exists
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // ✅ find order
    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ update status
    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { createOrder, verifyPayment, getSalesData, getMyOrder, getUserOrders, getAllOrdersAdmin,getSalesData ,getSingleOrder ,updateOrderStatus};
