const params = new URLSearchParams(window.location.search);
const tanggal = params.get("tanggal");

window.onload = async function () {
  document.getElementById("judul-tanggal").innerText = tanggal;

  await loadStokHarian();
  await loadStokGerobak();
  await loadPenjualan();
  await loadKeuangan();
};

// ======================
// STOK HARIAN
// ======================
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

// ======================
// STOK GEROBAK
// ======================
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
        <td>${item.jumlah || 
