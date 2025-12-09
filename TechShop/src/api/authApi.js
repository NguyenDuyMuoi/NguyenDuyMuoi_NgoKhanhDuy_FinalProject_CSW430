import axiosClient from "./axiosClient";

export const loginApi = (email, password) => {
  return axiosClient.post("/Auth/login", { email, password });
};

export const registerApi = (name, email, password) => {
  return axiosClient.post("/Auth/register", {
    name,
    email,
    password,
    avatarUrl: "https://i.pravatar.cc/300"   // ⭐ tự thêm avatar
  });
};


// Logout (xóa refresh token)
export const logoutApi = (refreshToken) => {
  return api.post("/auth/logout", { refreshToken });
};
