import axiosClient from "./axiosClient";

export const paymentApi = {
  createPayment: (userId, orderId, method) =>
    axiosClient.post(`/Payments/${userId}/create`, {
      orderId,
      method,  // COD
    }),
};
