async function ambilStokKemarin(barang){
 const { data } = await supabaseClient
   .from('stok_harian')
   .select('*')
   .eq('barang', barang)
   .order('tanggal', { ascending:false })
   .limit(1);

 if(data.length > 0){
   return data[0].sisa_akhir;
 }

 return 0;
}