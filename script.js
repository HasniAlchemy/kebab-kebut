const stokHarian = [
"Daging","Kulit Besar","Kulit Sedang","Kulit Kecil","Lettuce","Timun"
];

const stokGerobak = [
"Keju","Keju+","Roti","Mayonaise","SC Sambal","SC Tomat","Kertas","Handglove","Plastik kb","Plastik 24","Cling","Tisu","Solasi","Kabel tis","Sabun"
];

const menuList = [
{nama:"Kebab Besar",harga:18000},
{nama:"Kebab Sedang",harga:15000},
{nama:"Kebab Kecil",harga:11000},
{nama:"Burger",harga:11000},
{nama:"Extra Keju",harga:3000}
];

window.onload = async function(){
  await buatStok("stok-harian", stokHarian, "stok_harian");
  await buatStok("stok-gerobak", stokGerobak, "stok_gerobak");
  buatMenu();
};

async function ambilSisa(table, barang){
  const { data } = await supabaseClient
    .from(table)
    .select("*")
    .eq("barang", barang)
    .order("tanggal", { ascending:false })
    .limit(1);

  return data.length ? Number(data[0].sisa_akhir) : 0;
}

async function buatStok(id, daftar, tableName){
  const tbody = document.getElementById(id);

  for(let barang of daftar){
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
    </tr>`;

    hitungRealtime(barang);
  }
}

function hitungRealtime(barang){
  const sisa = Number(document.getElementById(`${barang}_sisa`).value) || 0;
  const masuk = Number(document.getElementById(`${barang}_masuk`).value) || 0;
  const pakai = Number(document.getElementById(`${barang}_pakai`).value) || 0;
  const rusak = Number(document.getElementById(`${barang}_rusak`).value) || 0;

  const jumlah = sisa + masuk;
  const akhir = jumlah - pakai - rusak;

  document.getElementById(`${barang}_jumlah`).value = jumlah;
  document.getElementById(`${barang}_akhir`).value = akhir;

  sinkronQty(barang, pakai);
}

function buatMenu(){
  const tbody = document.getElementById("penjualan");

  for(let item of menuList){
    tbody.innerHTML += `
    <tr>
      <td>${item.nama}</td>
      <td>${item.harga}</td>
      <td><input id="${item.nama}_qty"></td>
      <td><input id="${item.nama}_total" readonly></td>
    </tr>`;
  }
}

function sinkronQty(barang, qty){
  const map = {
    "Kulit Besar":"Kebab Besar",
    "Kulit Sedang":"Kebab Sedang",
    "Kulit Kecil":"Kebab Kecil",
    "Keju+":"Extra Keju",
    "Roti":"Burger"
  };

  if(map[barang]){
    document.getElementById(`${map[barang]}_qty`).value = qty;
    hitungMenu(map[barang]);
  }
}

function hitungMenu(nama){
  const menu = menuList.find(x => x.nama === nama);
  const qty = Number(document.getElementById(`${nama}_qty`).value) || 0;
  const total = qty * menu.harga;

  document.getElementById(`${nama}_total`).value = total;
}

async function simpanSemua(){
  const tanggal = document.getElementById("tanggal").value;
  let totalPenjualan = 0;

  for(let barang of stokHarian){
    await simpanStok("stok_harian", barang, tanggal);
  }

  for(let barang of stokGerobak){
    await simpanStok("stok_gerobak", barang, tanggal);
  }

  for(let item of menuList){
    const qty = Number(document.getElementById(`${item.nama}_qty`).value) || 0;
    const total = qty * item.harga;

    totalPenjualan += total;

    await supabaseClient.from("penjualan").insert([{
      tanggal,
      menu:item.nama,
      harga:item.harga,
      qty,
      total
    }]);
  }

  const bonus = Number(document.getElementById("bonus").value) || 0;
  const shopee = Number(document.getElementById("shopee").value) || 0;
  const qris = Number(document.getElementById("qris").value) || 0;
  const pengeluaran = Number(document.getElementById("pengeluaran").value) || 0;
  const pengeluaran1 = Number(document.getElementById("pengeluaran1").value) || 0;
  const pengeluaran2 = Number(document.getElementById("pengeluaran2").value) || 0;
  const pengeluaran3 = Number(document.getElementById("pengeluaran3").value) || 0;
  const pengeluaran4 = Number(document.getElementById("pengeluaran4").value) || 0;
  const pengeluaran5 = Number(document.getElementById("pengeluaran5").value) || 0;

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

async function simpanStok(table, barang, tanggal){
  const sisa_awal = Number(document.getElementById(`${barang}_sisa`).value) || 0;
  const masuk = Number(document.getElementById(`${barang}_masuk`).value) || 0;
  const pakai = Number(document.getElementById(`${barang}_pakai`).value) || 0;
  const rusak = Number(document.getElementById(`${barang}_rusak`).value) || 0;

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
