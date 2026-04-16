import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit, Trash2, Search } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { setProducts } from "@/redux/productSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const [editProduct, setEditProduct] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
    colors: [],
    _id: "",
  });

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Open dialog
  const openEditDialog = (product) => {
    setEditProduct(product);
    setOpen(true);
  };

  // 🔹 Save update
 const handleSave = async () => {
    const formData = new FormData();

  //   Object.entries(editProduct).forEach(([key, value]) => {
  //     if (key !== "productImg" && key !== "_id") {
  //       formData.append(key, value);
  //     }
  //   });
Object.entries(editProduct).forEach(([key, value]) => {
  if (key !== "productImg" && key !== "_id") {
    if (key === "colors") {
      formData.append("colors", JSON.stringify(value)); // ✅ FIX
    } else {
      formData.append(key, value);
    }
  }
});

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File))
      .map((img) => img.public_id);

    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => formData.append("files", file));

    try {
      const res = await axios.put(
         `${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (res.data.success) {
        toast.success("Product updated");

        const updatedProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p,
        );

        dispatch(setProducts(updatedProducts));
        setOpen(false);
      }
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    }
  };

  // 🔹 Delete
  const deleteProductHandler = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/api/v1/product/delete/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        toast.success("Deleted");

        dispatch(setProducts(products.filter((p) => p._id !== id)));
      }
    } catch {
      toast.error("Delete failed");
    }
  };
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-gray-100 
        px-3 sm:px-6 lg:px-8 
        py-20 md:py-29
        md:ml-[220px] lg:ml-[300px]"
    >
      <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
        {/* 🔎 Search */}
        <div className="relative w-full sm:max-w-md bg-white rounded-lg">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
            placeholder="Search Product..."
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* 🧾 Product List */}
        {filteredProducts.map((product) => (
          <Card
            key={product._id}
            className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-sm"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={product.productImg?.[0]?.url}
                className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded"
                alt=""
              />

              <div>
                <h2 className="font-bold text-sm sm:text-lg line-clamp-2">
                  {product.productName}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  ₹{product.productPrice}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex gap-4 sm:gap-5 justify-end sm:justify-center">
              {/* ✏️ Edit */}
              <button onClick={() => openEditDialog(product)}>
                <Edit className="cursor-pointer hover:text-black text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* 🗑️ Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 className="hover:text-black text-red-500 cursor-pointer w-5 h-5 sm:w-6 sm:h-6" />
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-white w-[90%] sm:w-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>

      {/* 🧠 EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-white w-[95%] sm:max-w-[625px] max-h-[90vh] overflow-y-auto shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input
              name="productName"
              value={editProduct.productName}
              onChange={handleChange}
              placeholder="Product Name"
            />

            <Input
              name="productPrice"
              type="number"
              value={editProduct.productPrice}
              onChange={handleChange}
              placeholder="Price"
            />

            <Input
              name="brand"
              value={editProduct.brand}
              onChange={handleChange}
              placeholder="Brand"
            />

            <Input
              name="category"
              value={editProduct.category}
              onChange={handleChange}
              placeholder="Category"
            />

            <Textarea
              name="productDesc"
              value={editProduct.productDesc}
              onChange={handleChange}
              placeholder="Description"
            />

            <ImageUpload
              productData={editProduct}
              setProductData={setEditProduct}
            />
           
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button
                className="cursor-pointer w-full sm:w-auto"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="cursor-pointer w-full sm:w-auto"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AdminProduct;
