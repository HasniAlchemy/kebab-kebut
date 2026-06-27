window.onload = async function () {
  const { data: keuangan, error } = await supabaseClient
    .from("keuangan")
    .select("*")
    .order("tanggal", { ascending: false });

  console.log("History:", keuangan, error);

  const tbody = document.getElementById("history-data");
  tbody.innerHTML = "";

  if (!keuangan || keuangan.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13">Belum ada data</td>
      </tr>
    `;
    return;
  }

  keuangan.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>
          <a href="detail.html?tanggal=${item.tanggal}">
            ${item.tanggal}
          </a>
        </td>
        <td>${item.uang_masuk || 0}</td>
        <td>${item.bonus || 0}</td>
        <td>${item
