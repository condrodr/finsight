import API from "./api";

export const checkSurvey = (user_id, year, month) =>
  API.get(`/survey/check/${user_id}/${year}/${month}`);

export const submitSurvey = (data) =>
  API.post("/survey/submit", data);
