let stokHarian = [];
let stokGerobak = [];
let menuList = [];

window.onload = async function () {
  await ambilMaster();
  await buatStok("stok-harian", stokHarian, "stok_harian");
  await buatStok("stok-gerobak", stokGerobak, "stok_gerobak");
  buatMenu();
};

// ambil master data
async function ambilMaster() {
  const { data: harian } = await supabaseClient
    .from("master_stok_harian")
    .select("*")
    .order("id");

  const { data: gerobak } = await supabaseClient
    .from("master_stok_gerobak")
    .select("*")
    .order("id");

  const { data: menu } = await supabaseClient
    .from("master_menu")
    .select("*")
    .order("id");

  stokHarian = harian.map(x => x.barang);
  stokGerobak = gerobak.map(x => x.barang);
  menuList = menu.map(x => ({
    nama: x.menu,
    harga: x.harga
  }));
}

// ambil sisa terakhir
async function ambilSisa(table, barang) {
  const { data } = await supabaseClient
    .from(table)
    .select("*")
    .eq("barang", barang)
    .order("tanggal", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    return Number(data[0].sisa_akhir) || 0;
  }

  return 0;
}

// buat tabel stok
async function buatStok(id, daftar, tableName) {
  const tbody = document.getElementById(id);
  tbody.innerHTML = "";

  for (let barang of daftar) {
    const sisa = await ambilSisa(tableName, barang);

    tbody.innerHTML += `
      <tr>
        <td>${barang}</td>
        <td><input id="${barang}_sisa" value="${sisa}" oninput="hitungRealtime('${barang}')"></td>
        <td><input id="${barang}_masuk" oninput="hitungRealtime('${barang}')"></td>
        <td><input id="${barang}_jumlah" readonly></td>
        <td><input id="${barang}_pakai" oninput="hitungRealtime('${barang}')"></td>
        <td><input id="${barang}_rusak" oninput="hitungRealtime('${barang}')"></td>
        <td><input id="${barang}_akhir" readonly></td>
      </tr>
    `;

    hitungRealtime(barang);
  }
}

// hitung stok realtime
function hitungRealtime(barang) {
  const sisa = Number(document.getElementById(`${barang}_sisa`)?.value) || 0;
  const masuk = Number(document.getElementById(`${barang}_masuk`)?.value) || 0;
  const pakai = Number(document.getElementById(`${barang}_pakai`)?.value) || 0;
  const rusak = Number(document.getElementById(`${barang}_rusak`)?.value) || 0;

  const jumlah = sisa + masuk;
  const akhir = jumlah - pakai - rusak;

  document.getElementById(`${barang}_jumlah`).value = jumlah;
  document.getElementById(`${barang}_akhir`).value = akhir;

  sinkronQty(barang, pakai);
}

// buat tabel penjualan
function buatMenu() {
  const tbody = document.getElementById("penjualan");
  tbody.innerHTML = "";

  for (let item of menuList) {
    tbody.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.harga}</td>
        <td><input id="${item.nama}_qty"></td>
        <td><input id="${item.nama}_total" readonly></td>
      </tr>
    `;
  }
}

// sinkron pakai ke qty
function sinkronQty(barang, qty) {
  const mapping = {
    "Kulit Besar": "Kebab Besar",
    "Kulit Sedang": "Kebab Sedang",
    "Kulit Kecil": "Kebab Kecil",
    "Keju+": "Extra Keju",
    "Roti": "Burger"
  };

  if (mapping[barang]) {
    const namaMenu = mapping[barang];
    const inputQty = document.getElementById(`${namaMenu}_qty`);

    if (inputQty) {
      inputQty.value = qty;
      hitungMenu(namaMenu);
    }
  }
}

// hitung total menu
function hitungMenu(nama) {
  const menu = menuList.find(x => x.nama === nama);
  const qty = Number(document.getElementById(`${nama}_qty`)?.value) || 0;
  const total = qty * menu.harga;

  document.getElementById(`${nama}_total`).value = total;
}

// simpan semua
async function simpanSemua() {
  const tanggal = document.getElementById("tanggal").value;
  let totalPenjualan = 0;

  // simpan stok harian
  for (let barang of stokHarian) {
    await simpanStok("stok_harian", barang, tanggal);
  }

  // simpan stok gerobak
  for (let barang of stokGerobak) {
    await simpanStok("stok_gerobak", barang, tanggal);
  }

  // simpan penjualan
  for (let item of menuList) {
    const qty = Number(document.getElementById(`${item.nama}_qty`)?.value) || 0;
    const total = qty * item.harga;

    totalPenjualan += total;

    await supabaseClient.from("penjualan").insert([{
      tanggal,
      menu: item.nama,
      harga: item.harga,
      qty,
      total
    }]);
  }

  // keuangan
  const bonus = Number(document.getElementById("bonus")?.value) || 0;
  const shopee = Number(document.getElementById("shopee")?.value) || 0;
  const qris = Number(document.getElementById("qris")?.value) || 0;
  const pengeluaran = Number(document.getElementById("pengeluaran")?.value) || 0;
  const pengeluaran1 = Number(document.getElementById("pengeluaran1")?.value) || 0;
  const pengeluaran2 = Number(document.getElementById("pengeluaran2")?.value) || 0;
  const pengeluaran3 = Number(document.getElementById("pengeluaran3")?.value) || 0;
  const pengeluaran4 = Number(document.getElementById("pengeluaran4")?.value) || 0;
  const pengeluaran5 = Number(document.getElementById("pengeluaran5")?.value) || 0;

  const total_pengeluaran =
    bonus + shopee + qris + pengeluaran +
    pengeluaran1 + pengeluaran2 + pengeluaran3 +
    pengeluaran4 + pengeluaran5;

  const uang_masuk = totalPenjualan;
  const sisa = uang_masuk - total_pengeluaran;

  await supabaseClient.from("keuangan").insert([{
    tanggal,
    bonus,
    shopee,
    qris,
    pengeluaran,
    pengeluaran1,
    pengeluaran2,
    pengeluaran3,
    pengeluaran4,
    pengeluaran5,
    total_pengeluaran,
    uang_masuk,
    sisa
  }]);

  alert("Data berhasil disimpan");
}

// simpan stok
async function simpanStok(table, barang, tanggal) {
  const sisa_awal = Number(document.getElementById(`${barang}_sisa`)?.value) || 0;
  const masuk = Number(document.getElementById(`${barang}_masuk`)?.value) || 0;
  const pakai = Number(document.getElementById(`${barang}_pakai`)?.value) || 0;
  const rusak = Number(document.getElementById(`${barang}_rusak`)?.value) || 0;

  const jumlah = sisa_awal + masuk;
  const sisa_akhir = jumlah - pakai - rusak;

  await supabaseClient.from(table).insert([{
    tanggal,
    barang,
    sisa_awal,
    masuk,
    jumlah,
    pakai,
    rusak,
    sisa_akhir
  }]);
}
