let stokHarian = [];
let stokGerobak = [];
let menuList = [];

// =======================
// INIT
// =======================
window.onload = async function () {
  await ambilMaster();

  console.log("MASTER MENU:", menuList);

  await buatStok("stok-harian", stokHarian, "stok_harian");
  await buatStok("stok-gerobak", stokGerobak, "stok_gerobak");

  buatMenu();
  hitungKeuangan();
};

// =======================
// SAFE ID (hindari spasi & karakter error)
// =======================
function safeId(text) {
  return text.replace(/\s+/g, "_").replace(/\+/g, "plus");
}

// =======================
// AMBIL MASTER DATA
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

  stokHarian = harian?.map(x => x.barang) || [];
  stokGerobak = gerobak?.map(x => x.barang) || [];

  menuList = (menu || [])
    .filter(x => x.menu)
    .map(x => ({
      nama: x.menu,
      harga: Number(x.harga) || 0
    }));
}

// =======================
// AMBIL SISA TERAKHIR STOK
// =======================
async function ambilSisa(table, barang) {
  const { data } = await supabaseClient
    .from(table)
    .select("*")
    .eq("barang", barang)
    .order("id", { ascending: false })
    .limit(1);

  return data?.length ? Number(data[0].sisa_akhir) : 0;
}

// =======================
// BUAT TABEL STOK (HARIAN / GEROBAK)
// =======================
async function buatStok(id, daftar, tableName) {
  const tbody = document.getElementById(id);
  tbody.innerHTML = "";

  for (let barang of daftar) {
    const sisa = await ambilSisa(tableName, barang);

    const safe = safeId(barang);

    tbody.innerHTML += `
      <tr>
        <td>${barang}</td>
        <td><input type="number" id="${safe}_sisa" value="${sisa}" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${safe}_masuk" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${safe}_jumlah" readonly></td>
        <td><input type="number" id="${safe}_pakai" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${safe}_rusak" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${safe}_akhir" readonly></td>
      </tr>
    `;

    hitungRealtime(barang);
  }
}
// =======================
// HITUNG STOK REALTIME
// =======================
function hitungRealtime(barang) {
  const id = safeId(barang);

  const sisa = Number(document.getElementById(`${id}_sisa`)?.value) || 0;
  const masuk = Number(document.getElementById(`${id}_masuk`)?.value) || 0;
  const pakai = Number(document.getElementById(`${id}_pakai`)?.value) || 0;
  const rusak = Number(document.getElementById(`${id}_rusak`)?.value) || 0;

  const jumlah = sisa + masuk;
  const akhir = jumlah - pakai - rusak;

  const elJumlah = document.getElementById(`${id}_jumlah`);
  const elAkhir = document.getElementById(`${id}_akhir`);

  if (elJumlah) elJumlah.value = jumlah;
  if (elAkhir) elAkhir.value = akhir;

  sinkronQty(barang, pakai);
}

