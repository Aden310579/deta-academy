/* Konten kurikulum Deta Academy. Isi body adalah HTML statis tepercaya.
   Tambah video: isi field `video` dengan link YouTube pada pelajaran. */
/* ---------- candle illustration helper ---------- */
function candles(data, opt){
  opt=opt||{};
  const w=opt.w||22, gap=opt.gap||12, H=opt.h||180, pad=16;
  const lo=Math.min(...data.map(d=>d[2])), hi=Math.max(...data.map(d=>d[1]));
  const W=pad*2+data.length*(w+gap)-gap+(opt.extraW||0);
  const y=v=>pad+(hi-v)/(hi-lo||1)*(H-pad*2);
  let s='';
  (opt.lines||[]).forEach(l=>{
    const c=l.c==='bull'?'var(--bull)':l.c==='bear'?'var(--bear)':'var(--accent)';
    if(l.zone){s+=`<rect x="0" y="${y(l.zone[1])}" width="${W}" height="${y(l.zone[0])-y(l.zone[1])}" fill="${c}" opacity=".14"/>`;}
    if(l.v!==undefined){s+=`<line x1="0" x2="${W}" y1="${y(l.v)}" y2="${y(l.v)}" stroke="${c}" stroke-dasharray="5 5" stroke-width="1.5"/>`;}
    if(l.p){s+=`<line x1="${pad+l.p[0]*(w+gap)+w/2}" y1="${y(l.p[1])}" x2="${pad+l.p[2]*(w+gap)+w/2}" y2="${y(l.p[3])}" stroke="${c}" stroke-width="2"/>`;}
    if(l.label){s+=`<text x="${W-4}" y="${y(l.v!==undefined?l.v:l.zone[1])-6}" text-anchor="end" font-size="11" font-family="JetBrains Mono, monospace" fill="${c}">${l.label}</text>`;}
  });
  data.forEach((d,i)=>{
    const [o,h,l,c]=d, x=pad+i*(w+gap), up=c>=o, col=d[4]||(up?'var(--bull)':'var(--bear)');
    const top=y(Math.max(o,c)), bh=Math.max(2,Math.abs(y(o)-y(c)));
    s+=`<line x1="${x+w/2}" x2="${x+w/2}" y1="${y(h)}" y2="${y(l)}" stroke="${col}" stroke-width="2"/>`;
    s+=`<rect x="${x}" y="${top}" width="${w}" height="${bh}" rx="2" fill="${col}"/>`;
  });
  (opt.labels||[]).forEach(t=>{
    s+=`<text x="${t.x}" y="${t.y}" font-size="12" font-family="JetBrains Mono, monospace" fill="var(--muted)" text-anchor="${t.a||'start'}">${t.t}</text>`;
  });
  return `<figure class="fig"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${opt.cap||'Ilustrasi candlestick'}">${s}</svg>${opt.cap?`<figcaption>${opt.cap}</figcaption>`:''}</figure>`;
}
const note=(t,b,k)=>`<div class="note ${k||''}"><b>${t}</b>${b}</div>`;
const table=(head,rows)=>`<div class="tbl"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td${i>0&&/^[\d$.,%+\-–:x ]+$/.test(c)?' class="n"':''}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

/* ---------- curriculum ---------- */
export const LEVELS=[
  {n:'Level 1',name:'Fondasi',slug:'pemula',school:'Kelas Pemula',c1:'#22B07F',c2:'#0C6A50',tagline:'Dari nol sampai bisa membaca chart sendiri.',outcomes:['Paham istilah pip, lot, spread, leverage, dan margin','Membaca timeframe dan struktur tren naik, turun, sideways','Mengenali pola candlestick yang paling penting'],desc:'Paham pasar, istilah, dan cara membaca grafik. Mulai dari sini kalau belum pernah trading sama sekali.',mods:['m1','m2','m3']},
  {n:'Level 2',name:'Analisa',slug:'menengah',school:'Kelas Menengah',c1:'#5B7CFF',c2:'#2B3C9E',tagline:'Membaca arah harga dan menemukan area penting.',outcomes:['Menggambar zona support dan resistance yang kuat','Mengenali pola chart dan memakai indikator dengan benar','Membaca dampak berita ekonomi ke harga'],desc:'Belajar membaca arah harga: area penting, pola, indikator, dan pengaruh berita.',mods:['m4','m5','m6','m7']},
  {n:'Level 3',name:'Eksekusi',slug:'mahir',school:'Kelas Mahir',c1:'#F2C14E',c2:'#A86F08',tagline:'Eksekusi seperti trader: terukur, disiplin, punya rencana.',outcomes:['Menghitung lot dan risiko untuk setiap posisi','Mengendalikan emosi dan menulis jurnal trading','Punya strategi H4–M15 dan trading plan tertulis'],desc:'Bagian yang menentukan bertahan atau tidak: risiko, mental, dan rencana trading sendiri.',mods:['m8','m9','m10']}
];

export const MODS={
m1:{title:'Mengenal Trading',desc:'Apa itu trading, pasar apa saja yang bisa ditradingkan, dan istilah yang wajib dipahami.',lessons:[
 {t:'Trading itu apa sebenarnya?',min:6,b:`
<p>Trading adalah aktivitas <strong>membeli dan menjual instrumen keuangan dalam jangka pendek sampai menengah</strong> untuk mengambil untung dari pergerakan harga. Bedanya dengan investasi ada di waktu dan alasan memegang aset.</p>
${table(['','Trading','Investasi'],[['Waktu pegang','Menit sampai minggu','Bulan sampai tahun'],['Dasar keputusan','Pergerakan harga (teknikal) dan momentum','Nilai bisnis atau aset (fundamental)'],['Arah','Bisa untung saat naik <em>dan</em> turun','Umumnya untung saat naik'],['Keterlibatan','Aktif memantau','Lebih pasif']])}
<h3>Dua arah: Buy dan Sell</h3>
<p>Di forex, emas (XAUUSD), dan indeks CFD, kamu bisa membuka posisi dua arah:</p>
<ul><li><strong>Buy (long)</strong>: untung kalau harga naik setelah kamu masuk.</li><li><strong>Sell (short)</strong>: untung kalau harga turun setelah kamu masuk.</li></ul>
${note('Pegang ini dari awal','Tujuan trading bukan menebak harga dengan benar setiap kali. Tujuannya adalah <strong>untung lebih besar dari rugi dalam jangka panjang</strong>. Trader profesional pun sering salah; mereka bertahan karena rugi mereka kecil.')}
<h3>Siapa yang cocok trading?</h3>
<p>Orang yang mau belajar bertahap, sabar latihan di akun demo, dan bisa menerima rugi sebagai biaya usaha. Trading bukan jalan cepat kaya. Anggap ini seperti belajar keterampilan baru: butuh jam terbang.</p>`},
 {t:'Pasar yang bisa ditradingkan',min:7,b:`
<p>Setiap pasar punya karakter sendiri: jam ramai, besar gerak harian, dan apa yang menggerakkannya.</p>
${table(['Pasar','Contoh','Karakter'],[['Forex','EURUSD, GBPUSD, USDJPY','Paling likuid, buka 24 jam Senin–Jumat, dipengaruhi suku bunga dan data ekonomi'],['Emas (komoditas)','XAUUSD','Gerak harian besar, sangat sensitif berita AS dan dolar, favorit trader Indonesia'],['Indeks','US30, NAS100','Mengikuti sentimen saham AS, ramai saat sesi New York'],['Kripto','BTCUSD, ETHUSD','Buka 24/7 termasuk akhir pekan, volatilitas sangat tinggi'],['Saham','BBCA, BBRI','Diperdagangkan di bursa (BEI), jam terbatas, umumnya hanya buy']])}
<h3>Sesi pasar (WIB)</h3>
${table(['Sesi','Jam kira-kira (WIB)','Catatan'],[['Asia (Tokyo)','06.00 – 15.00','Cenderung tenang, sering sideways'],['London','14.00 – 23.00','Volume naik, arah harian sering terbentuk'],['New York','19.00 – 04.00','Paling ramai saat tumpang tindih dengan London']])}
${note('Tips','Untuk pemula, pilih <strong>satu atau dua instrumen saja</strong> dulu. Kenali karakternya baik-baik sebelum menambah pasar lain.','ok')}`},
 {t:'Broker, akun, dan platform',min:6,b:`
