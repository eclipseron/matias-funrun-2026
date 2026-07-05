import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-white sm:text-3xl">
              MATIAS <span className="text-brand-green">FUN RUN &amp; WALK</span> 2026
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
              Acara Tahunan Fun Run &amp; Fun Walk Komunitas
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/register" className="inline-block bg-brand-green hover:bg-brand-green-hover text-brand-white font-semibold py-2.5 px-6 transition duration-150 rounded-none text-sm tracking-wide">
              DAFTAR SEKARANG
            </Link>
            <Link href="/admin/login" className="inline-block bg-transparent hover:bg-brand-dark-light text-brand-white border border-slate-600 font-semibold py-2.5 px-6 transition duration-150 rounded-none text-sm tracking-wide">
              DASHBOARD ADMIN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Brief Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-4 border-b border-brand-border pb-4">
                TENTANG EVENT
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Selamat datang di portal pendaftaran resmi untuk <strong className="text-brand-dark">Matias Fun Run &amp; Walk 2026</strong>. 
                Tahun ini, kami mengundang para pelari, keluarga, dan seluruh pencinta olahraga untuk berpartisipasi dalam kategori pilihan Anda: **Fun Run** dan **Fun Walk**. 
                Mari berlari dan berjalan bersama demi kesehatan, kebersamaan, dan kegembiraan!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="border-l-4 border-brand-green pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tanggal Acara</h4>
                  <p className="text-lg font-bold text-brand-dark">Minggu, 11 Oktober 2026</p>
                </div>
                <div className="border-l-4 border-brand-green pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Lokasi Mulai</h4>
                  <p className="text-lg font-bold text-brand-dark">Pintu B Stadion Utama, City Park</p>
                </div>
                <div className="border-l-4 border-brand-green pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Waktu Mulai</h4>
                  <p className="text-lg font-bold text-brand-dark">06:00 WIB (Flag Off)</p>
                </div>
                <div className="border-l-4 border-brand-green pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Kategori Pilihan</h4>
                  <p className="text-lg font-bold text-brand-dark">Fun Run | Fun Walk</p>
                </div>
              </div>
            </section>

            {/* Steps Guide */}
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-xl font-bold text-brand-dark mb-6 tracking-wide">
                CARA MENDAFTAR
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Isi Formulir Pendaftaran</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Pilih jenis kompetisi (&quot;Fun Run&quot; atau &quot;Fun Walk&quot;), lalu lengkapi informasi diri Anda (Nama, Email, WhatsApp, NIK, dan detail kontak darurat) serta unggah bukti transfer pendaftaran.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Email Konfirmasi Proses Verifikasi</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Sistem akan mengirimkan email konfirmasi bahwa pendaftaran Anda sedang diverifikasi oleh admin. Proses ini memakan waktu maksimal 3 hari.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Dapatkan Kode Registrasi &amp; QR Code</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Setelah pembayaran terverifikasi, Anda akan menerima email berisi 8 digit kode registrasi unik dan QR Code sebagai tiket pengambilan race bag.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Pengambilan Race Bag (Running Bag)</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Tunjukkan kode registrasi atau tunjukkan QR Code pada email kepada petugas di lokasi pengambilan race bag pada hari yang ditentukan.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Call to Action Box */}
            <div className="bg-brand-dark text-brand-white p-8 rounded-none border-t-4 border-brand-green">
              <h3 className="text-xl font-bold tracking-tight text-brand-white mb-2">
                IKUTI KESERUANNYA
              </h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Biaya pendaftaran adalah sebesar Rp 150.000. Fasilitas peserta: Jersey Resmi, Medali Finisher, Running Bag, Konsumsi, dan Nomor BIB.
              </p>
              <div className="bg-brand-dark-light p-4 mb-6 border border-slate-700">
                <p className="text-xs font-mono text-slate-400 uppercase">Rekening Pembayaran</p>
                <p className="text-md font-bold mt-1">Bank Mandiri</p>
                <p className="text-lg font-mono font-bold text-brand-green tracking-wide">123-00-0987654-3</p>
                <p className="text-xs text-slate-300 mt-1">a.n. Asosiasi Matias Fun Run</p>
              </div>
              <Link href="/register" className="block w-full text-center bg-brand-green hover:bg-brand-green-hover text-brand-white font-bold py-3 px-4 transition duration-150 rounded-none tracking-wider text-sm">
                MENUJU FORMULIR PENDAFTARAN
              </Link>
            </div>

            {/* Service Desk Information Placeholder */}
            <div className="bg-brand-white border border-brand-border p-6 rounded-none">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 border-b border-brand-border pb-2 font-mono">
                LAYANAN INFORMASI (SERVICE DESK)
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  Memiliki pertanyaan terkait pendaftaran, pembayaran, atau pengambilan running bag? Hubungi kami:
                </p>
                <div className="pt-2 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-[50px]">Email:</span>
                    <a href="mailto:support@matiasfunrun.com" className="text-brand-green hover:underline">support@matiasfunrun.com</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-[50px]">Telepon:</span>
                    <span className="text-slate-800">+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-[50px]">Jam Kerja:</span>
                    <span className="text-slate-800">Senin - Jumat, 09:00 - 17:00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-6xl mx-auto">
          <p>&copy; 2026 Matias Fun Run &amp; Walk. Hak Cipta Dilindungi.</p>
          <p className="mt-2 text-slate-600">Situs ini adalah portal resmi pendaftaran peserta. Harap pastikan status pembayaran Anda telah diverifikasi.</p>
        </div>
      </footer>
    </div>
  );
}
