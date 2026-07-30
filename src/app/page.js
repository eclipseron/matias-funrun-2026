export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getCountdownTarget, getRegistrationPeriodWithCurrCount } from '@/lib/registrationPeriods';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Info, 
  Shirt, 
  Award, 
  Tag, 
  Backpack, 
  Gift, 
  Droplet 
} from 'lucide-react';
import Image from 'next/image';
import { CountDownHeader } from './CountDownHeader';
import { query } from '@/lib/db';
import { ContactInformation } from './ContactInformation';

export default async function Home() {
  let currRegisteredCount = 0;
  try {
    const res = await query(`SELECT COUNT(is_active) AS registered FROM runners WHERE is_active = 1`);
    currRegisteredCount = res.rows[0]
  } catch (error) {
    console.error('Failed to fetch runners for admin dashboard:', error);
  }
  
  const periodInfo = getRegistrationPeriodWithCurrCount(currRegisteredCount.registered)
  const countdownInfo = getCountdownTarget(currRegisteredCount.registered);

  const activePrice = periodInfo.priceString;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent z-0">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 size-200 bg-brand-blue/10 rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 size-150 bg-sky-300/10 rounded-full blur-3xl opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Decorative sharp geometric element like poster */}
      <div className="absolute top-[10%] left-0 -z-10 w-full h-200 bg-linear-to-br from-brand-blue/2 to-sky-200/5 -skew-y-6 origin-top-left pointer-events-none"></div>
      <div className="absolute top-[40%] right-0 -z-10 w-full h-150 bg-linear-to-bl from-brand-blue/3 to-sky-300/5 skew-y-8 origin-bottom-right pointer-events-none"></div>

      {/* Header */}
      <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image height={1} width={100} src="/logo-matias-run.png" alt="Matias Fun Run 2026" className="h-14 w-auto object-contain" />
            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
            <Image height={1} width={100} src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-10 w-auto object-contain hidden sm:block" />
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
      {
        countdownInfo.notice ? (
          <div className="bg-brand-dark text-brand-white pt-4 pb-8 px-4 border-b border-slate-800">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-sm font-bold font-mono tracking-widest text-amber-400 uppercase mb-4 animate-pulse">
                {countdownInfo.notice}
              </h2>
            </div>
          </div>
        ) :
        // Countdown Dinamis (Dihide setelah event selesai)
        <CountDownHeader countdownInfo={countdownInfo} />
      }


      {/* Main Section */}
      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Brief Info */}
          <div className="lg:col-span-2 space-y-8 relative z-10">
            <section className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 relative overflow-hidden">
              {/* Decorative Circle Accent */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none"></div>

              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-brand-dark to-brand-blue tracking-tighter mb-2 italic uppercase">
                MATIAS FUN RUN 2026
              </h2>
              <p className="text-sm font-bold text-brand-blue font-mono uppercase tracking-wider mb-5 italic">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 border-t border-brand-border pt-6">
                {/* Tanggal Acara */}
                <div className="flex items-start gap-3 ">
                  <Calendar className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tanggal</h4>
                    <p className="text-sm font-bold text-brand-dark mt-0.5">Sabtu, 5 Desember 2026</p>
                  </div>
                </div>

                {/* Lokasi Mulai */}
                <div className="flex items-start gap-3 ">
                  <MapPin className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Lokasi Mulai &amp; Rute</h4>
                    <p className="text-sm font-bold text-brand-dark mt-0.5">Perumahan Kosambi Baru, Duri Kosambi, Jakarta Barat</p>
                  </div>
                </div>

                {/* Waktu Flag-Off */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div className="w-full">
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Waktu Flag-Off</h4>
                    <div className="mt-1 w-[80%]">
                      <p className="text-sm font-bold text-brand-dark flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-1">
                        <span className="text-[11px] font-bold text-slate-500">Fun Run 4K</span>
                        <span>06.00 WIB</span>
                      </p>
                      <p className="text-sm font-bold text-brand-dark flex items-center justify-between gap-3 pt-1">
                        <span className="text-[11px] font-bold text-slate-500">Fun Walk 2.5K</span>
                        <span>06.15 WIB</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cut-off Time */}
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Cut-off Time</h4>
                    <p className="text-sm font-bold text-brand-dark mt-0.5">No Cut Off Time</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Kategori Acara */}
            <section className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 relative overflow-hidden">
              <h2 className="text-2xl font-black text-brand-dark mb-5 tracking-tight uppercase italic">
                KATEGORI
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 border-2 sm:border-3 border-brand-blue shadow-[8px_8px_0px_0px_rgba(0,102,255,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(0,102,255,0.25)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
                  <h3 className="text-xl font-black text-brand-blue italic tracking-tight">FUN RUN 4K</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    Lebih menantang, penuh dengan energi, dan didesain tetap menyenangkan untuk pelari komunitas.
                  </p>
                </div>
                <div className="bg-white p-6 border-2 sm:border-3 border-sky-400 shadow-[8px_8px_0px_0px_rgba(56,189,248,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(56,189,248,0.25)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
                  <h3 className="text-xl font-black text-sky-500 italic tracking-tight">FUN WALK 2.5K</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                    Santai, seru, dan sangat cocok untuk diikuti oleh semua usia bersama seluruh anggota keluarga.
                  </p>
                </div>
              </div>
            </section>

            {/* Benefit Section */}
            <section className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 relative overflow-hidden">
              {/* Decorative Circle Accent */}
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h2 className="text-2xl font-black text-brand-dark mb-6 tracking-tight uppercase italic">
                BENEFIT
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                {[
                  { title: 'Jersey Eksklusif', icon: <Shirt className="w-6 h-6 text-brand-blue" /> },
                  { title: 'Finisher Medal', icon: <Award className="w-6 h-6 text-brand-blue" /> },
                  { title: 'Bib Number', icon: <Tag className="w-6 h-6 text-brand-blue" /> },
                  { title: 'Race Bag', icon: <Backpack className="w-6 h-6 text-brand-blue" /> },
                  { title: 'Product Sponsor', icon: <Gift className="w-6 h-6 text-brand-blue" /> },
                  { title: 'Water Station & Refreshment', icon: <Droplet className="w-6 h-6 text-brand-blue" /> },
                ].map((item, idx) => (
                  <div key={idx} className="border border-white/60 p-4 bg-brand-light/50 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center hover:-translate-y-1 transition-transform duration-200">
                    <div className="mb-3 p-3 bg-white rounded-full shadow-sm text-brand-blue">{item.icon}</div>
                    <div className="text-xs font-bold text-brand-dark leading-tight">{item.title}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Route Map Section */}
            <section className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none"></div>
              <h2 className="text-2xl font-black text-brand-dark mb-8 tracking-tight uppercase italic text-center">
                RUTE LINTASAN
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* 4K Route */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-black text-brand-blue mb-4 italic tracking-tight">FUN RUN 4K</h3>
                  <div className="relative w-full group">
                    <Image
                      src="/route-4K.webp" 
                      alt="Rute Matias Fun Run 4K" 
                      width={800} 
                      height={1000} 
                      loading="eager"
                      className="w-full h-auto border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,102,255,0.15)] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[12px_12px_0px_0px_rgba(0,102,255,0.25)] transition-all duration-300 ease-out"
                    />
                  </div>
                </div>

                {/* 2.5K Route */}
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-black text-sky-500 mb-4 italic tracking-tight">FUN WALK 2.5K</h3>
                  <div className="relative w-full group">
                    <Image
                      src="/route-2.5K.webp" 
                      alt="Rute Matias Fun Walk 2.5K" 
                      width={800} 
                      height={1000} 
                      loading="eager"
                      className="w-full h-auto border-4 border-white shadow-[8px_8px_0px_0px_rgba(56,189,248,0.15)] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[12px_12px_0px_0px_rgba(56,189,248,0.25)] transition-all duration-300 ease-out"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Steps Guide */}
            <section className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 relative overflow-hidden">
              {/* Decorative Circle Accent */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none"></div>

              <h2 className="text-2xl font-black text-brand-dark mb-6 tracking-tight uppercase italic">
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
                    <h4 className="font-bold text-brand-dark">Dapatkan Kode Registrasi</h4>
                    <p className="text-slate-600 text-sm mt-1">
                      Setelah pembayaran diverifikasi lunas, Anda otomatis mendapatkan email berisi 8 digit kode registrasi unik sebagai bukti pendaftaran resmi.
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
                      Tunjukkan kode registrasi unik yang ada pada email kepada petugas di lokasi meja penukaran race bag pada hari pengambilan.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8 relative z-10">
            
            {/* Call to Action Box */}
            <div className="bg-linear-to-b from-brand-dark to-brand-dark-light text-brand-white p-8 border-t-4 border-brand-blue shadow-2xl shadow-brand-blue/20 relative overflow-hidden">
              {/* Dynamic decorative shape */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-tl-[100px] pointer-events-none"></div>

              <h3 className="text-2xl font-black tracking-tight text-brand-white mb-2 uppercase italic">
                MATIAS FUN RUN 2026
              </h3>
              <p className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-6 italic">
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
            <ContactInformation />

            <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-6 relative overflow-hidden">
              <h3 className="text-lg font-black text-brand-dark uppercase tracking-tight mb-4 border-b border-slate-200 pb-3 italic">
                Supported by
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className='mb-16'>
                  <Image src="/sponsor-silirr.png" alt='silirr' width={100} height={1} style={{ width: "auto" }} className='opacity-40' />
                </div>
                <p className='text-xs max-w-3/4'>
                  Tertarik untuk bekerja sama dengan kami? Hubungi:
                </p>
                <div className="space-y-2 text-xs">
                  <div className='flex flex-col gap-1'>
                    <Link href={"https://wa.me/+6285951650526"} target="_blank" className="hover:underline hover:text-brand-blue-hover"><b>Partnership:</b> 0859-5165-0526 (Clara)</Link>
                    <Link href={"https://wa.me/+6289635039916"} target="_blank" className="hover:underline hover:text-brand-blue-hover"><b>Sponsorship:</b> 0896-3503-9916 (Mourin)</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-center text-xs relative z-10">
        <div className="max-w-6xl mx-auto">
          <p>Powered by Zellution &copy; 2026 Matias Fun Run &amp; Walk.</p>
          <p className="mt-2 text-slate-500">Official Registration Portal for Matias Fun Run. The organizer does not charge any fees other than the official registration fee.</p>
        </div>
      </footer>
    </div>
  );
}