<p>Untuk trading kamu butuh tiga hal: <strong>broker</strong> (perantara), <strong>akun</strong> (tempat dana), dan <strong>platform</strong> (aplikasi untuk membuka posisi dan melihat chart).</p>
<h3>Memilih broker</h3>
<ul><li><strong>Legalitas</strong>: di Indonesia, cek izin Bappebti. Broker luar negeri cek regulator seperti FCA atau ASIC.</li><li><strong>Biaya</strong>: spread, komisi, dan swap (biaya inap).</li><li><strong>Deposit dan penarikan</strong>: cepat, jelas, tanpa syarat aneh.</li><li><strong>Eksekusi</strong>: order masuk di harga yang wajar, tanpa slip berlebihan.</li></ul>
${note('Waspada','Broker atau &ldquo;mentor&rdquo; yang menjanjikan profit tetap per bulan hampir pasti penipuan. Tidak ada keuntungan pasti di trading.','warn')}
<h3>Jenis akun</h3>
<ul><li><strong>Demo</strong>: uang virtual. Wajib dipakai sampai kamu konsisten dengan rencanamu.</li><li><strong>Cent / mikro</strong>: uang asli dalam satuan kecil. Jembatan yang bagus dari demo ke real.</li><li><strong>Standar</strong>: untuk yang sudah punya rekam jejak.</li></ul>
<h3>Platform</h3>
<p><strong>MetaTrader 5 (MT5)</strong> umum dipakai untuk eksekusi. <strong>TradingView</strong> nyaman untuk analisa chart. Banyak trader analisa di TradingView lalu eksekusi di MT5.</p>`},
 {t:'Istilah wajib: pip, lot, spread, leverage, margin',min:9,b:`
<p>Istilah ini akan muncul di setiap modul. Pahami sekarang supaya tidak bingung nanti.</p>
${table(['Istilah','Arti','Contoh'],[['Pip','Satuan gerak harga terkecil yang umum dipakai','EURUSD 1.0850 → 1.0851 = 1 pip. XAUUSD 2650.00 → 2650.10 = 1 pip (konvensi umum)'],['Lot','Ukuran posisi','1 lot standar, 0.1 = mini, 0.01 = mikro'],['Spread','Selisih harga beli (ask) dan jual (bid). Biaya saat masuk','Bid 1.0850 / Ask 1.0852 = spread 2 pip'],['Leverage','Pinjaman dari broker agar posisi besar bisa dibuka dengan modal kecil','1:100 artinya $1.000 bisa membuka posisi senilai $100.000'],['Margin','Dana jaminan yang &ldquo;dikunci&rdquo; selama posisi terbuka','Posisi 1 lot EURUSD leverage 1:100 butuh margin ±$1.085'],['Stop loss (SL)','Batas rugi otomatis','Buy 1.0850, SL 1.0820 = risiko 30 pip'],['Take profit (TP)','Target untung otomatis','TP 1.0910 = target 60 pip']])}
<h3>Nilai pip</h3>
<p>Untuk pasangan yang berakhiran USD (EURUSD, GBPUSD), <strong>1 pip per 1 lot ≈ $10</strong>. Jadi 0.01 lot ≈ $0.10 per pip. Untuk XAUUSD dengan konvensi pip 0.10, 1 lot ≈ $10 per pip juga.</p>
${note('Leverage itu pisau bermata dua','Leverage tidak menambah peluang menang. Ia hanya memperbesar untung <em>dan</em> rugi. Yang menentukan risiko adalah ukuran lot dan stop loss, yang akan kita hitung di Modul 8.','warn')}`}
],quiz:[
 {q:'Kamu membuka posisi Sell di XAUUSD. Kapan kamu untung?',o:['Saat harga naik','Saat harga turun','Saat spread mengecil'],a:1,ex:'Sell (short) untung kalau harga turun setelah kamu masuk.'},
 {q:'Harga EURUSD bergerak dari 1.0850 ke 1.0875. Berapa pip?',o:['2.5 pip','25 pip','250 pip'],a:1,ex:'0.0025 dibagi 0.0001 = 25 pip.'},
 {q:'Apa fungsi leverage?',o:['Menaikkan peluang menang','Memperbesar ukuran posisi dibanding modal','Menghapus risiko rugi'],a:1,ex:'Leverage memperbesar ukuran posisi, sehingga untung maupun rugi ikut membesar.'}
]},
m2:{title:'Membaca Chart',desc:'Jenis chart, timeframe, dan cara melihat struktur pasar: naik, turun, atau sideways.',lessons:[
 {t:'Jenis chart: line, bar, candlestick',min:5,b:`
<p>Chart adalah rekaman perilaku harga. Ada tiga jenis yang paling sering dipakai:</p>
<ul><li><strong>Line chart</strong>: garis yang menghubungkan harga penutupan. Bersih, bagus untuk melihat gambaran besar.</li><li><strong>Bar chart (OHLC)</strong>: tiap batang menunjukkan Open, High, Low, Close.</li><li><strong>Candlestick</strong>: informasi sama dengan bar chart tapi lebih mudah dibaca karena badan berwarna. Ini yang akan kita pakai di seluruh kursus.</li></ul>
${candles([[10,14,9,13],[13,15,11,12],[12,13,8,9],[9,12,8,11],[11,16,10,15],[15,17,13,16],[16,18,14,14.5]],{cap:'Candlestick: hijau = harga naik dalam periode itu, merah = harga turun'})}
<p>Setiap candle mewakili satu periode waktu. Di timeframe H1, satu candle = satu jam pergerakan harga.</p>`},
 {t:'Timeframe dan cara memakainya',min:6,b:`
<p>Timeframe menentukan berapa lama satu candle terbentuk. Harga yang sama bisa terlihat naik di satu timeframe dan turun di timeframe lain.</p>
${table(['Timeframe','Satu candle','Dipakai untuk'],[['M5, M15','5 / 15 menit','Scalping dan mencari titik entry'],['H1, H4','1 / 4 jam','Intraday dan swing pendek, menentukan arah harian'],['D1','1 hari','Swing, melihat tren besar'],['W1','1 minggu','Gambaran sangat besar, level penting jangka panjang']])}
<h3>Aturan tiga lapis</h3>
<p>Biasakan melihat dari besar ke kecil:</p>
<ol><li><strong>Timeframe besar</strong> (D1/H4): ke mana arah utama?</li><li><strong>Timeframe menengah</strong> (H1): di mana area penting terdekat?</li><li><strong>Timeframe kecil</strong> (M15/M5): di mana titik masuk yang presisi?</li></ol>
${note('Contoh','Arah H4 naik, harga turun ke area support di H1, lalu di M15 muncul candle penolakan. Itu setup buy yang searah dengan tren besar.','ok')}`},
 {t:'Struktur pasar: uptrend, downtrend, sideways',min:8,b:`
<p>Sebelum memikirkan indikator atau pola, jawab dulu satu pertanyaan: <strong>pasar sedang bergerak ke mana?</strong></p>
<ul><li><strong>Uptrend</strong>: membentuk <em>Higher High</em> (HH) dan <em>Higher Low</em> (HL). Puncak dan lembah makin tinggi.</li><li><strong>Downtrend</strong>: membentuk <em>Lower High</em> (LH) dan <em>Lower Low</em> (LL).</li><li><strong>Sideways (range)</strong>: harga mondar-mandir di antara batas atas dan bawah.</li></ul>
${candles([[10,11,9,10.8],[10.8,13,10.5,12.6],[12.6,13.2,11,11.4],[11.4,12,10.8,11.8],[11.8,15,11.6,14.6],[14.6,15.2,13,13.3],[13.3,14,12.6,13.8],[13.8,17,13.6,16.6]],{cap:'Uptrend: tiap lembah (HL) lebih tinggi dari lembah sebelumnya',lines:[{p:[0,9,6,12.6],c:'bull'}]})}
<h3>Kapan tren dianggap berubah?</h3>
<p>Uptrend mulai rusak saat harga <strong>menembus Higher Low terakhir</strong> ke bawah. Ini disebut <em>break of structure</em>. Sebaliknya untuk downtrend: perhatikan saat harga menembus Lower High terakhir ke atas.</p>
${note('Aturan sederhana pemula','Di uptrend, fokus cari buy. Di downtrend, fokus cari sell. Saat sideways, kurangi trading atau main di batas range saja.')}`}
],quiz:[
 {q:'Satu candle di timeframe H4 mewakili...',o:['4 menit','4 jam','4 hari'],a:1,ex:'H = hour. H4 berarti satu candle terbentuk dalam 4 jam.'},
 {q:'Ciri uptrend adalah...',o:['Lower High dan Lower Low','Higher High dan Higher Low','Harga datar di satu level'],a:1,ex:'Uptrend membentuk puncak dan lembah yang makin tinggi.'},
 {q:'Urutan analisa yang disarankan adalah...',o:['Timeframe kecil ke besar','Timeframe besar ke kecil','Cukup satu timeframe'],a:1,ex:'Tentukan arah di timeframe besar, lalu cari entry di timeframe kecil.'}
]},
m3:{title:'Candlestick',desc:'Membaca anatomi candle dan pola yang menunjukkan siapa yang sedang menang: pembeli atau penjual.',lessons:[
 {t:'Anatomi satu candle',min:5,b:`
