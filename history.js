window.onload = async function () {
  const { data, error } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  const tbody = document.getElementById("history-data");
  tbody.innerHTML = "";

  data.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>
          <a href="detail.html?tanggal=${item.tanggal}">
            ${item.tanggal}
          </a>
        </td>
        <td>${item.uang_masuk || 0}</td>
        <td>${item.total_pengeluaran || 0}</td>
        <td>${item.sisa || 0}</td>
      </tr>
    `;
  });
};
