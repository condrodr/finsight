import { getKategoriByJenis, getSubkategoriByKategori } from "../models/categoryModel.js";

export const getKategori = async (req, res) => {
  try {
    const jenis = req.query.type === "income" ? "pendapatan" : "pengeluaran";
    const data = await getKategoriByJenis(jenis);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubkategori = async (req, res) => {
  try {
    const data = await getSubkategoriByKategori(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