<p>Setiap candle punya empat harga: <strong>Open</strong> (buka), <strong>High</strong> (tertinggi), <strong>Low</strong> (terendah), <strong>Close</strong> (tutup).</p>
${candles([[10,16,8,14.5],[14.5,15.5,7.5,9]],{w:46,gap:120,h:220,extraW:150,cap:'Kiri: candle naik (bullish). Kanan: candle turun (bearish)',labels:[{x:70,y:20,t:'← High'},{x:70,y:53,t:'← Close'},{x:70,y:153,t:'← Open'},{x:70,y:200,t:'← Low'},{x:236,y:53,t:'← Open'},{x:236,y:175,t:'← Close'}]})}
<ul><li><strong>Badan (body)</strong>: jarak Open ke Close. Badan besar = satu pihak dominan.</li><li><strong>Ekor / sumbu (wick)</strong>: harga sempat ke sana tapi ditolak.</li></ul>
${note('Cara membaca','Ekor bawah yang panjang berarti penjual sempat menekan harga turun, tapi pembeli berhasil mendorongnya kembali naik. Itu tanda penolakan dari bawah.')}`},
 {t:'Pola satu candle: pin bar, doji, marubozu',min:7,b:`
${candles([[12,12.6,6,12.3],[10,13,7,10.1],[8,14.6,7.9,14.5],[14,14.3,8,8.2]],{w:30,gap:60,h:190,cap:'Dari kiri: pin bar bullish, doji, marubozu bullish, marubozu bearish'})}
${table(['Pola','Bentuk','Arti'],[['Pin bar (hammer)','Badan kecil di atas, ekor bawah panjang (≥2x badan)','Penolakan harga rendah. Potensi naik bila muncul di support'],['Shooting star','Badan kecil di bawah, ekor atas panjang','Penolakan harga tinggi. Potensi turun bila muncul di resistance'],['Doji','Open ≈ Close, ekor dua arah','Ragu-ragu. Pasar menunggu arah'],['Marubozu','Badan penuh hampir tanpa ekor','Satu pihak sangat dominan, momentum kuat']])}
${note('Lokasi lebih penting dari bentuk','Pin bar di tengah-tengah chart tidak berarti banyak. Pin bar tepat di area support yang kuat itu baru menarik. Pola selalu dibaca bersama lokasinya.','warn')}`},
 {t:'Pola beberapa candle: engulfing, star, inside bar',min:8,b:`
${candles([[13,13.5,11,11.5],[11.5,12,10.5,11],[10.8,14,10.6,13.8],[13.8,15,13.5,14.8]],{w:28,gap:22,cap:'Bullish engulfing: candle hijau menelan badan candle merah sebelumnya'})}
<ul><li><strong>Bullish engulfing</strong>: candle naik yang badannya menelan penuh badan candle turun sebelumnya. Pembeli mengambil alih.</li><li><strong>Bearish engulfing</strong>: kebalikannya, muncul di puncak.</li><li><strong>Morning star</strong>: turun besar, candle kecil (ragu), lalu naik besar. Pola pembalikan naik.</li><li><strong>Evening star</strong>: kebalikan morning star di puncak.</li><li><strong>Inside bar</strong>: candle yang seluruhnya berada di dalam range candle sebelumnya. Tanda kompresi, sering diikuti ledakan harga.</li></ul>
${candles([[15,15.4,11,11.4],[11.3,11.8,10.4,11],[11.1,14.8,11,14.6]],{w:28,gap:22,cap:'Morning star: tiga candle, pembalikan dari bawah'})}
${note('Konfirmasi','Tunggu candle pola <strong>selesai (close)</strong> sebelum mengambil keputusan. Candle yang belum close bisa berubah bentuk total.')}`}
],quiz:[
 {q:'Ekor atas yang panjang di area resistance menunjukkan...',o:['Pembeli sangat kuat','Penolakan dari atas, potensi turun','Pasar akan sideways selamanya'],a:1,ex:'Harga sempat naik tapi ditolak dan ditutup jauh di bawah. Itu shooting star.'},
 {q:'Kapan sebaiknya mengambil keputusan dari pola candle?',o:['Saat candle masih berjalan','Setelah candle close','Kapan saja'],a:1,ex:'Candle yang belum close bisa berubah bentuk.'},
 {q:'Bullish engulfing artinya...',o:['Candle naik menelan badan candle turun sebelumnya','Dua candle doji berturut-turut','Candle tanpa ekor'],a:0,ex:'Itu tanda pembeli mengambil alih kendali.'}
]},
m4:{title:'Support & Resistance',desc:'Menemukan area di mana harga sering berbalik, cara menggambarnya, dan memanfaatkan breakout.',lessons:[
 {t:'Konsep support dan resistance',min:6,b:`
<p><strong>Support</strong> adalah area di bawah harga tempat pembeli biasanya muncul. <strong>Resistance</strong> adalah area di atas harga tempat penjual biasanya muncul.</p>
${candles([[11,12,10.2,11.6],[11.6,14.6,11.4,14.2],[14.2,14.9,12.6,12.9],[12.9,13.4,10.3,10.8],[10.8,13,10.1,12.7],[12.7,14.8,12.3,14.1],[14.1,14.7,12,12.2],[12.2,12.6,10.2,11.9]],{cap:'Harga memantul berkali-kali di area yang sama',lines:[{zone:[14.2,14.9],c:'bear',label:'RESISTANCE'},{zone:[10.1,10.8],c:'bull',label:'SUPPORT'}]})}
<h3>Kenapa area ini bekerja?</h3>
<p>Karena banyak trader melihat level yang sama dan menaruh order di sana. Selain itu ada &ldquo;ingatan pasar&rdquo;: trader yang tertinggal di level itu ingin masuk atau keluar saat harga kembali.</p>
${note('Gunakan zona, bukan garis','Harga jarang berbalik tepat di satu angka. Gambar support dan resistance sebagai <strong>zona</strong> dengan ketebalan beberapa pip.')}`},
 {t:'Cara menggambar zona yang benar',min:7,b:`
<ol><li>Mulai dari timeframe <strong>H4 atau D1</strong>.</li><li>Cari area tempat harga <strong>berbalik tajam</strong> minimal dua kali.</li><li>Tarik zona dari ujung badan sampai ujung ekor candle di area itu.</li><li>Pilih maksimal <strong>2–3 zona</strong> terdekat di atas dan di bawah harga sekarang.</li><li>Turun ke timeframe kecil hanya untuk mencari entry.</li></ol>
<h3>Zona mana yang kuat?</h3>
${table(['Lebih kuat','Lebih lemah'],[['Dari timeframe besar (D1, H4)','Dari timeframe kecil (M5)'],['Harga pergi dengan cepat dari zona','Harga lama berputar di zona'],['Baru diuji 1–2 kali','Sudah diuji berkali-kali (makin tipis)'],['Bertepatan dengan angka bulat, misal 2650.00','Di angka acak']])}
${note('Kesalahan umum','Chart penuh garis. Kalau semua tempat adalah support, tidak ada yang benar-benar support. Lebih sedikit lebih jelas.','warn')}`},
 {t:'Breakout, retest, dan false break',min:8,b:`
