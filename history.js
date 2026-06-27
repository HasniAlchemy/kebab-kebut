window.onload = async function(){
  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending:false });

  let html = "<table><tr><th>Tanggal</th><th>Shopee</th><th>QRIS</th><th>Pengeluaran</th><th>Uang Masuk</th><th>Sisa</th></tr>";

  data.forEach(item => {
    html += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.shopee}</td>
        <td>${item.qris}</td>
        <td>${item.pengeluaran}</td>
        <td>${item.uang_masuk}</td>
        <td>${item.sisa}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("history-data").innerHTML = html;
}