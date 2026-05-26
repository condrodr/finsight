import API from "./api";

export const checkSurvey = (user_id, year, month) =>
  API.get(`/survey/check/${user_id}/${year}/${month}`);

export const getSurvey = (user_id, year, month) =>
  API.get(`/survey/get/${user_id}/${year}/${month}`);

export const getLatestSurvey = (user_id) =>
  API.get(`/survey/latest/${user_id}`);

export const submitSurvey = (data) =>
  API.post("/survey/submit", data);