<p>Support dan resistance tidak bertahan selamanya. Saat jebol, peran mereka sering <strong>bertukar</strong>: resistance yang tembus menjadi support baru.</p>
${candles([[10,11.4,9.8,11],[11,12.3,10.8,12],[12,12.4,10.9,11.2],[11.2,12.3,11,12.1],[12.1,14.4,12,14.2],[14.2,14.5,12.3,12.6],[12.6,15.2,12.4,15],[15,16.6,14.7,16.3]],{cap:'Breakout resistance, retest dari atas, lalu lanjut naik',lines:[{zone:[12,12.4],c:'accent',label:'RESISTANCE → SUPPORT'}]})}
<h3>Tiga cara masuk</h3>
<ul><li><strong>Breakout langsung</strong>: masuk saat candle close kuat di luar zona. Cepat, tapi rawan jebakan.</li><li><strong>Breakout + retest</strong>: tunggu harga kembali menguji zona lalu ditolak. Lebih aman, kadang ketinggalan.</li><li><strong>False break</strong>: harga menembus sebentar lalu kembali masuk. Ini sinyal ke arah sebaliknya.</li></ul>
${note('Ciri breakout yang sehat','Candle close dengan badan besar di luar zona, bukan cuma ekor. Lebih baik lagi bila searah tren timeframe besar.','ok')}`}
],quiz:[
 {q:'Resistance yang sudah ditembus dengan kuat sering berubah menjadi...',o:['Support baru','Resistance yang lebih kuat','Tidak berarti apa-apa'],a:0,ex:'Peran berbalik: resistance lama menjadi support baru.'},
 {q:'Mengapa support digambar sebagai zona?',o:['Agar chart terlihat rapi','Harga jarang berbalik tepat di satu angka','Karena aturan broker'],a:1,ex:'Order trader tersebar di sekitar level, bukan di satu titik.'},
 {q:'Zona mana yang umumnya lebih kuat?',o:['Zona dari M5','Zona dari D1 yang ditinggalkan harga dengan cepat','Zona yang sudah diuji 8 kali'],a:1,ex:'Zona timeframe besar dengan reaksi tajam paling bisa diandalkan.'}
]},
m5:{title:'Trendline & Chart Pattern',desc:'Menarik trendline dan channel, serta mengenali pola pembalikan dan pola lanjutan.',lessons:[
 {t:'Trendline dan channel',min:6,b:`
<p>Trendline menghubungkan minimal <strong>dua lembah</strong> di uptrend, atau dua puncak di downtrend. Sentuhan ketiga yang bertahan adalah konfirmasi.</p>
<ul><li>Tarik dari ekor ke ekor, atau badan ke badan. Pilih satu dan konsisten.</li><li>Jangan memaksa garis menyentuh semua candle.</li><li><strong>Channel</strong>: tarik garis paralel di sisi puncak. Harga cenderung bergerak di antara keduanya.</li></ul>
${candles([[10,10.6,9.6,10.4],[10.4,12.4,10.2,12],[12,12.4,10.8,11.1],[11.1,13.6,11,13.2],[13.2,13.5,12,12.2],[12.2,14.8,12.1,14.5],[14.5,14.7,13.1,13.3],[13.3,15.6,13.2,15.4]],{cap:'Trendline naik menyambung lembah-lembah yang makin tinggi',lines:[{p:[0,9.6,6,13.1],c:'bull'},{p:[1,12.4,7,15.6],c:'accent'}]})}
${note('Ingat','Trendline adalah alat bantu, bukan dinding. Tembusnya trendline belum tentu tren berakhir. Konfirmasi dengan struktur (HH/HL) dari Modul 2.')}`},
 {t:'Pola pembalikan: double top, head & shoulders',min:7,b:`
<p>Pola pembalikan muncul di <strong>ujung tren</strong> dan menandakan tenaga mulai habis.</p>
${table(['Pola','Ciri','Konfirmasi'],[['Double top','Dua puncak di level hampir sama setelah uptrend','Harga close di bawah lembah di antara dua puncak (neckline)'],['Double bottom','Dua lembah sejajar setelah downtrend','Close di atas neckline'],['Head & shoulders','Puncak kiri, puncak tengah lebih tinggi, puncak kanan lebih rendah','Close di bawah neckline'],['Inverse H&S','Kebalikannya di dasar','Close di atas neckline']])}
<h3>Mengukur target</h3>
<p>Ukur jarak dari puncak (head) ke neckline, lalu proyeksikan dari titik tembus neckline. Ini perkiraan, bukan jaminan.</p>
${note('Jangan mendahului','Banyak pemula sell di puncak kedua sebelum neckline tembus. Tanpa tembus neckline, itu belum double top, mungkin hanya koreksi biasa.','warn')}`},
 {t:'Pola lanjutan: flag, pennant, triangle',min:6,b:`
<p>Pola lanjutan adalah <strong>jeda istirahat</strong> di tengah tren sebelum harga melanjutkan arahnya.</p>
<ul><li><strong>Flag</strong>: gerak tajam (tiang), lalu koreksi miring kecil berlawanan arah. Tembus bendera = lanjut.</li><li><strong>Pennant</strong>: mirip flag tetapi koreksinya menyempit seperti segitiga kecil.</li><li><strong>Ascending triangle</strong>: puncak datar, lembah makin tinggi. Biasanya tembus ke atas.</li><li><strong>Descending triangle</strong>: lembah datar, puncak makin rendah. Biasanya tembus ke bawah.</li></ul>
${candles([[10,10.5,9.8,10.3],[10.3,12.6,10.2,12.4],[12.4,14.8,12.3,14.6],[14.6,14.8,13.8,14],[14,14.3,13.3,13.5],[13.5,13.8,12.9,13.1],[13.1,15.8,13,15.6],[15.6,17,15.4,16.8]],{cap:'Bull flag: tiang naik, koreksi kecil, lalu lanjut',lines:[{p:[2,14.8,5,13.8],c:'accent'},{p:[3,13.8,5,12.9],c:'accent'}]})}`}
],quiz:[
 {q:'Double top dianggap terkonfirmasi ketika...',o:['Puncak kedua terbentuk','Harga close di bawah neckline','Muncul doji di puncak'],a:1,ex:'Tanpa tembus neckline, polanya belum selesai.'},
 {q:'Flag termasuk jenis pola...',o:['Pembalikan','Lanjutan','Sideways permanen'],a:1,ex:'Flag adalah jeda sebelum tren berlanjut.'},
 {q:'Berapa titik minimum untuk menarik trendline?',o:['Satu','Dua','Lima'],a:1,ex:'Dua titik membentuk garis, sentuhan ketiga mengonfirmasi.'}
]},
m6:{title:'Indikator',desc:'Moving average, RSI, MACD, ATR, dan Bollinger Bands. Dipakai sebagai alat bantu, bukan tongkat sihir.',lessons:[
 {t:'Moving Average (MA)',min:7,b:`
<p>Moving average adalah rata-rata harga dalam sejumlah candle terakhir. Fungsinya <strong>merapikan noise</strong> agar arah lebih jelas.</p>
${table(['Jenis','Kelebihan','Setelan populer'],[['SMA (simple)','Halus, cocok tren jangka panjang','SMA 200 di D1'],['EMA (exponential)','Lebih cepat merespons harga terbaru','EMA 20, 50, 200']])}
<h3>Cara pakai</h3>
<ul><li><strong>Filter arah</strong>: harga di atas EMA 200 → fokus buy. Di bawah → fokus sell.</li><li><strong>Support dinamis</strong>: di tren kuat, harga sering memantul di EMA 20 atau 50.</li><li><strong>Persilangan</strong>: EMA cepat memotong EMA lambat ke atas (golden cross) atau ke bawah (death cross). Sinyal ini lambat, pakai sebagai konfirmasi.</li></ul>
${note('Kelemahan','MA bekerja bagus saat tren, tapi memberi banyak sinyal palsu saat pasar sideways.','warn')}`},
 {t:'RSI dan MACD: membaca momentum',min:8,b:`
