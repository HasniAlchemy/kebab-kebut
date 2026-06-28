window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get("tanggal");

  document.getElementById("tanggal-detail").innerText =
    "Tanggal: " + tanggal;

  await loadStokHarian(tanggal);
  await loadStokGerobak(tanggal);
  await loadPenjualan(tanggal);
  await loadKeuangan(tanggal);
};

// ambil data per tanggal aman
function filterTanggal(query, tanggal) {
  return query
    .gte("tanggal", tanggal)
    .lt("tanggal", tanggal + "T23:59:59");
}

async function loadStokHarian(tanggal) {
  const { data, error } = await filterTanggal(
    supabaseClient.from("stok_harian").select("*"),
    tanggal
  );

  console.log("stok harian:", data, error);

  let html = `
    <h2>Stok Harian</h2>
    <table>
      <tr>
        <th>Barang</th>
        <th>Sisa Awal</th>
        <th>Masuk</th>
        <th>Jumlah</th>
        <th>Pakai</th>
        <th>Rusak</th>
        <th>Sisa Akhir</th>
      </tr>
  `;

  data?.forEach(item => {
    if (
      Number(item.sisa_awal) > 0 ||
      Number(item.masuk) > 0 ||
      Number(item.pakai) > 0 ||
      Number(item.rusak) > 0
    ) {
      html += `
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

  html += "</table>";
  document.getElementById("stok-harian-detail").innerHTML = html;
}

async function loadStokGerobak(tanggal) {
  const { data } = await filterTanggal(
    supabaseClient.from("stok_gerobak").select("*"),
    tanggal
  );

  let html = `
    <h2>Stok Gerobak</h2>
    <table>
      <tr>
        <th>Barang</th>
        <th>Sisa Awal</th>
        <th>Masuk</th>
        <th>Jumlah</th>
        <th>Pakai</th>
        <th>Rusak</th>
        <th>Sisa Akhir</th>
      </tr>
  `;

  data?.forEach(item => {
    if (
      Number(item.sisa_awal) > 0 ||
      Number(item.masuk) > 0 ||
      Number(item.pakai) > 0 ||
      Number(item.rusak) > 0
    ) {
      html += `
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

  html += "</table>";
  document.getElementById("stok-gerobak-detail").innerHTML = html;
}

async function loadPenjualan(tanggal) {
  const { data } = await filterTanggal(
    supabaseClient.from("penjualan").select("*"),
    tanggal
  );

  let html = `
    <h2>Penjualan</h2>
    <table>
      <tr>
        <th>Menu</th>
        <th>Harga</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
  `;

  data?.forEach(item => {
    if (Number(item.qty) > 0) {
      html += `
      <tr>
        <td>${item.menu}</td>
        <td>${item.harga}</td>
        <td>${item.qty}</td>
        <td>${item.total}</td>
      </tr>
      `;
    }
  });

  html += "</table>";
  document.getElementById("penjualan-detail").innerHTML = html;
}

async function loadKeuangan(tanggal) {
  const { data } = await filterTanggal(
    supabaseClient.from("keuangan").select("*"),
    tanggal
  );

  if (!data || data.length === 0) return;

  const k = data[0];

  let html = `
    <h2>Keuangan</h2>
    <table>
      <tr><th>Keterangan</th><th>Nominal</th></tr>
  `;

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
      html += `
        <tr>
          <td>${nama}</td>
          <td>${nilai}</td>
        </tr>
      `;
    }
  });

  html += "</table>";

  document.getElementById("keuangan-detail").innerHTML = html;
}
