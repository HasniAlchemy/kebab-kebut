window.onload = async function () {
  loadHistory();
};

async function loadHistory() {
  const tbody = document.getElementById("history-table");
  tbody.innerHTML = "";

  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending: false });

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Belum ada data</td></tr>`;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.uang_masuk}</td>
        <td>${item.total_pengeluaran}</td>
        <td>${item.sisa}</td>
        <td>
          <button onclick="lihatDetail('${item.tanggal}')">Lihat</button>
        </td>
      </tr>
    `;
  });
}

function lihatDetail(tanggal) {
  window.location.href = `detail.html?tanggal=${tanggal}`;
}