<h3>RSI (Relative Strength Index)</h3>
<p>Skala 0–100 yang mengukur kekuatan gerak. Setelan umum: periode 14.</p>
<ul><li>Di atas <span class="mono">70</span>: overbought (sudah naik banyak).</li><li>Di bawah <span class="mono">30</span>: oversold (sudah turun banyak).</li><li><strong>Divergence</strong>: harga membuat high baru tapi RSI tidak. Tanda tenaga melemah.</li></ul>
${note('Salah kaprah','Overbought bukan perintah sell. Di uptrend kuat, RSI bisa bertahan di atas 70 sangat lama. Gunakan RSI untuk timing di arah tren, bukan untuk melawan tren.','warn')}
<h3>MACD</h3>
<p>Terdiri dari garis MACD, garis sinyal, dan histogram. Setelan umum 12, 26, 9.</p>
<ul><li>MACD memotong sinyal ke atas: momentum naik menguat.</li><li>Histogram mengecil: momentum melambat.</li><li>MACD di atas nol: bias naik. Di bawah nol: bias turun.</li></ul>`},
 {t:'ATR dan Bollinger Bands: membaca volatilitas',min:6,b:`
<h3>ATR (Average True Range)</h3>
<p>ATR mengukur <strong>rata-rata jarak gerak per candle</strong>. Tidak memberi arah, tapi sangat berguna untuk menentukan jarak stop loss.</p>
${note('Contoh','ATR 14 di XAUUSD M15 = 3.20. Stop loss 1.5 × ATR = 4.80 (48 pip). Stop yang terlalu dekat dari ATR akan sering kena oleh gerak normal.','ok')}
<h3>Bollinger Bands</h3>
<p>Tiga garis: MA 20 di tengah, dan dua band 2 standar deviasi di atas dan bawah.</p>
<ul><li><strong>Squeeze</strong>: band menyempit, pasar sedang tenang dan sering diikuti ledakan.</li><li>Saat tren kuat, harga bisa &ldquo;berjalan&rdquo; menempel di band atas atau bawah.</li></ul>`},
 {t:'Jangan kebanyakan indikator',min:4,b:`
<p>Hampir semua indikator dihitung dari harga yang sama. Memasang lima indikator momentum sama saja dengan menanyakan hal yang sama lima kali.</p>
<h3>Satu dari tiap keluarga sudah cukup</h3>
${table(['Keluarga','Pilih salah satu'],[['Tren','EMA 50 / EMA 200'],['Momentum','RSI atau MACD'],['Volatilitas','ATR atau Bollinger']])}
${note('Prinsip','Harga dan struktur (Modul 2–5) adalah bahan utama. Indikator hanya bumbu untuk konfirmasi.')}`}
],quiz:[
 {q:'RSI di atas 70 pada uptrend kuat berarti...',o:['Wajib sell sekarang','Momentum kuat; bukan otomatis sinyal sell','Indikator rusak'],a:1,ex:'Overbought bisa bertahan lama saat tren kuat.'},
 {q:'Indikator yang paling cocok untuk menentukan jarak stop loss adalah...',o:['ATR','RSI','MACD'],a:0,ex:'ATR mengukur rata-rata jarak gerak, cocok untuk ukuran SL.'},
 {q:'Harga di bawah EMA 200 di timeframe besar memberi bias...',o:['Buy','Sell','Netral'],a:1,ex:'EMA 200 sering dipakai sebagai filter arah.'}
]},
m7:{title:'Fundamental & Berita',desc:'Kalender ekonomi, data yang paling menggerakkan pasar, dan cara aman trading di sekitar berita.',lessons:[
 {t:'Kalender ekonomi',min:5,b:`
<p>Kalender ekonomi berisi jadwal rilis data dan pidato bank sentral. Cek setiap pagi sebelum membuka chart.</p>
<ul><li>Fokus pada berita berdampak <strong>tinggi</strong> (biasanya ditandai merah).</li><li>Perhatikan mata uang yang terkait instrumenmu. XAUUSD dan semua pair USD bereaksi kuat pada data AS.</li><li>Bandingkan angka <strong>aktual</strong> dengan <strong>perkiraan</strong> (forecast). Selisihnya yang menggerakkan harga.</li></ul>`},
 {t:'Data yang paling menggerakkan pasar',min:7,b:`
${table(['Data','Isi','Dampak umum ke USD'],[['Suku bunga Fed (FOMC)','Keputusan bunga dan arah kebijakan','Naik / hawkish → USD menguat, emas cenderung tertekan'],['CPI (inflasi)','Kenaikan harga konsumen','Lebih tinggi dari perkiraan → USD menguat'],['NFP','Penambahan lapangan kerja AS, Jumat pertama tiap bulan','Lebih tinggi dari perkiraan → USD menguat'],['GDP','Pertumbuhan ekonomi','Lebih kuat → USD menguat'],['Pidato Ketua Fed','Petunjuk kebijakan ke depan','Bisa menggerakkan pasar tajam']])}
${note('Emas dan dolar','Emas dihargai dalam USD, jadi seringkali bergerak <strong>berlawanan</strong> dengan dolar. Data AS yang kuat biasanya menekan XAUUSD, meski tidak selalu.')}`},
 {t:'Trading di sekitar berita',min:5,b:`
<p>Saat berita besar rilis, spread melebar dan harga bisa melompat puluhan pip dalam hitungan detik.</p>
<ul><li><strong>Pemula</strong>: hindari membuka posisi baru 15–30 menit sebelum dan sesudah berita high impact.</li><li>Posisi yang sudah jalan: pertimbangkan geser SL ke titik impas atau ambil sebagian profit.</li><li>Tunggu debu mengendap. Arah yang muncul setelah 15–30 menit sering lebih jujur dari lonjakan pertama.</li></ul>
${note('Slippage','Order stop loss bisa tereksekusi lebih jauh dari harga yang kamu pasang saat berita. Ini nyata dan sering terjadi.','warn')}`}
],quiz:[
 {q:'Data NFP dirilis lebih tinggi dari perkiraan. Dampak umumnya ke USD?',o:['Melemah','Menguat','Tidak ada'],a:1,ex:'Data tenaga kerja yang kuat biasanya mendukung USD.'},
 {q:'Apa yang terjadi pada spread saat berita besar?',o:['Melebar','Menyempit','Selalu nol'],a:0,ex:'Likuiditas tipis saat rilis membuat spread melebar.'},
 {q:'Yang menggerakkan harga saat rilis data adalah...',o:['Angka aktual saja','Selisih aktual dengan perkiraan','Warna di kalender'],a:1,ex:'Pasar sudah memperhitungkan perkiraan; kejutanlah yang menggerakkan.'}
]},
m8:{title:'Manajemen Risiko',desc:'Bagian terpenting. Menghitung lot, memasang stop loss, dan menjaga akun tetap hidup.',lessons:[
 {t:'Aturan 1–2% per trade',min:6,b:`
<p>Risiko per posisi dibatasi <strong>1–2% dari saldo</strong>. Tujuannya sederhana: agar serangkaian kekalahan tidak menghancurkan akun.</p>
${table(['Kalah beruntun','Risiko 1%','Risiko 10%'],[['5 kali','−4.9%','−41%'],['10 kali','−9.6%','−65%'],['20 kali','−18%','−88%']])}
<p>Dengan risiko 1%, sepuluh kali kalah beruntun masih menyisakan 90% modal. Dengan 10%, akun sudah hampir habis.</p>
${note('Matematika pemulihan','Rugi 50% butuh untung 100% untuk kembali ke modal awal. Mencegah rugi besar jauh lebih mudah daripada memulihkannya.','warn')}`},
 {t:'Menghitung ukuran lot',min:8,calc:true,b:`
<p>Rumusnya:</p>
<p class="mono" style="font-size:15px;background:var(--surface-2);padding:12px 14px;border-radius:10px">Lot = (Saldo × Risiko%) ÷ (Stop loss dalam pip × Nilai pip per lot)</p>
<h3>Contoh</h3>
<p>Saldo $1.000, risiko 1% = $10. Stop loss 25 pip di EURUSD (nilai pip $10 per lot).<br>Lot = 10 ÷ (25 × 10) = <strong>0.04 lot</strong>.</p>
${note('Urutan yang benar','Tentukan dulu lokasi stop loss dari chart, baru hitung lot. Jangan kebalikannya: memasang SL sempit demi bisa memakai lot besar.')}`},
 {t:'Stop loss, take profit, dan risk:reward',min:7,b:`
