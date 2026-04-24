export const checkHealth = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API FinSight aktif dan berjalan"
  });
};