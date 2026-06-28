window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get("tanggal");

  document.getElementById("tanggal-detail").innerText =
    "Tanggal: " + tanggal;

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

  let html = `<h2>Stok Harian</h2><table>
<tr>
<th>Barang</th>
<th>Sisa Awal</th>
<th>Masuk</th>
<th>Jumlah</th>
<th>Pakai</th>
<th>Rusak</th>
<th>Sisa Akhir</th>
</tr>`;

  data.forEach(item => {
    if (
      item.sisa_awal > 0 ||
      item.masuk > 0 ||
      item.pakai > 0 ||
      item.rusak > 0
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
      </tr>`;
    }
  });

  html += `</table>`;
  document.getElementById("stok-harian-detail").innerHTML = html;
}

async function loadStokGerobak(tanggal) {
  const { data } = await supabaseClient
    .from("stok_gerobak")
    .select("*")
    .eq("tanggal", tanggal);

  let html = `<h2>Stok Gerobak</h2><table>
<tr>
<th>Barang</th>
<th>Sisa Awal</th>
<th>Masuk</th>
<th>Jumlah</th>
<th>Pakai</th>
<th>Rusak</th>
<th>Sisa Akhir</th>
</tr>`;

  data.forEach(item => {
    if (
      item.sisa_awal > 0 ||
      item.masuk > 0 ||
      item.pakai > 0 ||
      item.rusak > 0
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
      </tr>`;
    }
  });

  html += `</table>`;
  document.getElementById("stok-gerobak-detail").innerHTML = html;
}

async function loadPenjualan(tanggal) {
  const { data } = await supabaseClient
    .from("penjualan")
    .select("*")
    .eq("tanggal", tanggal);

  let html = `<h2>Penjualan</h2><table>
<tr>
<th>Menu</th>
<th>Harga</th>
<th>Qty</th>
<th>Total</th>
</tr>`;

  data.forEach(item => {
    if (item.qty > 0) {
      html += `
      <tr>
      <td>${item.menu}</td>
      <td>${item.harga}</td>
      <td>${item.qty}</td>
      <td>${item.total}</td>
      </tr>`;
    }
  });

  html += `</table>`;
  document.getElementById("penjualan-detail").innerHTML = html;
}

async function loadKeuangan(tanggal) {
  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .eq("tanggal", tanggal)
    .single();

  if (!data) return;

  let html = `
  <h2>Keuangan</h2>
  <table>
    <tr><td>Bonus</td><td>${data.bonus}</td></tr>
    <tr><td>Shopee</td><td>${data.shopee}</td></tr>
    <tr><td>QRIS</td><td>${data.qris}</td></tr>
    <tr><td>Pengeluaran</td><td>${data.pengeluaran}</td></tr>
    <tr><td>Pengeluaran 1</td><td>${data.pengeluaran1}</td></tr>
    <tr><td>Pengeluaran 2</td><td>${data.pengeluaran2}</td></tr>
    <tr><td>Pengeluaran 3</td><td>${data.pengeluaran3}</td></tr>
    <tr><td>Pengeluaran 4</td><td>${data.pengeluaran4}</td></tr>
    <tr><td>Pengeluaran 5</td><td>${data.pengeluaran5}</td></tr>
    <tr><td>Total Pengeluaran</td><td>${data.total_pengeluaran}</td></tr>
    <tr><td>Uang Masuk</td><td>${data.uang_masuk}</td></tr>
    <tr><td>Sisa</td><td>${data.sisa}</td></tr>
  </table>
  `;

  document.getElementById("keuangan-detail").innerHTML = html;
}
