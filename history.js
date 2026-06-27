window.onload = async function(){
  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal",{ascending:false});

  let html = "<table><tr><th>Tanggal</th><th>Uang Masuk</th><th>Total Pengeluaran</th><th>Sisa</th></tr>";

  data.forEach(item=>{
    html += `
    <tr>
      <td><a href="detail.html?tanggal=${item.tanggal}">${item.tanggal}</a></td>
      <td>${item.uang_masuk}</td>
      <td>${item.total_pengeluaran}</td>
      <td>${item.sisa}</td>
    </tr>`;
  });

  html += "</table>";

  document.getElementById("history-list").innerHTML = html;
}
