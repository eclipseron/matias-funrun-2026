'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRegistrationPeriod } from '@/lib/registrationPeriods';

export default function Home() {
  // Countdown Target: 20 November 2026 23:59:59 WIB (UTC+7)
  const targetDate = new Date('2026-11-20T23:59:59+07:00').getTime();
  
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

  const [periodInfo, setPeriodInfo] = useState(() => getRegistrationPeriod());

  useEffect(() => {
    setPeriodInfo(getRegistrationPeriod());
  }, []);

  const activePrice = periodInfo.priceString;
  const priceType = periodInfo.periodName;

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
            PENDAFTARAN DITUTUP DALAM (20 NOVEMBER 2026)
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
              <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-2 uppercase">
                MATIAS FUN RUN 2026
              </h2>
              <p className="text-xs font-mono text-brand-blue font-bold uppercase tracking-wider mb-4">
                &ldquo;Run For Happiness and Smiles&rdquo;
              </p>
              
              <div className="text-slate-600 space-y-4 leading-relaxed mb-6 text-sm">
                <p className="text-base font-bold text-brand-dark">
                  Saatnya melangkah bersama dalam semangat kebersamaan, kesehatan, dan sukacita.
                </p>
                <p>
                  Ajak keluarga, sahabat, dan komunitasmu untuk menjadi bagian dari Matias Fun Run 2026. 
                  Nikmati setiap langkah dengan santai, penuh semangat, dan penuh kebahagiaan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 border-t border-brand-border pt-6">
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Tanggal Acara</h4>
                  <p className="text-base font-bold text-brand-dark">Sabtu, 5 Desember 2026</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Lokasi Mulai &amp; Rute</h4>
                  <p className="text-base font-bold text-brand-dark">Paroki Kosambi Baru &ndash; Gereja St. Matias Rasul</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Waktu Flag-Off</h4>
                  <p className="text-base font-bold text-brand-dark">06:00 WIB</p>
                </div>
                <div className="border-l-4 border-brand-blue pl-4">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Cut-off Time</h4>
                  <p className="text-base font-bold text-brand-dark">No Cut Off Time (Tanpa Batas Waktu)</p>
                </div>
              </div>
            </section>

            {/* Kategori Acara */}
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-xl font-bold text-brand-dark mb-4 tracking-wide uppercase font-mono">
                PILIHAN KATEGORI LANGKAH
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-brand-light p-5 border border-brand-border">
                  <h3 className="text-lg font-bold text-brand-blue font-mono">FUN WALK 2K</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Santai, seru, dan sangat cocok untuk diikuti oleh semua usia bersama seluruh anggota keluarga.
                  </p>
                </div>
                <div className="bg-brand-light p-5 border border-brand-border">
                  <h3 className="text-lg font-bold text-brand-blue font-mono">FUN RUN 4.5K</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Lebih menantang, penuh dengan energi, dan didesain tetap menyenangkan untuk pelari komunitas.
                  </p>
                </div>
              </div>
            </section>

            {/* Benefit Section */}
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-xl font-bold text-brand-dark mb-6 tracking-wide uppercase font-mono">
                FASILITAS &amp; BENEFIT PESERTA
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                {[
                  { title: 'Jersey Eksklusif', icon: '👕' },
                  { title: 'Finisher Medal', icon: '🏅' },
                  { title: 'Bib Number', icon: '🏷️' },
                  { title: 'Race Bag', icon: '🎒' },
                  { title: 'Product Sponsor', icon: '🎁' },
                  { title: 'Water Station', icon: '💧' },
                ].map((item, idx) => (
                  <div key={idx} className="border border-brand-border p-4 bg-brand-light">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-bold text-brand-dark leading-tight">{item.title}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Steps Guide */}
            <section className="bg-brand-white border border-brand-border p-8 rounded-none">
              <h2 className="text-xl font-bold text-brand-dark mb-6 tracking-wide uppercase font-mono">
                ALUR REGISTRASI PESERTA
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Isi Formulir Pendaftaran</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Pilih jenis kompetisi (Fun Run atau Fun Walk), lengkapi data diri beserta kontak darurat, lalu transfer biaya pendaftaran sesuai periode aktif ke rekening BCA panitia dan unggah bukti transfer.
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
                      Penyelenggara akan memeriksa validitas bukti pembayaran Anda. Selama proses ini, Anda akan menerima email pemberitahuan verifikasi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 flex items-center justify-center bg-brand-dark text-brand-white font-mono font-bold w-8 h-8">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Dapatkan Kode Registrasi &amp; QR Code</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Setelah pembayaran diverifikasi lunas, Anda otomatis mendapatkan email berisi 8 digit kode registrasi unik dan QR Code sebagai bukti pendaftaran resmi.
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
                      Tunjukkan kode registrasi unik atau tunjukkan QR Code pada email kepada petugas di lokasi meja penukaran race bag pada hari H.
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
              <h3 className="text-xl font-bold tracking-tight text-brand-white mb-2 uppercase">
                MATIAS FUN RUN 2026
              </h3>
              <p className="text-[10px] text-sky-300 font-mono uppercase tracking-wider mb-4">
                &ldquo;Run For Happiness and Smiles&rdquo;
              </p>
              
              <div className="bg-brand-dark-light p-4 mb-6 border border-slate-700 text-xs space-y-4">
                <div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Status Pendaftaran</p>
                  <p className="font-bold text-amber-400 mt-1 leading-normal">{periodInfo.message}</p>
                </div>

                <div className="border-t border-slate-700 pt-3">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Jadwal &amp; Biaya Pendaftaran</p>
                  <ul className="space-y-2 mt-2 font-mono text-[11px] text-slate-300">
                    <li className={periodInfo.status === 'EB1' ? 'text-white font-bold border-l-2 border-brand-blue pl-1.5' : 'pl-1.5'}>
                      Early Bird 1 (15 - 30 Juli):<br/>
                      <span className="font-bold text-brand-blue">Rp 125.000</span>
                    </li>
                    <li className={periodInfo.status === 'EB2' ? 'text-white font-bold border-l-2 border-brand-blue pl-1.5' : 'pl-1.5'}>
                      Early Bird 2 (10 Agt - 30 Sept):<br/>
                      <span className="font-bold text-brand-blue">Rp 150.000</span>
                    </li>
                    <li className={periodInfo.status === 'NORMAL' ? 'text-white font-bold border-l-2 border-brand-blue pl-1.5' : 'pl-1.5'}>
                      Normal (4 Okt - 20 Nov):<br/>
                      <span className="font-bold text-brand-blue">Rp 175.000</span>
                    </li>
                  </ul>
                </div>

                {periodInfo.formActive && (
                  <div className="border-t border-slate-700 pt-3">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Nominal</p>
                    <p className="text-xl font-mono font-bold text-sky-300 mt-1">{activePrice}</p>
                  </div>
                )}
              </div>
              
              {periodInfo.formActive ? (
                <Link href="/register" className="block w-full text-center bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-bold py-3 px-4 transition duration-150 rounded-none tracking-wider text-sm">
                  MENUJU FORMULIR PENDAFTARAN
                </Link>
              ) : (
                <div className="block w-full text-center bg-slate-700 text-slate-400 font-bold py-3 px-4 rounded-none text-sm cursor-not-allowed select-none">
                  PENDAFTARAN JEDA / DITUTUP
                </div>
              )}
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
          <p>Powered by Zellution &copy; 2026 Matias Fun Run &amp; Walk.</p>
          <p className="mt-2 text-slate-500">Situs resmi registrasi peserta Matias Fun Run. Penyelenggara tidak memungut biaya apapun di luar biaya pendaftaran.</p>
        </div>
      </footer>
    </div>
  );
}
