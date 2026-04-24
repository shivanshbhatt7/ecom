import LogoLoop from '@/components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import { FaMobileAlt,FaLaptop,FaFan  } from "react-icons/fa";
import { PiTelevision } from "react-icons/pi";
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { IoMdWatch } from "react-icons/io";
import { CiHeadphones } from "react-icons/ci";
import { FaKitchenSet } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Features from "@/components/Features";

const techLogos = [
  { node: <FaMobileAlt />, title: "mobile", path: "/products/category/mobile" },
  { node: <PiTelevision />, title: "tv", path: "/products/category/tv" },
  { node: <FaLaptop />, title: "laptop", path: "/products/category/laptop" },
  { node: <FaFan />, title: "fan", path: "/products/category/fan" },
  { node: <IoMdWatch />, title: "watch", path: "/products/category/watch" },
  { node: <FaKitchenSet />, title: "kitchen", path: "/products/category/kitchen" },
  { node: <CiHeadphones />, title: "headphones", path: "/products/category/headphones" },
  { node: <CgSmartHomeRefrigerator />, title: "refrigerator", path: "/products/category/refrigerator" },
];

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const slides = ["/1.webp", "/2.webp", "/3.webp", "/4.webp"];
  const [current, setCurrent] = useState(0);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`,
          console.log(import.meta.env.VITE_URL)
        );
        setProducts(res.data.products || []);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  // ✅ AUTO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // ✅ SCROLL ANIMATION
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const elements = document.querySelectorAll(".fade-up");

    elements.forEach((el) => el.classList.add("init"));
    console.log("API URL:", import.meta.env.VITE_URL);

    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY;

        entries.forEach((entry) => {
          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.remove("init");

            if (currentScrollY > lastScrollY) {
              el.classList.remove("show-down");
              el.classList.add("show-up");
            } else {
              el.classList.remove("show-up");
              el.classList.add("show-down");
            }
          } else {
            el.classList.remove("show-up", "show-down");
            el.classList.add("init");
          }
        });

        lastScrollY = currentScrollY;
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-gradient-to-b via-gray-200 to-gray-900 p-3 min-h-screen pt-[110px]">
      
      {/* 🔥 SLIDER */}
      <div className="fade-up relative w-full max-w-7xl h-[220px] sm:h-[320px] md:h-[400px] lg:h-[500px] mx-auto mb-3 rounded-xl overflow-hidden">
        
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt="banner"
              onClick={() => navigate("/products")}
              className="w-full h-full object-cover flex-shrink-0 min-w-full cursor-pointer"
            />
          ))}
        </div>
          
        {/* ARROWS */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className='bg-[radial-gradient(circle,_rgba(0,0,0,1)_0%,_rgba(157,158,157,1)_50%]'style={{ height: '200px', position: 'relative', paddingTop: '50px', overflow: 'hidden' }}>
      
   <LogoLoop
  logos={techLogos.map((item) => ({
    ...item,
    onClick: () => navigate(item.path),   // ✅ ADD THIS
  }))}
  speed={80}
  direction="left"
  logoHeight={90}
  gap={60}
  hoverSpeed={0}
  scaleOnHover
  fadeOut
  fadeOutColor="#000000"
/>

    </div>

      {/* 🛍️ PRODUCTS */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        
        <div className="fade-up flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-2xl font-bold">
            Featured Products
          </h2>

          <button
            onClick={() => navigate("/products")}
            className="font-medium text-sm hover:underline"
          >
            View All →
          </button>
        </div>

        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <div className="fade-up grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
            {products.slice(0, 20).map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className="fade-up bg-white rounded-xl p-3   shadow hover:shadow-lg transition flex flex-col items-center cursor-pointer group"
              >
                <div className="overflow-hidden  rounded-lg">
                  <img
                    src={product.productImg?.[0]?.url}
                    className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition"
                    alt={product.productName}
                  />
                </div>

                <h3 className="text-xs sm:text-sm font-medium mt-2 line-clamp-2">
                  {product.productName}
                </h3>

                <p className="font-bold text-sm sm:text-base">
                  ₹{product.productPrice}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* FEATURES */}
        <div className="fade-up">
          <Features />
        </div>

        {/* 🔥 GALLERY */}
        <div className="mt-12" onClick={() => navigate("/products")}>
          <h2 className="fade-up text-lg sm:text-2xl font-bold mb-6 "   >
            Explore More
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5 ">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className="fade-up overflow-hidden rounded-xl shadow hover:shadow-lg transition group"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <img
                  src={`/gallery${index + 1}.jpg`}
                  alt="gallery"
                  className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;