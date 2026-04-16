import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(null);

  // ✅ FIX: update main image when product/images change
  useEffect(() => {
    if (images && images.length > 0) {
      setMainImg(images[0].url);
    }
  }, [images]);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">

      {/* Thumbnails */}
      <div className="
        flex md:flex-col 
        gap-2 
        overflow-x-auto md:overflow-hidden
      ">
        {images?.map((img) => (
          <img
            key={img.url}
            onClick={() => setMainImg(img.url)}
            src={img.url}
            alt="product"
            className={`
              cursor-pointer 
              w-14 h-14 sm:w-16 sm:h-16 
              object-cover 
              border 
              rounded-md
              ${mainImg === img.url ? "border-black" : "border-gray-300"}
            `}
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 flex justify-center">
        <Zoom>
          <img
            src={mainImg}
            alt="product"
            className="
              w-full 
              max-w-xs 
              sm:max-w-sm 
              md:max-w-md 
              lg:max-w-lg 
              object-contain 
              border 
              rounded-lg
            "
          />
        </Zoom>
      </div>
    </div>
  );
};

export default ProductImg;