import BreadCrums from "../components/ui/BreadCrums";
import ProductDesc from "@/components/ui/ProductDesc";
import ProductImg from "@/components/ui/ProductImg";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params.id;

  const { products } = useSelector((store) => store.product);

  // ✅ FIX: state for product
  const [product, setProduct] = useState(null);

  // ✅ FIX: update product when ID changes
  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    setProduct(foundProduct);

    // 🔥 scroll to top on product change (pro UX)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId, products]);

  // 🔥 RELATED PRODUCTS
  const relatedProducts = products.filter(
    (item) =>
      item.brand === product?.brand && item._id !== product?._id
  );

  // ✅ Loading fallback (better UX than null)
  if (!product) {
    return (
      <div className="pt-24 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="pt-24 pb-10 px-3 sm:px-5">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <BreadCrums product={product} />

        {/* MAIN PRODUCT */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
          
          {/* ✅ KEY FIX: force image refresh */}
          <ProductImg key={productId} images={product.productImg} />

          <ProductDesc product={product} />
        </div>

        {/* 🔥 RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            
            <h2 className="text-lg sm:text-2xl font-bold mb-5">
              Related Products ({product.brand})
            </h2>

            <div className="
              grid 
              grid-cols-2 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-6 
              gap-4
            ">
              {relatedProducts.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition cursor-pointer group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={item.productImg?.[0]?.url}
                      alt={item.productName}
                      className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <h3 className="text-xs sm:text-sm font-medium mt-2 line-clamp-2">
                    {item.productName}
                  </h3>

                  <p className="text-brown-600 font-bold text-sm">
                    ₹{item.productPrice}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SingleProduct;