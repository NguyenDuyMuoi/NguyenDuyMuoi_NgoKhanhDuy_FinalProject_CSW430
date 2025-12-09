import axiosClient from "./axiosClient";

export const getActiveFlashSale = () =>
  axiosClient.get("/admin/FlashSaleAdmin/active");
