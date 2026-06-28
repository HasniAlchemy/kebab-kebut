window.onload = async function () {
  loadHistory();
};

async function loadHistory() {
  const { data, error } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending: false });

  const tbody = document.getElementById("history-body");
  tbody.innerHTML = "";

  if (error) {
    console.log(error);
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">Belum ada data</td>
      </tr>
    `;
    return;
  }

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.uang_masuk || 0}</td>
        <td>${item.total_pengeluaran || 0}</td>
        <td>${item.sisa || 0}</td>
        <td>
          <button onclick="lihatDetail('${item.tanggal}')">
            Lihat
          </button>
        </td>
      </tr>
    `;
  });
}

function lihatDetail(tanggal) {
  window.location.href = `detail.html?tanggal=${tanggal}`;
}
