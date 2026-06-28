window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get("tanggal");

  if (!tanggal) {
    alert("Tanggal tidak ditemukan");
    return;
  }

  document.getElementById("judul-tanggal").innerText =
    "Detail Tanggal: " + tanggal;

  await loadStokHarian(tanggal);
  await loadStokGerobak(tanggal);
  await loadPenjualan(tanggal);
  await loadKeuangan(tanggal);
};

// =====================
// STOK HARIAN
// =====================
async function loadStokHarian(tanggal) {
  const { data, error } = await supabaseClient
    .from("stok_harian")
    .select("*")
    .eq("tanggal", tanggal);

  console.log("stok harian:", data, error);

  const tbody = document.getElementById("detail-stok-harian");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach(item => {
    if (
      Number(item.sisa_awal) > 0 ||
      Number(item.masuk) > 0 ||
      Number(item.pakai) > 0 ||
      Number(item.rusak) > 0
    ) {
      tbody.innerHTML += `
        <tr>
          <td>${item.barang}</td>
          <td>${item.sisa_awal}</td>
          <td>${item.masuk}</td>
          <td>${item.jumlah}</td>
          <td>${item.pakai}</td>
          <td>${item.rusak}</td>
          <td>${item.sisa_akhir}</td>
        </tr>
      `;
    }
  });
}

// =====================
// STOK GEROBAK
// =====================
async function loadStokGerobak(tanggal) {
  const { data, error } = await supabaseClient
    .from("stok_gerobak")
    .select("*")
    .eq("tanggal", tanggal);

  console.log("stok gerobak:", data, error);

  const tbody = document.getElementById("detail-stok-gerobak");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach(item => {
    if (
      Number(item.sisa_awal) > 0 ||
      Number(item.masuk) > 0 ||
      Number(item.pakai) > 0 ||
      Number(item.rusak) > 0
    ) {
      tbody.innerHTML += `
        <tr>
          <td>${item.barang}</td>
          <td>${item.sisa_awal}</td>
          <td>${item.masuk}</td>
          <td>${item.jumlah}</td>
          <td>${item.pakai}</td>
          <td>${item.rusak}</td>
          <td>${item.sisa_akhir}</td>
        </tr>
      `;
    }
  });
}

// =====================
// PENJUALAN
// =====================
async function loadPenjualan(tanggal) {
  const { data, error } = await supabaseClient
    .from("penjualan")
    .select("*")
    .eq("tanggal", tanggal);

  console.log("penjualan:", data, error);

  const tbody = document.getElementById("detail-penjualan");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Tidak ada data</td></tr>`;
    return;
  }

  data.forEach(item => {
    if (Number(item.qty) > 0) {
      tbody.innerHTML += `
        <tr>
          <td>${item.menu}</td>
          <td>${item.harga}</td>
          <td>${item.qty}</td>
          <td>${item.total}</td>
        </tr>
      `;
    }
  });
}

// =====================
// KEUANGAN
// =====================
async function loadKeuangan(tanggal) {
  const { data, error } = await supabaseClient
    .from("keuangan")
    .select("*")
    .eq("tanggal", tanggal);

  console.log("keuangan:", data, error);

  const tbody = document.getElementById("detail-keuangan");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="2">Tidak ada data</td></tr>`;
    return;
  }

  const k = data[0];

  const fields = [
    ["Bonus", k.bonus],
    ["Shopee", k.shopee],
    ["QRIS", k.qris],
    ["Pengeluaran", k.pengeluaran],
    ["Pengeluaran 1", k.pengeluaran1],
    ["Pengeluaran 2", k.pengeluaran2],
    ["Pengeluaran 3", k.pengeluaran3],
    ["Pengeluaran 4", k.pengeluaran4],
    ["Pengeluaran 5", k.pengeluaran5],
    ["Total Pengeluaran", k.total_pengeluaran],
    ["Uang Masuk", k.uang_masuk],
    ["Sisa", k.sisa]
  ];

  fields.forEach(([nama, nilai]) => {
    if (Number(nilai) > 0) {
      tbody.innerHTML += `
        <tr>
          <td>${nama}</td>
          <td>${nilai}</td>
        </tr>
      `;
    }
  });
}
