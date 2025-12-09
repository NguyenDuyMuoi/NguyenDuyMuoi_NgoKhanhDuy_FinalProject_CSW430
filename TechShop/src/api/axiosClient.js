import axios from "axios";

// ⭐ ĐỔI IP NÀY THÀNH IP MÁY BẠN
// 10.0.2.2 dành cho Android Emulator
const BASE_URL = "http://10.0.2.2:5029/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ĐƯỜNG DẪN ẢNH SẢN PHẨM
const IMAGE_BASE_URL = "http://10.0.2.2:5029/images/products/";

axiosClient.interceptors.response.use(
  (res) => {
    const url = res.config.url;

    // ⭐ CHỈ xử lý hình ảnh cho PRODUCT API
    if (url.startsWith("/Products")) {
      const data = res.data;

      // Nhiều sản phẩm
      if (Array.isArray(data)) {
        return data.map((p) => ({
          ...p,
          firstImage: p.firstImage ? IMAGE_BASE_URL + p.firstImage : null,
        }));
      }

      // Một sản phẩm
      if (data && typeof data === "object") {
        return {
          ...data,
          firstImage: data.firstImage ? IMAGE_BASE_URL + data.firstImage : null,
        };
      }
      return data;
    }

    // ⭐ CART, AUTH, ORDER → GIỮ NGUYÊN DỮ LIỆU
    return res.data;
  },

  (err) => {
    console.log("❌ API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosClient;
