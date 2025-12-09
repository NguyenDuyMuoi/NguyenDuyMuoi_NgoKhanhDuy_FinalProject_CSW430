import axiosClient from "./axiosClient";

export const homeAddressApi = {
  getAddress: (userId) =>
    axiosClient.get(`/HomeAddress/${userId}`),

  saveAddress: (userId, data) =>
    axiosClient.post(`/HomeAddress/${userId}`, data),
};
