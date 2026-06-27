window.onload = async function () {
  const tbody = document.getElementById("history-data");
  tbody.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending: false });

  console.log("DATA HISTORY:", data);
  console.log("ERROR:", error);

  if (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13">Gagal mengambil data</td>
      </tr>
    `;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13">Belum ada data</td>
      </tr>
    `;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>
          <a href="detail.html?tanggal=${item.tanggal}">
            ${item.tanggal}
          </a>
        </td>
        <td>${Number(item.uang_masuk) || 0}</td>
        <td>${Number(item.bonus) || 0}</td>
        <td>${Number(item.shopee) || 0}</td>
        <td>${Number(item.qris) || 0}</td>
        <td>${Number(item.pengeluaran) || 0}</td>
        <td>${Number(item.pengeluaran1) || 0}</td>
        <td>${Number(item.pengeluaran2) || 0}</td>
        <td>${Number(item.pengeluaran3) || 0}</td>
        <td>${Number(item.pengeluaran4) || 0}</td>
        <td>${Number(item.pengeluaran5) || 0}</td>
        <td>${Number(item.total_pengeluaran) || 0}</td>
        <td>${Number(item.sisa) || 0}</td>
      </tr>
    `;
  });
};
