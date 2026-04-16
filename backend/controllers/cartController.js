const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

// ✅ GET CART (FIXED)
const getCart = async (req, res) => {
  try {
    const userId = req.id;

    let cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      return res.json({ success: true, cart: { items: [], totalPrice: 0 } });
    }
    cart.items = cart.items.filter((item) => item.productId !== null);
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// const addToCart = async (req, res) => {
  
//   try {
//     const userId = req.id;
//     const { productId, selectedColor } = req.body;
//     console.log("COLOR RECEIVED:", selectedColor);

//     // ❗ prevent empty color
//     if (!selectedColor || !selectedSize) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select a color",
//       });
//     }

//     const product = await productModel.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     let cart = await cartModel.findOne({ userId });

//     if (!cart) {
//       cart = new cartModel({
//         userId,
//         items: [
//           {
//             productId,
//             quantity: 1,
//             price: product.productPrice,
//             color: selectedColor, // ✅ always save selected color
//           },
//         ],
//         totalPrice: product.productPrice,
//       });
//     } else {

//       // ✅ FIX: check BOTH productId + color
//       const itemIndex = cart.items.findIndex(
//         (item) =>
//           item.productId.toString() === productId &&
//           item.color === selectedColor
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += 1;
//       } else {
//         cart.items.push({
//           productId,
//           quantity: 1,
//           price: product.productPrice,
//           color: selectedColor, // ✅ correct
//         });
//       }

//       cart.totalPrice = cart.items.reduce(
//         (acc, item) => acc + item.price * item.quantity,
//         0
//       );
//     }

//     await cart.save();

//     cart = await cart.populate("items.productId");

//     res.status(200).json({
//       success: true,
//       message: "Product added to cart successfully",
//       cart,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const addToCart = async (req, res) => {
  try {
    const userId = req.id;

    // ✅ ONLY productId now
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // 🆕 NEW CART
      cart = new cartModel({
        userId,
        items: [
          {
            productId,
            quantity: 1,
            price: product.productPrice,
          },
        ],
        totalPrice: product.productPrice,
      });
    } else {
      // ✅ CHECK ONLY productId
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      // 💰 UPDATE TOTAL
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    cart = await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ UPDATE QUANTITY (SAFE)
const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const item = cart.items[itemIndex];

    if (type === "increase") item.quantity += 1;

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    cart = await cart.populate("items.productId");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ REMOVE FROM CART (FIXED + CLEAN)
const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    // 🔥 REMOVE ITEM
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // 🔥 CLEAN NULL PRODUCTS ALSO
    cart.items = cart.items.filter((item) => item.productId !== null);

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    cart = await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
};