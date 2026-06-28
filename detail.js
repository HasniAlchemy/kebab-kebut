window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get("tanggal");

  document.getElementById("tanggal-detail").innerText = tanggal;

  loadStokHarian(tanggal);
  loadStokGerobak(tanggal);
  loadPenjualan(tanggal);
  loadKeuangan(tanggal);
};

async function loadStokHarian(tanggal) {
  const { data } = await supabaseClient
    .from("stok_harian")
    .select("*")
    .eq("tanggal", tanggal);

  renderStok("stok-harian-detail", "Stok Harian", data);
}

async function loadStokGerobak(tanggal) {
  const { data } = await supabaseClient
    .from("stok_gerobak")
    .select("*")
    .eq("tanggal", tanggal);

  renderStok("stok-gerobak-detail", "Stok Gerobak", data);
}

function renderStok(id, title, data) {
  let html = `<h2>${title}</h2><table>
  <tr><th>Barang</th><th>Masuk</th><th>Pakai</th><th>Rusak</th></tr>`;

  data?.forEach(item => {
    html += `
      <tr>
        <td>${item.barang}</td>
        <td>${item.masuk}</td>
        <td>${item.pakai}</td>
        <td>${item.rusak}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById(id).innerHTML = html;
}

async function loadPenjualan(tanggal) {
  const { data } = await supabaseClient
    .from("penjualan")
    .select("*")
    .eq("tanggal", tanggal);

  let html = `<h2>Penjualan</h2><table>
  <tr><th>Menu</th><th>Qty</th><th>Total</th></tr>`;

  data?.forEach(item => {
    html += `
      <tr>
        <td>${item.menu}</td>
        <td>${item.qty}</td>
        <td>${item.total}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("penjualan-detail").innerHTML = html;
}

async function loadKeuangan(tanggal) {
  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .eq("tanggal", tanggal);

  if (!data?.length) return;

  const k = data[0];

  document.getElementById("keuangan-detail").innerHTML = `
    <h2>Keuangan</h2>
    <p>Bonus: ${k.bonus}</p>
    <p>Shopee: ${k.shopee}</p>
    <p>QRIS: ${k.qris}</p>
    <p>Total Pengeluaran: ${k.total_pengeluaran}</p>
    <p>Uang Masuk: ${k.uang_masuk}</p>
    <p>Sisa: ${k.sisa}</p>
  `;
}
