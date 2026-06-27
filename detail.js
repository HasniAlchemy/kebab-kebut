window.onload = async function () {
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get("tanggal");

  document.getElementById("tanggal-detail").innerText = tanggal;

  await tampilStokHarian(tanggal);
  await tampilStokGerobak(tanggal);
  await tampilPenjualan(tanggal);
  await tampilKeuangan(tanggal);
};

async function tampilStokHarian(tanggal) {
  const { data } = await supabaseClient
    .from("stok_harian")
    .select("*")
    .eq("tanggal", tanggal);

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

  data.forEach(item => {
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
  });

  html += "</table>";

  document.getElementById("stok-harian-detail").innerHTML = html;
}

async function tampilStokGerobak(tanggal) {
  const { data } = await supabaseClient
    .from("stok_gerobak")
    .select("*")
    .eq("tanggal", tanggal);

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

  data.forEach(item => {
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
  });

  html += "</table>";

  document.getElementById("stok-gerobak-detail").innerHTML = html;
}

async function tampilPenjualan(tanggal) {
  const { data } = await supabaseClient
    .from("penjualan")
    .select("*")
    .eq("tanggal", tanggal);

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

  data.forEach(item => {
    html += `
      <tr>
        <td>${item.menu}</td>
        <td>${item.harga}</td>
        <td>${item.qty}</td>
        <td>${item.total}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("penjualan-detail").innerHTML = html;
}

async function tampilKeuangan(tanggal) {
  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .eq("tanggal", tanggal)
    .single();

  let html = `
    <h2>Keuangan</h2>
    <table>
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
    </table>
  `;

  document.getElementById("keuangan-detail").innerHTML = html;
}
