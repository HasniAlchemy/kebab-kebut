let stokHarian = [];
let stokGerobak = [];
let menuList = [];

window.onload = async function () {
  await ambilMaster();
  await buatStok("stok-harian", stokHarian, "stok_harian");
  await buatStok("stok-gerobak", stokGerobak, "stok_gerobak");
  buatMenu();
  hitungKeuangan();
};

// =======================
// AMBIL MASTER
// =======================
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

  stokHarian = harian ? harian.map(x => x.barang) : [];
  stokGerobak = gerobak ? gerobak.map(x => x.barang) : [];
  menuList = menu ? menu.map(x => ({
    nama: x.menu,
    harga: Number(x.harga) || 0
  })) : [];
}

// =======================
// AMBIL SISA TERAKHIR
// =======================
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

// =======================
// BUAT TABEL STOK
// =======================
async function buatStok(id, daftar, tableName) {
  const tbody = document.getElementById(id);
  tbody.innerHTML = "";

  for (let barang of daftar) {
    const sisa = await ambilSisa(tableName, barang);

    tbody.innerHTML += `
      <tr>
        <td>${barang}</td>
        <td><input type="number" id="${barang}_sisa" value="${sisa}" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${barang}_masuk" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${barang}_jumlah" readonly></td>
        <td><input type="number" id="${barang}_pakai" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${barang}_rusak" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${barang}_akhir" readonly></td>
      </tr>
    `;

    hitungRealtime(barang);
  }
}

// =======================
// HITUNG STOK
// =======================
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

// =======================
// BUAT MENU
// =======================
function buatMenu() {
  const tbody = document.getElementById("penjualan");
  tbody.innerHTML = "";

  for (let item of menuList) {
    tbody.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.harga}</td>
        <td><input type="number" id="${item.nama}_qty" value="0" oninput="hitungMenu('${item.nama}')"></td>
        <td><input type="number" id="${item.nama}_total" readonly></td>
      </tr>
    `;

    hitungMenu(item.nama);
  }
}

// =======================
// SINKRON STOK -> QTY
// =======================
function sinkronQty(barang, qty) {
  const mapping = {
    "Kulit Besar": "Kebab Besar",
    "Kulit Sedang": "Kebab Sedang",
    "Kulit Kecil": "Kebab Kecil",
    "Keju+": "Extra Keju",
    "Roti": "Burger"
  };

  if (mapping[barang]) {
    const menu = mapping[barang];
    const input = document.getElementById(`${menu}_qty`);

    if (input) {
      input.value = qty;
      hitungMenu(menu);
    }
  }
}

// =======================
// HITUNG MENU
// =======================
function hitungMenu(nama) {
  const menu = menuList.find(x => x.nama === nama);
  if (!menu) return;

  const qty = Number(document.getElementById(`${nama}_qty`)?.value) || 0;
  const total = qty * menu.harga;

  document.getElementById(`${nama}_total`).value = total;

  hitungTotalPenjualan();
}

// =======================
// TOTAL PENJUALAN
// =======================
function hitungTotalPenjualan() {
  let total = 0;

  for (let item of menuList) {
    total += Number(document.getElementById(`${item.nama}_total`)?.value) || 0;
  }

  document.getElementById("total-penjualan").innerText = total;

  hitungSisa();
}

// =======================
// TOTAL KEUANGAN
// =======================
function hitungKeuangan() {
  const bonus = Number(document.getElementById("bonus")?.value) || 0;
  const shopee = Number(document.getElementById("shopee")?.value) || 0;
  const qris = Number(document.getElementById("qris")?.value) || 0;
  const pengeluaran = Number(document.getElementById("pengeluaran")?.value) || 0;
  const pengeluaran1 = Number(document.getElementById("pengeluaran1")?.value) || 0;
  const pengeluaran2 = Number(document.getElementById("pengeluaran2")?.value) || 0;
  const pengeluaran3 = Number(document.getElementById("pengeluaran3")?.value) || 0;
  const pengeluaran4 = Number(document.getElementById("pengeluaran4")?.value) || 0;
  const pengeluaran5 = Number(document.getElementById("pengeluaran5")?.value) || 0;

  const totalKeuangan =
    bonus + shopee + qris + pengeluaran +
    pengeluaran1 + pengeluaran2 + pengeluaran3 +
    pengeluaran4 + pengeluaran5;

  document.getElementById("total-keuangan").innerText = totalKeuangan;

  hitungSisa();
}

// =======================
// SISA UANG
// =======================
function hitungSisa() {
  const totalPenjualan =
    Number(document.getElementById("total-penjualan")?.innerText) || 0;

  const totalKeuangan =
    Number(document.getElementById("total-keuangan")?.innerText) || 0;

  const sisa = totalPenjualan - totalKeuangan;

  document.getElementById("sisa-uang").innerText = sisa;
}

// =======================
// SIMPAN SEMUA
// =======================
async function simpanSemua() {
  const tanggal = document.getElementById("tanggal").value;

  if (!tanggal) {
    alert("Tanggal wajib diisi");
    return;
  }

  try {
    for (let barang of stokHarian) {
      await simpanStok("stok_harian", barang, tanggal);
    }

    for (let barang of stokGerobak) {
      await simpanStok("stok_gerobak", barang, tanggal);
    }

    for (let item of menuList) {
      const qty = Number(document.getElementById(`${item.nama}_qty`)?.value) || 0;
      const total = Number(document.getElementById(`${item.nama}_total`)?.value) || 0;

      await supabaseClient.from("penjualan").insert([{
        tanggal,
        menu: item.nama,
        harga: item.harga,
        qty,
        total
      }]);
    }

    const total_pengeluaran =
      Number(document.getElementById("total-keuangan").innerText) || 0;

    const uang_masuk =
      Number(document.getElementById("total-penjualan").innerText) || 0;

    const sisa =
      Number(document.getElementById("sisa-uang").innerText) || 0;

    await supabaseClient.from("keuangan").insert([{
      tanggal,
      bonus: Number(document.getElementById("bonus").value) || 0,
      shopee: Number(document.getElementById("shopee").value) || 0,
      qris: Number(document.getElementById("qris").value) || 0,
      pengeluaran: Number(document.getElementById("pengeluaran").value) || 0,
      pengeluaran1: Number(document.getElementById("pengeluaran1").value) || 0,
      pengeluaran2: Number(document.getElementById("pengeluaran2").value) || 0,
      pengeluaran3: Number(document.getElementById("pengeluaran3").value) || 0,
      pengeluaran4: Number(document.getElementById("pengeluaran4").value) || 0,
      pengeluaran5: Number(document.getElementById("pengeluaran5").value) || 0,
      total_pengeluaran,
      uang_masuk,
      sisa
    }]);

    alert("Semua data berhasil disimpan");
    window.location.href = "history.html";

  } catch (err) {
    console.log(err);
    alert("Ada error saat menyimpan");
  }
}

// =======================
// SIMPAN STOK
// =======================
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