<h3>Di mana memasang stop loss?</h3>
<ul><li>Di <strong>luar</strong> zona support/resistance, bukan di dalamnya.</li><li>Di balik swing low (untuk buy) atau swing high (untuk sell) terakhir.</li><li>Beri ruang sekitar 1–1.5 × ATR agar tidak tersentuh noise.</li></ul>
<h3>Risk:Reward (R:R)</h3>
<p>Perbandingan potensi rugi dengan potensi untung. R:R 1:2 berarti mempertaruhkan $10 untuk target $20.</p>
${table(['R:R','Win rate minimal agar impas'],[['1:1','50%'],['1:2','33%'],['1:3','25%']])}
${note('Kunci','Dengan R:R 1:2, kamu tetap untung walau hanya benar 4 dari 10 kali. Inilah alasan trader profesional bisa salah lebih sering daripada benar.','ok')}`},
 {t:'Drawdown dan batas harian',min:5,b:`
<p><strong>Drawdown</strong> adalah penurunan saldo dari puncak tertinggi. Semua trader mengalaminya; yang penting adalah membatasinya.</p>
<ul><li><strong>Batas rugi harian</strong>: misal 3%. Tercapai = tutup platform, lanjut besok.</li><li><strong>Batas rugi mingguan</strong>: misal 6%. Tercapai = evaluasi jurnal sebelum trading lagi.</li><li><strong>Maksimal posisi bersamaan</strong>: misal 2. Hindari dua posisi yang sebenarnya sama (misal buy EURUSD dan buy GBPUSD sekaligus).</li></ul>
${note('Aturan tertulis','Tulis batas ini di trading plan sebelum mulai. Keputusan dibuat saat kepala dingin, bukan saat sedang rugi.')}`}
],quiz:[
 {q:'Saldo $2.000, risiko 1%, SL 20 pip, nilai pip $10/lot. Berapa lot?',o:['0.01','0.10','1.00'],a:1,ex:'$20 ÷ (20 × $10) = 0.10 lot.'},
 {q:'Dengan R:R 1:3, win rate minimal untuk impas adalah...',o:['25%','50%','75%'],a:0,ex:'1 menang menutup 3 kalah: 1 dari 4 = 25%.'},
 {q:'Langkah yang benar adalah...',o:['Tentukan lot dulu, lalu sesuaikan SL','Tentukan SL dari chart, lalu hitung lot','Tidak perlu SL kalau yakin'],a:1,ex:'Lokasi SL ditentukan struktur pasar; lot menyesuaikan.'}
]},
m9:{title:'Psikologi Trading',desc:'Mengendalikan FOMO, balas dendam, dan overtrading. Membangun disiplin dengan jurnal.',lessons:[
 {t:'Musuh utama: FOMO, revenge, overtrade',min:6,b:`
${table(['Musuh','Gejala','Penangkal'],[['FOMO','Masuk terlambat karena takut ketinggalan harga yang sudah lari','Peluang selalu datang lagi. Masuk hanya di area rencana'],['Revenge trading','Langsung entry lagi dengan lot lebih besar setelah rugi','Batas rugi harian dan jeda 30 menit setelah kalah'],['Overtrading','Membuka posisi karena bosan, bukan karena setup','Batasi jumlah trade per hari'],['Takut menarik pelatuk','Setup valid tapi ragu masuk','Kecilkan lot sampai rasa takutnya hilang']])}
${note('Kenyataan','Kebanyakan akun habis bukan karena strategi yang buruk, tapi karena satu-dua hari emosi yang tidak terkendali.','warn')}`},
 {t:'Membangun disiplin',min:5,b:`
<ul><li><strong>Rutinitas sebelum trading</strong>: cek kalender, tandai zona, tulis skenario buy dan sell.</li><li><strong>Checklist entry</strong>: semua syarat terpenuhi atau tidak masuk. Tidak ada &ldquo;hampir&rdquo;.</li><li><strong>Atur alarm harga</strong>, lalu tinggalkan chart. Menatap chart terus memancing entry impulsif.</li><li><strong>Pikirkan dalam seri</strong>: hasil satu trade tidak penting. Yang penting hasil 50–100 trade.</li></ul>
${note('Kalimat pegangan','Tugasku adalah menjalankan rencana dengan benar. Hasil per trade bukan kendaliku.','ok')}`},
 {t:'Jurnal trading',min:6,b:`
<p>Jurnal adalah cermin. Tanpa jurnal, kamu akan mengulang kesalahan yang sama tanpa sadar.</p>
${table(['Kolom','Contoh isi'],[['Tanggal & instrumen','21 Nov · XAUUSD'],['Setup','Pin bar di support H1, arah H4 naik'],['Entry / SL / TP','2652.40 / 2647.90 / 2661.40'],['Hasil (R)','+2R'],['Ikut rencana?','Ya'],['Emosi','Tenang, sedikit ragu saat entry'],['Pelajaran','Tunggu close candle, sudah benar']])}
<p>Evaluasi setiap akhir pekan: setup mana yang paling menguntungkan? Kesalahan apa yang paling sering terulang?</p>`}
],quiz:[
 {q:'Kamu baru rugi dan ingin langsung entry lagi dengan lot dua kali lipat. Ini disebut...',o:['Scaling in','Revenge trading','Hedging'],a:1,ex:'Revenge trading adalah upaya membalas rugi secara emosional.'},
 {q:'Cara paling efektif mengenali kesalahan berulang adalah...',o:['Mengingat-ingat saja','Menulis jurnal dan mengevaluasinya','Ganti strategi setiap minggu'],a:1,ex:'Jurnal membuat pola kesalahan terlihat.'},
 {q:'Setup valid tapi kamu takut masuk. Solusi yang disarankan...',o:['Perbesar lot','Kecilkan lot','Berhenti trading selamanya'],a:1,ex:'Lot kecil menurunkan tekanan emosional.'}
]},
m10:{title:'Strategi & Trading Plan',desc:'Menyatukan semuanya: strategi multi-timeframe, trading plan tertulis, backtest, lalu mulai live.',lessons:[
 {t:'Strategi multi-timeframe: H4 arah, M15 entry',min:9,b:`
<p>Ini kerangka sederhana yang menggabungkan semua modul sebelumnya.</p>
<ol><li><strong>H4: tentukan arah.</strong> Struktur HH/HL dan harga di atas EMA 50 → hanya cari buy. Kebalikannya → hanya cari sell.</li><li><strong>H1: tandai zona.</strong> Support/resistance terdekat searah arah H4.</li><li><strong>M15: tunggu pemicu.</strong> Saat harga masuk zona, tunggu pin bar atau engulfing yang close searah arah H4.</li><li><strong>Eksekusi.</strong> SL di balik ekor pola atau zona (+ ruang ATR). TP minimal 2R, atau di zona berikutnya.</li><li><strong>Kelola.</strong> Di +1R, geser SL ke titik impas.</li></ol>
${candles([[14,14.3,12.8,13],[13,13.2,11.6,11.8],[11.8,12,10.6,10.9],[10.9,11.1,9.2,10.8],[10.8,12.6,10.6,12.4],[12.4,13.8,12.2,13.6],[13.6,15,13.4,14.8]],{cap:'M15: harga turun ke zona support H1, pin bar, lalu naik searah H4',lines:[{zone:[9.6,10.9],c:'bull',label:'ZONA H1'},{v:9,c:'bear',label:'SL'},{v:14.8,c:'accent',label:'TP 2R'}]})}
${note('Kalau ragu','Tidak ada setup = tidak ada trade. Melewatkan peluang tidak membuatmu rugi.')}`},
 {t:'Menyusun trading plan tertulis',min:7,b:`
<p>Trading plan adalah aturan main pribadi. Tulis dan simpan di tempat yang terlihat saat trading.</p>
${table(['Bagian','Isi'],[['Instrumen','Misal: XAUUSD dan EURUSD saja'],['Jam trading','Misal: 14.00–23.00 WIB (London & awal NY)'],['Setup','Syarat entry yang jelas dan bisa dicentang'],['Risiko','1% per trade, maksimal 2 posisi, batas harian 3%'],['Manajemen posisi','BE di +1R, TP di 2R atau zona berikutnya'],['Berita','Tidak entry 30 menit sebelum/sesudah high impact'],['Evaluasi','Review jurnal setiap Sabtu']])}`},
 {t:'Backtest dan akun demo',min:6,b:`
