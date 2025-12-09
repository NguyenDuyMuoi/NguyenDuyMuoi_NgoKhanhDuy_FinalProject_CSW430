import axiosClient from "./axiosClient";

// ========================
// GET ALL PRODUCTS
// ========================
export const getAllProducts = async () => {
  return await axiosClient.get("/products");
};

// ========================
// CREATE PRODUCT (ĐÚNG ROUTE)
// ========================
export const createProduct = async (data) => {
  return await axiosClient.post("/products/add", data);
};
//get category
export const getProductsByCategory = (category) => {
  return axiosClient.get(`/Products/category/${category}`);
};

//get brands
export const getProductsByBrand = async (brand) => {
  return await axiosClient.get(`/Products/brand/${brand}`);
};
// search product
export const searchProducts = async (keyword) => {
  return await axiosClient.get(`/products/search?keyword=${keyword}`);
};
// ========================
// UPDATE PRODUCT (ĐÚNG ROUTE)
// ========================
export const updateProduct = async (id, data) => {
  return await axiosClient.put(`/products/update/${id}`, data);
};

// ========================
// DELETE PRODUCT (ĐÚNG ROUTE)
// ========================
export const deleteProduct = async (id) => {
  return await axiosClient.delete(`/products/delete/${id}`);
};

// ========================
// UPLOAD IMAGE
// ========================
export const uploadImage = async (formData) => {
  return await axiosClient.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
