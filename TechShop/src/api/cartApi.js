import axiosClient from "./axiosClient";

export const cartApi = {
  getCart: (userId) => axiosClient.get(`/Cart/${userId}`),

  addToCart: (userId, productId, quantity) =>
    axiosClient.post(`/Cart/${userId}/add`, {
      productId,
      quantity,
    }),
    getCartCount: async (userId) => {
  const data = await axiosClient.get(`/Cart/${userId}`);
  return data.items?.length ?? 0;
},

//update
  updateItem: (userId, productId, quantity) =>
    axiosClient.put(`/Cart/${userId}/update?productId=${productId}`, {
      quantity,
    }),
//remove
 deleteCartItem(userId, productId) {
    return axiosClient.delete(`/Cart/${userId}/remove/${productId}`);
},


  clearCart: (userId) => axiosClient.delete(`/Cart/${userId}/clear`),
};
