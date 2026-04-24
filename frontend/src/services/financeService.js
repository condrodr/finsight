import API from "./api";

export const getDashboard = (user_id) => {
  return API.get(`/finance/dashboard/${user_id}`);
};