// =======================
// BUAT MENU PENJUALAN
// =======================
function buatMenu() {
  const tbody = document.getElementById("penjualan");
  tbody.innerHTML = "";

  menuList.forEach(item => {
    const id = safeId(item.nama);

    tbody.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.harga}</td>
        <td>
          <input type="number" id="${id}_qty" value="0"
          oninput="hitungMenu('${item.nama}')">
        </td>
        <td>
          <input type="number" id="${id}_total" readonly>
        </td>
      </tr>
    `;
  });

  menuList.forEach(item => hitungMenu(item.nama));
}

// =======================
// HITUNG MENU
// =======================
function hitungMenu(nama) {
  const menu = menuList.find(x => x.nama === nama);
  if (!menu) return;

  const id = safeId(nama);

  const qty = Number(document.getElementById(`${id}_qty`)?.value) || 0;
  const total = qty * menu.harga;

  const el = document.getElementById(`${id}_total`);
  if (el) el.value = total;

  hitungTotalPenjualan();
}

// =======================
// TOTAL PENJUALAN
// =======================
function hitungTotalPenjualan() {
  let total = 0;

  menuList.forEach(item => {
    const id = safeId(item.nama);
    total += Number(document.getElementById(`${id}_total`)?.value) || 0;
  });

  const el = document.getElementById("total-penjualan");
  if (el) el.innerText = total;

  hitungSisa();
}

// =======================
// SINKRON STOK → MENU
// =======================
function sinkronQty(barang, qty) {
  const mapping = {
    "Kulit Besar": "Kebab Besar",
    "Kulit Sedang": "Kebab Sedang",
    "Kulit Kecil": "Kebab Kecil",
    "Keju+": "Extra Keju",
    "Roti": "Burger"
  };

  if (!mapping[barang]) return;

  const target = mapping[barang];
  const id = safeId(target);

  const input = document.getElementById(`${id}_qty`);
  if (!input) return;

  input.value = qty;
  hitungMenu(target);
}
// =======================
// HITUNG KEUANGAN
// =======================
function hitungKeuangan() {
  const ids = [
    "bonus",
    "shopee",
    "qris",
    "pengeluaran1",
    "pengeluaran2",
    "pengeluaran3",
    "pengeluaran4",
    "pengeluaran5"
  ];

  let total = 0;

  ids.forEach(id => {
    total += Number(document.getElementById(id)?.value) || 0;
  });

  const el = document.getElementById("total-keuangan");
  if (el) el.innerText = total;

  hitungSisa();
}

// =======================
// HITUNG SISA UANG
// =======================
function hitungSisa() {
  const penjualan = Number(document.getElementById("total-penjualan")?.innerText) || 0;
  const keluar = Number(document.getElementById("total-keuangan")?.innerText) || 0;

  const sisa = penjualan - keluar;

  const el = document.getElementById("sisa-uang");
  if (el) el.innerText = sisa;
}

// =======================
// SIMPAN SEMUA (MAIN FUNCTION)
// =======================
async function simpanSemua() {
  const tombol = document.querySelector("button");
  if (tombol) tombol.disabled = true;

  const tanggal = document.getElementById("tanggal")?.value;

  if (!tanggal) {
    alert("Tanggal wajib diisi!");
    if (tombol) tombol.disabled = false;
    return;
  }

  try {
    // =======================
    // SIMPAN STOK HARIAN
    // =======================
    for (let barang of stokHarian) {
      await simpanStok("stok_harian", barang, tanggal);
    }

    // =======================
    // SIMPAN STOK GEROBAK
    // =======================
    for (let barang of stokGerobak) {
      await simpanStok("stok_gerobak", barang, tanggal);
    }

    // =======================
    // SIMPAN PENJUALAN
    // =======================
    for (let item of menuList) {
      const id = safeId(item.nama);

      const qty = Number(document.getElementById(`${id}_qty`)?.value) || 0;
      const total = Number(document.getElementById(`${id}_total`)?.value) || 0;

      if (qty > 0) {
        const { error } = await supabaseClient.from("penjualan").insert([{
          tanggal,
          menu: item.nama,
          harga: item.harga,
          qty,
          total
        }]);

        if (error) {
          console.error("Error penjualan:", error);
        }
      }
    }

    // =======================
    // SIMPAN KEUANGAN
    // =======================
    const keuanganPayload = {
      tanggal,

      bonus: Number(document.getElementById("bonus")?.value) || 0,
      shopee: Number(document.getElementById("shopee")?.value) || 0,
      qris: Number(document.getElementById("qris")?.value) || 0,

      pengeluaran1: Number(document.getElementById("pengeluaran1")?.value) || 0,
      pengeluaran2: Number(document.getElementById("pengeluaran2")?.value) || 0,
      pengeluaran3: Number(document.getElementById("pengeluaran3")?.value) || 0,
      pengeluaran4: Number(document.getElementById("pengeluaran4")?.value) || 0,
      pengeluaran5: Number(document.getElementById("pengeluaran5")?.value) || 0,

      ket_pengeluaran1: document.getElementById("ket_pengeluaran1")?.value || "",
      ket_pengeluaran2: document.getElementById("ket_pengeluaran2")?.value || "",
      ket_pengeluaran3: document.getElementById("ket_pengeluaran3")?.value || "",
      ket_pengeluaran4: document.getElementById("ket_pengeluaran4")?.value || "",
      ket_pengeluaran5: document.getElementById("ket_pengeluaran5")?.value || "",

      total_pengeluaran: Number(document.getElementById("total-keuangan")?.innerText) || 0,
      uang_masuk: Number(document.getElementById("total-penjualan")?.innerText) || 0,
      sisa: Number(document.getElementById("sisa-uang")?.innerText) || 0
    };

    const { error: keuError } = await supabaseClient
      .from("keuangan")
      .insert([keuanganPayload]);

    if (keuError) {
      console.error("Error keuangan:", keuError);
      alert("Gagal simpan keuangan!");
      if (tombol) tombol.disabled = false;
      return;
    }

    alert("Data berhasil disimpan!");
    window.location.href = "history.html";

  } catch (err) {
    console.error("Simpan error:", err);
    alert("Terjadi error saat menyimpan data");
    if (tombol) tombol.disabled = false;
  }
}

// =======================
// SIMPAN STOK (FIXED)
// =======================
async function simpanStok(table, barang, tanggal) {
  const id = safeId(barang);

  const sisa_awal = Number(document.getElementById(`${id}_sisa`)?.value) || 0;
  const masuk = Number(document.getElementById(`${id}_masuk`)?.value) || 0;
  const pakai = Number(document.getElementById(`${id}_pakai`)?.value) || 0;
  const rusak = Number(document.getElementById(`${id}_rusak`)?.value) || 0;

  // kalau semua kosong, skip
  if (sisa_awal === 0 && masuk === 0 && pakai === 0 && rusak === 0) return;

  const { error } = await supabaseClient.from(table).insert([{
    tanggal,
    barang,
    sisa_awal,
    masuk,
    jumlah: sisa_awal + masuk,
    pakai,
    rusak,
    sisa_akhir: (sisa_awal + masuk) - pakai - rusak
  }]);

  if (error) {
    console.error(`Error simpan ${table}:`, error);
  }
}
