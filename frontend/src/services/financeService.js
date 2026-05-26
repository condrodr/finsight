import API from "./api";

export const getDashboard = (user_id, params = "") => {
  return API.get(`/finance/dashboard/${user_id}${params}`);
};