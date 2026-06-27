window.onload = async function(){
  const params = new URLSearchParams(window.location.search);
  const tanggal = params.get("tanggal");

  const { data } = await supabaseClient
    .from("keuangan")
    .select("*")
    .eq("tanggal", tanggal);

  document.getElementById("detail-data").innerHTML =
    "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
}