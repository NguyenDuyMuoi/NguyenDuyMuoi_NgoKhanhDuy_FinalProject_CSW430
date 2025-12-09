import axiosClient from "./axiosClient";

// GET ALL FLASH SALES
export const getFlashSales = () =>
  axiosClient.get("/admin/FlashSaleAdmin");

// GET BY ID
export const getFlashSaleDetail = (id) =>
  axiosClient.get(`/admin/FlashSaleAdmin/${id}`);

// CREATE FLASH SALE
export const createFlashSale = (data) =>
  axiosClient.post("/admin/FlashSaleAdmin/create", data);

// DELETE FLASH SALE
export const deleteFlashSale = (id) =>
  axiosClient.delete(`/admin/FlashSaleAdmin/${id}`);

// UPDATE FLASH SALE
export const updateFlashSale = (id, data) =>
  axiosClient.put(`/admin/FlashSaleAdmin/${id}`, data);

// ADD ITEM
export const addFlashSaleItem = (flashSaleId, data) =>
  axiosClient.post(`/admin/FlashSaleAdmin/${flashSaleId}/add-item`, data);

// DELETE ITEM
export const deleteFlashSaleItem = (itemId) =>
  axiosClient.delete(`/admin/FlashSaleAdmin/item/${itemId}`);
