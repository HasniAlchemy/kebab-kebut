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

  // pemasukan tetap
  if (Number(k.bonus) > 0) {
    tbody.innerHTML += `
      <tr>
        <td>Bonus</td>
        <td>${k.bonus}</td>
      </tr>
    `;
  }

  if (Number(k.shopee) > 0) {
    tbody.innerHTML += `
      <tr>
        <td>Shopee</td>
        <td>${k.shopee}</td>
      </tr>
    `;
  }

  if (Number(k.qris) > 0) {
    tbody.innerHTML += `
      <tr>
        <td>QRIS</td>
        <td>${k.qris}</td>
      </tr>
    `;
  }

  // pengeluaran utama
  if (Number(k.pengeluaran) > 0) {
    tbody.innerHTML += `
      <tr>
        <td>Pengeluaran Utama</td>
        <td>${k.pengeluaran}</td>
      </tr>
    `;
  }

  // detail pengeluaran dinamis
  for (let i = 1; i <= 5; i++) {
    const nominal = k[`pengeluaran${i}`];
    const ket = k[`ket_pengeluaran${i}`] || `Pengeluaran ${i}`;

    if (Number(nominal) > 0) {
      tbody.innerHTML += `
        <tr>
          <td>${ket}</td>
          <td>${nominal}</td>
        </tr>
      `;
    }
  }

  // ringkasan
  tbody.innerHTML += `
    <tr>
      <td><b>Total Keuangan</b></td>
      <td><b>${k.total_pengeluaran}</b></td>
    </tr>
    <tr>
      <td><b>Uang Masuk</b></td>
      <td><b>${k.uang_masuk}</b></td>
    </tr>
    <tr>
      <td><b>Sisa</b></td>
      <td><b>${k.sisa}</b></td>
    </tr>
  `;
}
