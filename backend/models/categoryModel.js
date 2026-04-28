import db from "../config/db.js";

export const getKategoriByJenis = async (jenis) => {
  const [rows] = await db.execute(
    "SELECT id_kategori, nama_kategori, kelompok_analisis FROM kategori WHERE jenis = ? ORDER BY nama_kategori",
    [jenis]
  );
  return rows;
};

export const getSubkategoriByKategori = async (id_kategori) => {
  const [rows] = await db.execute(
    "SELECT id_subkategori, nama_subkategori FROM subkategori WHERE id_kategori = ? ORDER BY nama_subkategori",
    [id_kategori]
  );
  return rows;
};
