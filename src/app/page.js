'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  // Countdown Target: 29 November 2026 23:59:59
  const targetDate = new Date('2026-11-29T23:59:59').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const msInDay = 24 * 60 * 60 * 1000;
      const msInHour = 60 * 60 * 1000;
      const msInMinute = 60 * 1000;

      const days = Math.floor(difference / msInDay);
      const hours = Math.floor((difference % msInDay) / msInHour);
      const minutes = Math.floor((difference % msInHour) / msInMinute);
      const seconds = Math.floor((difference % msInMinute) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Pricing calculation based on date
  // const CUTOFF_EARLY_BIRD = new Date('2026-11-10T23:59:59');
  // const [isEarlyBird, setIsEarlyBird] = useState(true);

  // useEffect(() => {
  //   setIsEarlyBird(new Date() < CUTOFF_EARLY_BIRD);
  // }, []);

  // const activePrice = isEarlyBird ? 'Rp 125.000' : 'Rp 175.000';
  // const priceType = isEarlyBird ? 'Early Bird' : 'Harga Normal';

  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-matias-run.png" alt="Matias Fun Run 2026" className="h-14 w-auto object-contain" />
            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
            <img src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-10 w-auto object-contain hidden sm:block" />
            <div className="hidden md:block pl-1 text-left">
              <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Organized by</p>
              <p className="text-[9px] text-slate-400 leading-tight">Gereja St. Matias Rasul<br/>Paroki Kosambi Baru</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/register" className="inline-block bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-semibold py-2.5 px-6 transition duration-150 rounded-none text-sm tracking-wide">
              DAFTAR SEKARANG
            </Link>
          </div>
        </div>
      </header>

      {/* Countdown Penutupan Pendaftaran */}
      <div className="bg-brand-dark text-brand-white py-8 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-4">
            PENDAFTARAN DITUTUP DALAM (29 NOVEMBER 2026)
          </h2>
          
          {timeLeft.isExpired ? (
            <div className="text-xl font-bold text-red-500 uppercase tracking-wider py-2">
              Pendaftaran Telah Ditutup
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center gap-1.5 sm:gap-3 max-w-xl mx-auto w-full px-2">
              {/* Box Hari */}
              <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Hari</div>
              </div>

              <div className="text-xs sm:text-xl font-bold text-slate-600 select-none">:</div>

              {/* Box Jam */}
              <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Jam</div>
              </div>

              <div className="text-xs sm:text-xl font-bold text-slate-600 select-none">:</div>

              {/* Box Menit */}
              <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Menit</div>
              </div>

              <div className="text-xs sm:text-xl font-bold text-slate-600 select-none">:</div>

              {/* Box Detik */}
              <div className="bg-brand-dark-light border border-slate-700 flex-1 min-w-0 p-2 sm:p-3 rounded-none text-center">
                <div className="text-xl sm:text-3xl md:text-4xl font-extrabold font-mono text-brand-white tracking-tight leading-none">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[10px] text-sky-300 font-mono uppercase tracking-wider mt-1 sm:mt-2">Detik</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Section */}
      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Brief Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-4 border-b border-brand-border pb-4">
                TENTANG EVENT
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Selamat datang di portal pendaftaran resmi untuk <strong className="text-brand-dark">Matias Fun Run &amp; Walk 2026</strong>. 
                Tahun ini, kami mengundang para pelari, keluarga, dan seluruh pencinta olahraga untuk berpartisipasi dalam kategori pilihan Anda: <strong className="text-brand-dark">Lari 4K (Fun Run)</strong> dan <strong className="text-brand-dark">Jalan 2.5K (Fun Walk)</strong>. 
                Mari berlari dan berjalan bersama demi kesehatan, kebersamaan, dan kegembiraan!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tanggal Acara</h4>
                  <p className="text-lg font-bold text-brand-dark">Minggu, 6 Desember 2026</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Lokasi Mulai</h4>
                  <p className="text-lg font-bold text-brand-dark">Pintu B Stadion Utama, City Park</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Waktu Mulai</h4>
                  <p className="text-lg font-bold text-brand-dark">06:00 WIB (Flag Off)</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Kategori Pilihan</h4>
                  <p className="text-lg font-bold text-brand-dark">Lari 4K | Jalan 2.5K</p>
                </div>
              </div>
            </section>

            {/* Steps Guide */}
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-xl font-bold text-brand-dark mb-6 tracking-wide">
                ALUR REGISTRASI
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
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
                  <div className="shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Proses Verifikasi</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Anda akan mendapatkan email konfirmasi bahwa pendaftaran Anda sedang diverifikasi oleh penyelenggara.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Dapatkan Kode Registrasi</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Setelah pembayaran terverifikasi, Anda akan menerima email berisi 8 digit kode registrasi sebagai bukti untuk pengambilan race bag.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Pengambilan Race Bag</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Tunjukkan kode registrasi pada email kepada petugas di lokasi pengambilan race bag pada hari yang ditentukan.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Call to Action Box */}
            <div className="bg-brand-dark text-brand-white p-8 rounded-none border-t-4 border-brand-blue">
              <h3 className="text-xl font-bold tracking-tight text-brand-white mb-2">
                IKUTI KESERUANNYA
              </h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Benefit: Jersey Resmi, Medali Finisher, Running Bag, Konsumsi, dan Nomor BIB.
              </p>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                <b>Early Bird</b>: Rp 125.000 (s.d. 10 Nov)<br />
                <b>Normal</b>: Rp 175.000 (11 - 29 Nov)
              </p>
              <Link href="/register" className="block w-full text-center bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-bold py-3 px-4 transition duration-150 rounded-none tracking-wider text-sm">
                MENUJU FORMULIR PENDAFTARAN
              </Link>
            </div>

            {/* Service Desk Information */}
            <div className="bg-brand-white border border-brand-border p-6 rounded-none">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 border-b border-brand-border pb-2 font-mono">
                LAYANAN INFORMASI
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  Memiliki pertanyaan terkait pendaftaran, pembayaran, atau pengambilan running bag? Hubungi kami:
                </p>
                <div className="pt-2 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-12.5">Email:</span>
                    <a href="mailto:info@matias-funrun.my.id" className="text-brand-blue hover:underline font-semibold">info@matias-funrun.my.id</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-12.5">Whatsapp:</span>
                    <span className="text-slate-800 font-semibold">+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-12.5">Instagram:</span>
                    <Link href="https://www.instagram.com/matiasfunrun" className="text-slate-800 underline hover:text-brand-blue">@matiasfunrun</Link>
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
          <p>Powered by Zealution &copy; 2026 Matias Fun Run &amp; Walk.</p>
          <p className="mt-2 text-slate-500">Situs resmi registrasi peserta Matias Fun Run. Penyelenggara tidak memungut biaya apapun di luar biaya pendaftaran.</p>
        </div>
      </footer>
    </div>
  );
}
