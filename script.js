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

function safeId(text) {
  return text.replace(/\s+/g, "_").replace(/[^\w]/g, "");
}

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
  menuList = menu?.map(x => ({
    nama: x.menu,
    harga: Number(x.harga)
  })) || [];
}

async function ambilSisa(table, barang) {
  const { data } = await supabaseClient
    .from(table)
    .select("*")
    .eq("barang", barang)
    .order("id", { ascending: false })
    .limit(1);

  return data?.length ? Number(data[0].sisa_akhir) : 0;
}

async function buatStok(id, daftar, tableName) {
  const tbody = document.getElementById(id);
  tbody.innerHTML = "";

  for (let barang of daftar) {
    const sid = safeId(barang);
    const sisa = await ambilSisa(tableName, barang);

    tbody.innerHTML += `
      <tr>
        <td>${barang}</td>
        <td><input type="number" id="${sid}_sisa" value="${sisa}" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${sid}_masuk" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${sid}_jumlah" readonly></td>
        <td><input type="number" id="${sid}_pakai" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${sid}_rusak" value="0" oninput="hitungRealtime('${barang}')"></td>
        <td><input type="number" id="${sid}_akhir" readonly></td>
      </tr>
    `;

    hitungRealtime(barang);
  }
}

function hitungRealtime(barang) {
  const id = safeId(barang);

  const sisa = Number(document.getElementById(`${id}_sisa`)?.value) || 0;
  const masuk = Number(document.getElementById(`${id}_masuk`)?.value) || 0;
  const pakai = Number(document.getElementById(`${id}_pakai`)?.value) || 0;
  const rusak = Number(document.getElementById(`${id}_rusak`)?.value) || 0;

  const jumlah = sisa + masuk;
  const akhir = jumlah - pakai - rusak;

  document.getElementById(`${id}_jumlah`).value = jumlah;
  document.getElementById(`${id}_akhir`).value = akhir;

  sinkronQty(barang, pakai);
}

function buatMenu() {
  const tbody = document.getElementById("penjualan");
  tbody.innerHTML = "";

  menuList.forEach(item => {
    const sid = safeId(item.nama);

    tbody.innerHTML += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.harga}</td>
        <td><input type="number" id="${sid}_qty" value="0" oninput="hitungMenu('${item.nama}')"></td>
        <td><input type="number" id="${sid}_total" readonly></td>
      </tr>
    `;

    hitungMenu(item.nama);
  });
}

function sinkronQty(barang, qty) {
  const mapping = {
    "Kulit Besar": "Kebab Besar",
    "Kulit Sedang": "Kebab Sedang",
    "Kulit Kecil": "Kebab Kecil",
    "Keju+": "Extra Keju",
    "Roti": "Burger"
  };

  if (mapping[barang]) {
    const id = safeId(mapping[barang]);
    const input = document.getElementById(`${id}_qty`);

    if (input) {
      input.value = qty;
      hitungMenu(mapping[barang]);
    }
  }
}

function hitungMenu(nama) {
  const menu = menuList.find(x => x.nama === nama);
  if (!menu) return;

  const id = safeId(nama);
  const qty = Number(document.getElementById(`${id}_qty`)?.value) || 0;
  const total = qty * menu.harga;

  document.getElementById(`${id}_total`).value = total;

  hitungTotalPenjualan();
}

function hitungTotalPenjualan() {
  let total = 0;

  menuList.forEach(item => {
    const id = safeId(item.nama);
    total += Number(document.getElementById(`${id}_total`)?.value) || 0;
  });

  document.getElementById("total-penjualan").innerText = total;
  hitungSisa();
}

function hitungKeuangan() {
  const ids = [
    "bonus","shopee","qris",
    "pengeluaran","pengeluaran1","pengeluaran2",
    "pengeluaran3","pengeluaran4","pengeluaran5"
  ];

  let total = 0;

  ids.forEach(id => {
    total += Number(document.getElementById(id)?.value) || 0;
  });

  document.getElementById("total-keuangan").innerText = total;
  hitungSisa();
}

function hitungSisa() {
  const jual = Number(document.getElementById("total-penjualan").innerText) || 0;
  const keluar = Number(document.getElementById("total-keuangan").innerText) || 0;

  document.getElementById("sisa-uang").innerText = jual - keluar;
}

async function simpanSemua() {
  const tanggal = document.getElementById("tanggal").value;

  for (let barang of stokHarian) {
    await simpanStok("stok_harian", barang, tanggal);
  }

  for (let barang of stokGerobak) {
    await simpanStok("stok_gerobak", barang, tanggal);
  }

  for (let item of menuList) {
    const id = safeId(item.nama);
    const qty = Number(document.getElementById(`${id}_qty`)?.value) || 0;
    const total = Number(document.getElementById(`${id}_total`)?.value) || 0;

    if (qty > 0) {
      const { data: cekPenjualan } = await supabaseClient
        .from("penjualan")
        .select("id")
        .eq("tanggal", tanggal)
        .eq("menu", item.nama)
        .limit(1);

      if (!cekPenjualan || cekPenjualan.length === 0) {
        await supabaseClient.from("penjualan").insert([{
          tanggal,
          menu: item.nama,
          harga: item.harga,
          qty,
          total
        }]);
      }
    }
  }

  const { data: cekKeuangan } = await supabaseClient
    .from("keuangan")
    .select("id")
    .eq("tanggal", tanggal)
    .limit(1);

  if (!cekKeuangan || cekKeuangan.length === 0) {
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

      ket_pengeluaran1: document.getElementById("ket_pengeluaran1")?.value || "",
      ket_pengeluaran2: document.getElementById("ket_pengeluaran2")?.value || "",
      ket_pengeluaran3: document.getElementById("ket_pengeluaran3")?.value || "",
      ket_pengeluaran4: document.getElementById("ket_pengeluaran4")?.value || "",
      ket_pengeluaran5: document.getElementById("ket_pengeluaran5")?.value || "",

      total_pengeluaran: Number(document.getElementById("total-keuangan").innerText),
      uang_masuk: Number(document.getElementById("total-penjualan").innerText),
      sisa: Number(document.getElementById("sisa-uang").innerText)
    }]);
  }

  alert("Data berhasil disimpan");
  window.location.href = "history.html";
}

async function simpanStok(table, barang, tanggal) {
  const id = safeId(barang);

  const sisa_awal = Number(document.getElementById(`${id}_sisa`)?.value) || 0;
  const masuk = Number(document.getElementById(`${id}_masuk`)?.value) || 0;
  const pakai = Number(document.getElementById(`${id}_pakai`)?.value) || 0;
  const rusak = Number(document.getElementById(`${id}_rusak`)?.value) || 0;

  if (sisa_awal === 0 && masuk === 0 && pakai === 0 && rusak === 0) return;

  const { data: cekData } = await supabaseClient
    .from(table)
    .select("id")
    .eq("tanggal", tanggal)
    .eq("barang", barang)
    .limit(1);

  if (cekData && cekData.length > 0) {
    return;
  }

  await supabaseClient.from(table).insert([{
    tanggal,
    barang,
    sisa_awal,
    masuk,
    jumlah: sisa_awal + masuk,
    pakai,
    rusak,
    sisa_akhir: (sisa_awal + masuk) - pakai - rusak
  }]);
}
