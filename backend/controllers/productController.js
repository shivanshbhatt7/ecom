const productModel = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");
const getDataUri = require("../utils/dataUri");

// const addProduct = async (req, res) => {
//   try {
//     const { productName, productPrice, productDesc, category, brand ,colors} =
//       req.body;
//     const userId = req.id;

//     if (!productName || !productDesc || !productPrice || !category || !brand) {
//       return res.status(400).json({
//         success: false,
//         message: "All Fields Are Required",
//       });
//     }

//     // Handling multiple Images Uploads
//     let productImg = [];
//     if (req.files && req.files.length > 0) {
//       for (let file of req.files) {
//         const fileUri = getDataUri(file);
//         const result = await cloudinary.uploader.upload(fileUri, {
//           folder: "mern_products", // cloudinary folder name
//         });
//         productImg.push({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     }
    

//     // Create A Product in DB
//     const newProduct = await productModel.create({
//       userId,
//       productName,
//       productPrice,
//       productDesc,
//       category,
//       brand,
//       productImg,
//       colors: colors ? JSON.parse(colors) : []// array of objects [{url,public_id},{url,public_id}...]
//     });
//     return res.status(200).json({
//       success: true,
//       message: "Product Addedd Successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const addProduct = async (req, res) => {
  try {
    let {
      productName,
      productPrice,
      productDesc,
      category,
      brand,
    } = req.body;

    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }

    // 📸 Upload Images
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // 🛒 Create Product (NO COLORS)
    const newProduct = await productModel.create({
      userId,
      productName,
      productPrice,
      productDesc,
      category,
      brand,
      productImg,
    });

    return res.status(200).json({
      success: true,
      message: "Product Added Successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find();
   
    if (!products) {
      return res.status(404).json({
        success: false,
        products: [],
        message: "No Products Available",
      });
    }
    return res.status(200).json({
      
      success: true,
      message: "Successfully Get All Products",
      products,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    console.log("Deleting ID:", productId);

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // delete images
    if (deletedProduct.productImg?.length > 0) {
      for (let img of deletedProduct.productImg) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Products

// const updateProduct = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const {
//       productName,
//       productPrice,
//       productDesc,
//       category,
//       brand,
//       existingImages,
//     } = req.body;

//     const product = await productModel.findById(productId);
//     if (!product) {
//       return res.status(400).json({
//         success: false,
//         message: "Product Not Found",
//       });
//     }

//     let updatedImages = [];

//     // keep selected Old Images
//     if (existingImages) {
//       const keepIds = JSON.parse(existingImages);
//       updatedImages = product.productImg.filter((img) =>
//         keepIds.includes(img.public_id),
//       );

//       // Delete Only removed Images
//       const removedImages = product.productImg.filter(
//         (img) => !keepIds.includes(img.public_id),
//       );
//       for (const img of removedImages) {
//         await cloudinary.uploader.destroy(img.public_id);
//       }
//     } else {
//       updatedImages = product.productImg; // keep all if nothing sent
//     }

//     // Upload New images if any
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const fileUri = getDataUri(file);
//         const result = await cloudinary.uploader.upload(fileUri, {
//           folder: "mern_products",
//         });
//         updatedImages.push({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     }

//     // Update Products
//     product.productName = productName || product.productName
//     product.productDesc = productDesc || product.productDesc
//     product.productPrice = productPrice || product.productPrice
//     product.category = category || product.category 
//     product.brand = brand || product.brand
//     product.productImg = updatedImages

//     await product.save()

//     return res.status(200).json({
//         success : true,
//         message : "Product Updated Successfully",
//         product
//     })
//   } catch (error) {
//     res.status(500).json({
//         success:false,
//         message:error.message
//     })
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    let {
      productName,
      productPrice,
      productDesc,
      category,
      brand,
      existingImages,
    } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product Not Found",
      });
    }

    let updatedImages = [];

    // ✅ Keep selected old images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);

      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id)
      );

      // ❌ delete removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id)
      );

      for (const img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg;
    }

    // 📸 Upload new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products",
        });

        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // ✅ UPDATE FIELDS
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { addProduct, getAllProduct, deleteProduct ,updateProduct };
