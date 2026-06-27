const daftarBarang = [
  "Daging",
  "Kulit Besar",
  "Kulit Sedang",
  "Kulit Kecil",
  "Lettuce",
  "Timun"
];

window.onload = async function () {
  buatTabel();
};

async function ambilStokKemarin(barang) {
  const { data } = await supabaseClient
    .from("stok_harian")
    .select("*")
    .eq("barang", barang)
    .order("tanggal", { ascending: false })
    .limit(1);

  if (data.length > 0) {
    return data[0].sisa_akhir;
  }

  return 0;
}

async function buatTabel() {
  const tbody = document.getElementById("tabel-stok");

  for (let barang of daftarBarang) {
    const sisaAwal = await ambilStokKemarin(barang);

    tbody.innerHTML += `
      <tr>
        <td>${barang}</td>
        <td><input id="${barang}_sisa" value="${sisaAwal}"></td>
        <td><input id="${barang}_masuk"></td>
        <td><input id="${barang}_pakai"></td>
        <td><input id="${barang}_rusak"></td>
      </tr>
    `;
  }
}

async function simpanSemua() {
  const tanggal = document.getElementById("tanggal").value;

  for (let barang of daftarBarang) {
    const sisa_awal = Number(document.getElementById(`${barang}_sisa`).value) || 0;
    const masuk = Number(document.getElementById(`${barang}_masuk`).value) || 0;
    const pakai = Number(document.getElementById(`${barang}_pakai`).value) || 0;
    const rusak = Number(document.getElementById(`${barang}_rusak`).value) || 0;

    const jumlah = sisa_awal + masuk;
    const sisa_akhir = jumlah - pakai - rusak;

    await supabaseClient.from("stok_harian").insert([
      {
        tanggal,
        barang,
        sisa_awal,
        masuk,
        jumlah,
        pakai,
        rusak,
        sisa_akhir
      }
    ]);
  }

  alert("Semua data berhasil disimpan");
}
