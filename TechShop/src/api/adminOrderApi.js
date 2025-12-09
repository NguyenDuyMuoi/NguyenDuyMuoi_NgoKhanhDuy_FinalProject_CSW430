import axiosClient from "./axiosClient";

export const adminOrderApi = {
  getAll: () => axiosClient.get("/Orders/admin/all"),

  getDetail: (id) => axiosClient.get(`/Orders/admin/detail/${id}`),

  updateStatus: (id, status) =>
    axiosClient.put(`/Orders/admin/${id}/status`, { status }),
};
