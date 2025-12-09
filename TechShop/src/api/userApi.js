import axiosClient from "./axiosClient";

export const getAllUsers = () => {
  return axiosClient.get("/User");
};

export const toggleUserActive = (id) => {
  return axiosClient.put(`/User/toggle/${id}`);
};

export const updateUserProfile = (id, data) => {
  return axiosClient.put(`/User/${id}/update-profile`, data);
};

export const deleteUser = (id) => {
  return axiosClient.delete(`/User/${id}`);
};
