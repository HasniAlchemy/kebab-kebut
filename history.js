window.onload = async function () {
  loadHistory();
};

async function loadHistory() {
  const tbody = document.getElementById("history-table");
  tbody.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending: false });

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
    const totalKeuangan =
      Number(item.total_pengeluaran || 0) +
      Number(item.bonus || 0) +
      Number(item.shopee || 0) +
      Number(item.qris || 0);

    tbody.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${Number(item.uang_masuk).toLocaleString()}</td>
        <td>${Number(totalKeuangan).toLocaleString()}</td>
        <td>${Number(item.sisa).toLocaleString()}</td>
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
