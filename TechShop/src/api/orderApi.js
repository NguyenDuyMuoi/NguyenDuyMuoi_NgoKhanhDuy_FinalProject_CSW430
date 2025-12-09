import axiosClient from "./axiosClient";

const orderApi = {
  createOrder: (userId) => 
    axiosClient.post(`/Orders/${userId}/create`),

  getUserOrders: (userId) =>
    axiosClient.get(`/Orders/${userId}`),
};

export default orderApi;

