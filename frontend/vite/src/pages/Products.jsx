// import React, { useState, useEffect } from "react";
// import FilterSidebar from "@/components/ui/FilterSidebar";
// import axios from "axios";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import ProductCard from "@/components/ui/ProductCard";
// import { useDispatch, useSelector } from "react-redux";
// import { setProducts } from "@/redux/productSlice";
// import { Search } from "lucide-react";

// const Products = () => {
//   const { products } = useSelector((store) => store.product);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [priceRange, setPriceRange] = useState([0, 999999]);
//   const dispatch = useDispatch();
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [brand, setBrand] = useState("All");
//   const [sortOrder, setSortOrder] = useState("");

//   // ✅ FETCH PRODUCTS
//   const getAllProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`
//       );

//       if (res.data.success) {
//         setAllProducts(res.data.products);
//         dispatch(setProducts(res.data.products));
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔍 FILTER LOGIC
//   useEffect(() => {
//     if (allProducts.length === 0) return;

//     let filtered = [...allProducts];

//     if (search.trim() !== "") {
//       filtered = filtered.filter((p) =>
//         p.productName?.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (category !== "All") {
//       filtered = filtered.filter((p) => p.category === category);
//     }

//     if (brand !== "All") {
//       filtered = filtered.filter((p) => p.brand === brand);
//     }

//     filtered = filtered.filter(
//       (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
//     );

//     if (sortOrder === "lowToHigh") {
//       filtered.sort((a, b) => a.productPrice - b.productPrice);
//     } else if (sortOrder === "highToLow") {
//       filtered.sort((a, b) => b.productPrice - a.productPrice);
//     }

//     dispatch(setProducts(filtered));
//   }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   // 🔥 SCROLL ANIMATION (FINAL FIX)
//   useEffect(() => {
//     let lastScrollY = window.scrollY;

//     const elements = document.querySelectorAll(".fade-up");

//     elements.forEach((el) => el.classList.add("init"));

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const currentScrollY = window.scrollY;

//         entries.forEach((entry) => {
//           const el = entry.target;

//           if (entry.isIntersecting) {
//             el.classList.remove("init");

//             if (currentScrollY > lastScrollY) {
//               el.classList.remove("show-down");
//               el.classList.add("show-up");
//             } else {
//               el.classList.remove("show-up");
//               el.classList.add("show-down");
//             }
//           } else {
//             // reset for repeat animation
//             el.classList.remove("show-up", "show-down");
//             el.classList.add("init");
//           }
//         });

//         lastScrollY = currentScrollY;
//       },
//       {
//         threshold: 0.15,
//       }
//     );

//     elements.forEach((el) => observer.observe(el));

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="pt-20 pb-10 bg-gradient-to-b via-gray-100 to-yellow-100">

//       {/* 🔎 SEARCH */}
//       <div className="fade-up relative w-2/3 ml-20 mt-10 sm:max-w-md bg-white rounded-lg">
//         <Input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search Product..."
//         />
//         <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
//       </div>

//       <div className="max-w-7xl mx-auto flex gap-7">

//         {/* SIDEBAR */}
//         <div className="fade-up">
//           <FilterSidebar
//             allProducts={allProducts}
//             priceRange={priceRange}
//             setPriceRange={setPriceRange}
//             search={search}
//             setSearch={setSearch}
//             category={category}
//             setCategory={setCategory}
//             brand={brand}
//             setBrand={setBrand}
//           />
//         </div>

//         {/* MAIN SECTION */}
//         <div className="flex flex-col p-1 flex-1">

//           {/* SORT */}
//           <div className="fade-up flex justify-end mt-7 mb-4">
//             <Select onValueChange={(value) => setSortOrder(value)}>
//               <SelectTrigger className="w-[170px] sm:w-[220px] bg-white/80 backdrop-blur-lg border border-pink-300 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-pink-400">
//                 <SelectValue placeholder="💰 Sort by price" />
//               </SelectTrigger>

//               <SelectContent className="rounded-xl shadow-xl border border-pink-200">
//                 <SelectGroup>
//                   <SelectItem value="lowToHigh">
//                     🔽 Price: Low → High
//                   </SelectItem>

//                   <SelectItem value="highToLow">
//                     🔼 Price: High → Low
//                   </SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* PRODUCTS GRID */}
//           <div className="fade-up grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
//             {products.map((product, index) => (
//               <div
//                 key={product._id}
//                 className="fade-up"
//                 style={{ transitionDelay: `${index * 60}ms` }}
//               >
//                 <ProductCard product={product} loading={loading} />
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;

import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/ui/FilterSidebar";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ui/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";

const Products = () => {
  const { products } = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const { category: urlCategory } = useParams();

  // ✅ NEW: mobile filter toggle
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // ✅ FETCH PRODUCTS
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/product/getallproducts`,
      );

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  if (urlCategory) {
    setCategory(urlCategory);
  }
}, [urlCategory]);

  // 🔍 FILTER LOGIC
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

   if (category !== "All") {
  filtered = filtered.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
}

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="pt-20 pb-10 bg-gradient-to-b via-gray-100 to-blue-100">
      {/* 🔎 SEARCH */}
      <div className="fade-up relative w-2/3 ml-5 sm:ml-20 mt-10 sm:max-w-md bg-white rounded-lg">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Product..."
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      {/* 📱 MOBILE FILTER + SORT */}
      <div className="sm:hidden flex justify-between items-center px-4 mt-4">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow"
        >
          🔍 Filters
        </button>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-[150px] bg-white border rounded-lg">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="lowToHigh">Low → High</SelectItem>
            <SelectItem value="highToLow">High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-7xl mx-auto flex gap-7">
        {/* 💻 DESKTOP SIDEBAR */}
        <div className="hidden sm:block fade-up">
          <FilterSidebar
            allProducts={allProducts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
          />
        </div>

        {/* MAIN */}
        <div className="flex flex-col p-1 flex-1">
          {/* 💻 DESKTOP SORT */}
          <div className="hidden sm:flex fade-up justify-end mt-7 mb-4">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[170px] sm:w-[220px] bg-white/80 border border-pink-300 rounded-xl shadow-md">
                <SelectValue placeholder="💰 Sort by price" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="lowToHigh">Low → High</SelectItem>
                  <SelectItem value="highToLow">High → Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* PRODUCTS */}
          <div className="fade-up grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {products.map((product, index) => (
              <div key={product._id}>
                <ProductCard product={product} loading={loading} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📱 MOBILE FILTER DRAWER */}
     {showMobileFilter && (
  <div className="fixed inset-0 z-50 bg-black/40">
    
    <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white p-5 shadow-xl overflow-y-auto">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button onClick={() => setShowMobileFilter(false)}>✕</button>
      </div>

      <div className="h-full overflow-y-auto">
        <FilterSidebar
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
        />
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default Products;
