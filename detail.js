const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");

window.onload = async function () {
  document.getElementById("judul-tanggal").innerText = tanggal;

  await loadStokHarian();
  await loadStokGerobak();
  await loadPenjualan();
  await loadKeuangan();
};

// =======================
// STOK HARIAN
// =======================
async function loadStokHarian() {
  const { data } = await supabaseClient
    .from("stok_harian")
    .select("*")
    .eq("tanggal", tanggal)
    .order("id");

  const tbody = document.getElementById("detail-stok-harian");
  tbody.innerHTML = "";

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.barang}</td>
        <td>${item.sisa_awal || 0}</td>
        <td>${item.masuk || 0}</td>
        <td>${item.jumlah || 0}</td>
        <td>${item.pakai || 0}</td>
        <td>${item.rusak || 0}</td>
        <td>${item.sisa_akhir || 0}</td>
      </tr>
    `;
  });
}

// =======================
// STOK GEROBAK
// =======================
async function loadStokGerobak() {
  const { data } = await supabaseClient
    .from("stok_gerobak")
    .select("*")
    .eq("tanggal", tanggal)
    .order("id");

  const tbody = document.getElementById("detail-stok-gerobak");
  tbody.innerHTML = "";

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.barang}</td>
        <td>${item.sisa_awal || 0}</td>
        <td>${item.masuk || 0}</td>
        <td>${item.jumlah || 0}</td>
        <td>${item.pakai || 0}</td>
        <td>${item.rusak || 0}</td>
        <td>${item.sisa_akhir || 0}</td>
      </tr>
    `;
  });
}

// =======================
// PENJUALAN
// =======================
async function loadPenjualan() {
  const { data } = await supabaseClient
    .from("penjualan")
    .select("*")
    .eq("tanggal", tanggal)
    .order("id");

  const tbody = document.getElementById("detail-penjualan");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">Tidak ada data penjualan</td>
      </tr>
    `;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.menu}</td>
        <td>${item.harga || 0}</td>
        <td>${item.qty || 0}</td>
        <td>${item.total || 0}</td>
      </tr>
    `;
  });
}

// =======================
// KEUANGAN
// =======================
async function loadKeuangan() {
  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .eq("tanggal", tanggal)
    .single();

  const tbody = document.getElementById("detail-keuangan");
  tbody.innerHTML = "";

  if (!data) {
    tbody.innerHTML = `
      <tr>
        <td colspan="2">Tidak ada data keuangan</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = `
    <tr><td>Bonus</td><td>${data.bonus || 0}</td></tr>
    <tr><td>Shopee</td><td>${data.shopee || 0}</td></tr>
    <tr><td>QRIS</td><td>${data.qris || 0}</td></tr>
    <tr><td>Pengeluaran</td><td>${data.pengeluaran || 0}</td></tr>
    <tr><td>Pengeluaran 1</td><td>${data.pengeluaran1 || 0}</td></tr>
    <tr><td>Pengeluaran 2</td><td>${data.pengeluaran2 || 0}</td></tr>
    <tr><td>Pengeluaran 3</td><td>${data.pengeluaran3 || 0}</td></tr>
    <tr><td>Pengeluaran 4</td><td>${data.pengeluaran4 || 0}</td></tr>
    <tr><td>Pengeluaran 5</td><td>${data.pengeluaran5 || 0}</td></tr>
    <tr><td>Total Pengeluaran</td><td>${data.total_pengeluaran || 0}</td></tr>
    <tr><td>Uang Masuk</td><td>${data.uang_masuk || 0}</td></tr>
    <tr><td>Sisa</td><td>${data.sisa || 0}</td></tr>
  `;
}