<p>Sebelum memakai uang asli, buktikan dulu strategimu.</p>
<ol><li><strong>Backtest</strong>: putar mundur chart (fitur Replay di TradingView), lalu jalankan aturanmu candle demi candle. Catat minimal <strong>50 trade</strong>.</li><li><strong>Forward test di demo</strong>: jalankan rencana secara real-time selama 1–2 bulan.</li><li><strong>Hitung</strong>: win rate, rata-rata R, drawdown maksimum, dan berapa kali kamu melanggar aturan.</li></ol>
${table(['Metrik','Target minimal sehat'],[['Jumlah sampel','≥ 50 trade'],['Expectancy','> 0.2R per trade'],['Drawdown maksimum','< 15%'],['Kepatuhan rencana','> 90%']])}`},
 {t:'Mulai live dengan aman',min:5,b:`
<ul><li>Mulai dari <strong>akun cent atau lot terkecil</strong>, walau di demo sudah konsisten. Emosi uang asli berbeda.</li><li>Pertahankan risiko yang sama seperti di demo. Naikkan ukuran hanya setelah 2–3 bulan konsisten.</li><li>Tarik sebagian profit secara berkala.</li><li>Terus menulis jurnal. Kurikulum ini selesai, tapi belajar tidak.</li></ul>
${note('Selamat','Kamu sudah menempuh jalur dari nol: pasar, chart, candle, area penting, indikator, berita, risiko, mental, dan rencana. Sekarang tinggal jam terbang.','ok')}`}
],quiz:[
 {q:'Dalam kerangka H4–M15, timeframe H4 dipakai untuk...',o:['Menentukan arah','Mencari pemicu entry','Menghitung lot'],a:0,ex:'H4 menentukan arah; M15 untuk timing.'},
 {q:'Berapa sampel trade minimal yang disarankan untuk backtest?',o:['5','20','50'],a:2,ex:'Sampel kecil belum mewakili kinerja strategi.'},
 {q:'Setelah konsisten di demo, langkah selanjutnya yang aman adalah...',o:['Langsung lot besar di akun real','Mulai dengan akun cent atau lot terkecil','Pinjam dana untuk modal'],a:1,ex:'Transisi bertahap membiasakan emosi dengan uang asli.'}
]}
};

/* Bank soal tambahan: tiap modul punya 9 soal, setiap percobaan kuis mengambil 3 secara acak. */
const QB={
m1:[
 {q:'Apa perbedaan utama trading dengan investasi?',o:['Trading memegang aset lebih singkat dan fokus pada pergerakan harga','Trading selalu lebih menguntungkan','Investasi tidak punya risiko sama sekali'],a:0,ex:'Trading berorientasi jangka pendek–menengah dari pergerakan harga.'},
 {q:'Kapan XAUUSD biasanya paling ramai bergerak?',o:['Sesi Asia pagi','Saat sesi London dan New York tumpang tindih','Akhir pekan'],a:1,ex:'Volume terbesar muncul saat London dan New York sama-sama buka.'},
 {q:'Spread adalah...',o:['Komisi bulanan broker','Selisih harga beli (ask) dan harga jual (bid)','Batas rugi otomatis'],a:1,ex:'Spread adalah biaya yang langsung terasa saat posisi dibuka.'},
 {q:'Akun apa yang wajib dipakai pemula sebelum memakai uang asli?',o:['Akun demo','Akun standar dengan lot besar','Akun dari pinjaman'],a:0,ex:'Akun demo dipakai sampai kamu konsisten menjalankan rencana.'},
 {q:'Broker yang menjanjikan profit tetap tiap bulan sebaiknya...',o:['Dipilih karena terlihat aman','Dihindari karena hampir pasti penipuan','Dipakai khusus untuk modal besar'],a:1,ex:'Tidak ada keuntungan pasti dalam trading.'},
 {q:'Posisi 0.01 lot di EURUSD bernilai sekitar berapa per pip?',o:['$0.10','$1','$10'],a:0,ex:'1 lot ≈ $10 per pip, jadi 0.01 lot ≈ $0.10 per pip.'}],
m2:[
 {q:'Ciri downtrend adalah...',o:['Higher High dan Higher Low','Lower High dan Lower Low','Semua candle berwarna merah'],a:1,ex:'Puncak dan lembah yang makin rendah menandakan downtrend.'},
 {q:'Uptrend mulai rusak ketika harga...',o:['Membuat Higher High baru','Menembus Higher Low terakhir ke bawah','Menyentuh garis EMA'],a:1,ex:'Itu disebut break of structure.'},
 {q:'Timeframe yang cocok untuk mencari titik entry yang presisi adalah...',o:['W1','D1','M15'],a:2,ex:'Timeframe kecil dipakai untuk timing setelah arah ditentukan.'},
 {q:'Line chart dibentuk dari harga...',o:['Tertinggi','Penutupan','Pembukaan'],a:1,ex:'Line chart menghubungkan harga close setiap periode.'},
 {q:'Saat pasar sideways, sikap yang disarankan untuk pemula adalah...',o:['Menambah lot','Mengurangi trading atau hanya main di batas range','Terus buy di mana saja'],a:1,ex:'Pasar tanpa arah memberi banyak sinyal palsu.'},
 {q:'Arah H4 sedang naik. Setup mana yang paling searah?',o:['Sell di resistance M5','Buy setelah harga turun ke area support','Sell setiap ada candle merah'],a:1,ex:'Cari buy di area support saat tren besar naik.'}],
m3:[
 {q:'Doji menunjukkan bahwa pasar sedang...',o:['Dikuasai pembeli','Ragu-ragu','Pasti berbalik arah'],a:1,ex:'Open dan close hampir sama: belum ada pihak yang menang.'},
 {q:'Pin bar bullish paling bermakna bila muncul di...',o:['Tengah range tanpa level penting','Area support yang kuat','Saat berita besar dirilis'],a:1,ex:'Pola selalu dibaca bersama lokasinya.'},
 {q:'Marubozu adalah candle dengan...',o:['Badan penuh hampir tanpa ekor','Badan kecil dan ekor panjang','Harga open sama dengan close'],a:0,ex:'Badan penuh menunjukkan satu pihak sangat dominan.'},
 {q:'Inside bar biasanya menandakan...',o:['Kompresi sebelum gerakan besar','Tren pasti berlanjut','Pasar akan tutup'],a:0,ex:'Range menyempit, energi terkumpul.'},
 {q:'Evening star biasanya muncul di...',o:['Dasar downtrend','Puncak uptrend','Tengah pasar sideways'],a:1,ex:'Evening star adalah pola pembalikan turun di puncak.'},
 {q:'Badan candle adalah jarak antara harga...',o:['High dan Low','Open dan Close','Close dan High'],a:1,ex:'Ekor adalah bagian di luar badan.'}],
m4:[
 {q:'Support adalah area tempat...',o:['Penjual biasanya muncul','Pembeli biasanya muncul','Broker menutup posisi'],a:1,ex:'Support berada di bawah harga, tempat permintaan muncul.'},
 {q:'Berapa zona sebaiknya ditandai di sekitar harga sekarang?',o:['Sebanyak mungkin','2–3 zona terdekat di atas dan di bawah','Tidak perlu menandai zona'],a:1,ex:'Lebih sedikit zona membuat chart lebih jelas.'},
 {q:'False break adalah...',o:['Harga menembus zona sebentar lalu kembali masuk','Breakout dengan candle besar','Harga tidak bergerak sama sekali'],a:0,ex:'False break sering menjadi sinyal ke arah sebaliknya.'},
 {q:'Cara masuk yang lebih aman, walau kadang ketinggalan, adalah...',o:['Breakout langsung','Breakout lalu tunggu retest','Masuk sebelum breakout terjadi'],a:1,ex:'Retest memberi konfirmasi bahwa zona sudah berganti peran.'},
 {q:'Zona yang sudah diuji berkali-kali cenderung...',o:['Makin kuat','Makin tipis dan lemah','Tidak berubah'],a:1,ex:'Setiap uji menghabiskan order yang menunggu di zona.'},
 {q:'Breakout yang sehat ditandai oleh...',o:['Hanya ekor candle yang keluar zona','Candle close dengan badan besar di luar zona','Spread yang melebar'],a:1,ex:'Badan besar di luar zona menunjukkan tenaga yang nyata.'}],
m5:[
 {q:'Head & shoulders termasuk pola...',o:['Lanjutan','Pembalikan','Sideways'],a:1,ex:'Pola ini muncul di ujung tren.'},
 {q:'Ciri ascending triangle adalah...',o:['Puncak datar dan lembah makin tinggi','Lembah datar dan puncak makin rendah','Tidak punya puncak'],a:0,ex:'Biasanya tembus ke atas.'},
 {q:'Channel dibuat dengan cara...',o:['Menarik garis paralel dari trendline','Menarik satu garis horizontal','Memasang indikator RSI'],a:0,ex:'Harga cenderung bergerak di antara dua garis paralel.'},
 {q:'Target pola head & shoulders diukur dari...',o:['Panjang bahu kiri','Jarak head ke neckline','Jumlah candle dalam pola'],a:1,ex:'Jarak itu diproyeksikan dari titik tembus neckline.'},
 {q:'Jika trendline ditembus, artinya...',o:['Tren pasti selesai','Belum tentu tren selesai, konfirmasi dengan struktur','Harus langsung sell'],a:1,ex:'Trendline adalah alat bantu, bukan dinding.'},
 {q:'Pola flag terbentuk setelah...',o:['Gerakan tajam yang menjadi tiang','Pasar tutup','Muncul doji'],a:0,ex:'Flag adalah jeda singkat setelah gerakan kuat.'}],
m6:[
 {q:'Dibanding SMA, EMA...',o:['Lebih lambat','Lebih cepat merespons harga terbaru','Sama persis'],a:1,ex:'EMA memberi bobot lebih besar pada harga terbaru.'},
 {q:'RSI di bawah 30 disebut...',o:['Overbought','Oversold','Netral'],a:1,ex:'Oversold berarti harga sudah turun banyak.'},
 {q:'Divergence RSI terjadi ketika...',o:['Harga membuat high baru tapi RSI tidak','RSI berada di atas 50','Harga bergerak sideways'],a:0,ex:'Itu tanda tenaga tren melemah.'},
 {q:'Bollinger squeeze berarti...',o:['Band melebar','Band menyempit dan sering diikuti ledakan harga','Tren pasti naik'],a:1,ex:'Pasar tenang sebelum bergerak besar.'},
 {q:'Kombinasi indikator yang disarankan adalah...',o:['Lima indikator momentum sekaligus','Satu dari tiap keluarga: tren, momentum, volatilitas','Indikator saja tanpa melihat harga'],a:1,ex:'Indikator dari keluarga sama menanyakan hal yang sama.'},
 {q:'MACD di atas garis nol memberi bias...',o:['Naik','Turun','Tidak ada'],a:0,ex:'Di bawah nol memberi bias turun.'}],
m7:[
 {q:'Data NFP dirilis...',o:['Setiap hari','Jumat pertama setiap bulan','Sekali setahun'],a:1,ex:'NFP adalah data lapangan kerja AS.'},
 {q:'Inflasi CPI AS lebih tinggi dari perkiraan umumnya membuat USD...',o:['Menguat','Melemah','Tidak berubah'],a:0,ex:'Inflasi tinggi mendorong ekspektasi suku bunga naik.'},
 {q:'Emas sering bergerak ... terhadap dolar AS.',o:['Searah','Berlawanan','Tanpa hubungan sama sekali'],a:1,ex:'Emas dihargai dalam USD.'},
 {q:'Saran untuk pemula di sekitar berita high impact adalah...',o:['Entry tepat saat rilis','Hindari posisi baru 15–30 menit sebelum dan sesudah rilis','Gandakan lot'],a:1,ex:'Spread melebar dan harga bisa melompat.'},
 {q:'Slippage adalah...',o:['Order tereksekusi di harga yang lebih jauh dari yang dipasang','Biaya inap posisi','Bonus dari broker'],a:0,ex:'Slippage sering terjadi saat berita besar.'},
 {q:'Berita mana yang biasanya berdampak tinggi?',o:['Keputusan suku bunga Fed','Libur bursa kecil','Laporan cuaca'],a:0,ex:'Keputusan Fed menggerakkan USD dan emas.'}],
m8:[
 {q:'Rugi 50% butuh untung berapa persen untuk kembali ke modal awal?',o:['50%','100%','25%'],a:1,ex:'Dari $500 ke $1.000 butuh naik 100%.'},
 {q:'Saldo $500 dan risiko 2%. Berapa uang yang dipertaruhkan?',o:['$1','$10','$50'],a:1,ex:'$500 × 2% = $10.'},
 {q:'Untuk posisi buy, stop loss sebaiknya diletakkan...',o:['Di dalam zona support','Di bawah swing low, di luar zona','Tidak perlu dipasang'],a:1,ex:'SL di luar zona memberi ruang untuk noise.'},
 {q:'Dengan R:R 1:2, win rate minimal agar impas sekitar...',o:['33%','50%','66%'],a:0,ex:'Satu kemenangan menutup dua kekalahan.'},
 {q:'Batas rugi harian sudah tercapai. Yang benar adalah...',o:['Tambah lot untuk balik modal','Tutup platform dan lanjut besok','Pindah ke instrumen lain'],a:1,ex:'Batas dibuat agar keputusan tidak diambil saat emosi.'},
 {q:'Buy EURUSD dan buy GBPUSD bersamaan berarti...',o:['Risiko terbagi dengan aman','Risiko sebenarnya hampir dua kali lipat di arah yang sama','Hedging yang sempurna'],a:1,ex:'Keduanya sama-sama posisi melawan USD.'}],
m9:[
 {q:'FOMO artinya...',o:['Takut ketinggalan sehingga masuk terlambat','Strategi breakout','Nama indikator'],a:0,ex:'FOMO membuat trader masuk di harga yang sudah lari.'},
 {q:'Overtrading sering terjadi karena...',o:['Setup yang valid','Bosan atau ingin cepat untung','Mengikuti rencana'],a:1,ex:'Batasi jumlah trade per hari.'},
 {q:'Setelah kalah, langkah yang sehat adalah...',o:['Langsung entry lagi','Jeda sebentar dan cek rencana','Gandakan lot'],a:1,ex:'Jeda mencegah revenge trading.'},
 {q:'Kinerja trading sebaiknya dinilai dari...',o:['Satu trade','Seri 50–100 trade','Hasil hari ini saja'],a:1,ex:'Satu trade tidak mewakili strategi.'},
 {q:'Kolom jurnal yang penting selain entry, SL, dan TP adalah...',o:['Ikut rencana atau tidak, dan emosi saat itu','Warna tema chart','Nama broker'],a:0,ex:'Kolom ini menunjukkan pola kesalahan.'},
 {q:'Kapan evaluasi jurnal disarankan?',o:['Setiap akhir pekan','Tidak perlu','Setiap lima tahun'],a:0,ex:'Evaluasi rutin membuat kesalahan cepat terlihat.'}],
m10:[
 {q:'Dalam kerangka H4–M15, zona penting ditandai di timeframe...',o:['M1','H1','MN'],a:1,ex:'H4 arah, H1 zona, M15 pemicu.'},
 {q:'Kapan stop loss digeser ke titik impas?',o:['Saat posisi sudah +1R','Langsung setelah entry','Tidak pernah'],a:0,ex:'Ini melindungi posisi tanpa mengganggu terlalu awal.'},
 {q:'Expectancy minimal yang sehat dari backtest adalah...',o:['Lebih dari 0.2R per trade','Negatif','Tepat nol'],a:0,ex:'Expectancy positif berarti strategi punya keunggulan.'},
 {q:'Fitur TradingView untuk backtest manual adalah...',o:['Replay','Alert','Screener'],a:0,ex:'Replay memutar chart candle demi candle.'},
 {q:'Trading plan berisi...',o:['Instrumen, jam, setup, risiko, dan evaluasi','Hanya target profit','Daftar sinyal dari grup'],a:0,ex:'Rencana tertulis adalah aturan main pribadi.'},
 {q:'Contoh pemicu entry di M15 adalah...',o:['Pin bar atau engulfing di zona, searah H4','Gosip di media sosial','Warna candle sebelumnya'],a:0,ex:'Pemicu muncul di zona dan searah arah besar.'}]
};
Object.keys(QB).forEach(k=>{MODS[k].quiz=MODS[k].quiz.concat(QB[k]);});

export const ORDER = Object.keys(MODS);
ORDER.forEach((id, i) => { MODS[id].id = id; MODS[id].n = i + 1; MODS[id].free = i < 3; });
export const lessonKey = (m, i) => `${m}-l${i + 1}`;
export const levelOf = (id) => LEVELS.find((l) => l.mods.includes(id));
