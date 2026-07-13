'use strict';
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessDetails() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Peserta';
  const email = searchParams.get('email') || 'email Anda';

  return (
    <div className="bg-brand-white border border-brand-border p-8 md:p-12 max-w-2xl mx-auto rounded-none text-center">
      {/* Success Badge */}
      <div className="w-16 h-16 bg-brand-blue text-brand-white flex items-center justify-center mx-auto text-3xl font-bold mb-6">
        ✓
      </div>

      <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-2 uppercase">
        PENDAFTARAN DIKIRIM
      </h1>
      <p className="text-sm font-mono text-brand-blue font-bold uppercase tracking-wider mb-6">
        Status: Dalam Proses Verifikasi
      </p>

      <div className="text-slate-600 space-y-4 mb-8 text-left max-w-md mx-auto text-sm">
        <p className="text-center font-bold text-brand-dark">
          Terima kasih telah mendaftar, {name}!
        </p>
        <p>
          Data pendaftaran Anda beserta bukti transfer pembayaran telah kami terima dengan sukses.
        </p>
        <p>
          Email pemberitahuan awal telah dikirimkan ke alamat email <strong className="text-brand-dark">{email}</strong>. 
          Petugas administrator kami akan memeriksa bukti pembayaran transfer Anda. Proses verifikasi ini memakan waktu maksimal <strong>3 hari kerja</strong>.
        </p>
        <p>
          Setelah pembayaran Anda dinyatakan valid, sistem akan secara otomatis mengirimkan email konfirmasi lanjutan yang berisi <b>8 digit kode registrasi unik</b> untuk digunakan pada saat pengambilan perlengkapan race bag.
        </p>
        <p className="text-xs text-slate-500 border-t border-brand-border pt-4">
          Catatan: Jika Anda tidak menemukan email kami, silakan periksa folder spam.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-brand-border pt-8">
        <Link href="/" className="inline-block bg-brand-dark hover:bg-brand-dark-hover text-brand-white font-semibold py-2.5 px-6 transition duration-150 rounded-none text-xs tracking-wider uppercase">
          KEMBALI KE BERANDA
        </Link>
        <Link href="/register" className="inline-block bg-transparent hover:bg-brand-light text-brand-dark border border-brand-dark font-semibold py-2.5 px-6 transition duration-150 rounded-none text-xs tracking-wider uppercase">
          DAFTARKAN ORANG LAIN
        </Link>
      </div>
    </div>
  );
}

export default function RegisterSuccess() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      {/* Header */}
      <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-matias-run.png" alt="Matias Fun Run 2026" className="h-12 w-auto object-contain" />
            <div className="h-6 w-[1px] bg-slate-700 hidden sm:block"></div>
            <img src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-8 w-auto object-contain hidden sm:block" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={
          <div className="text-center p-8 bg-brand-white border border-brand-border max-w-2xl mx-auto">
            <p className="text-slate-500 font-semibold text-sm">Memuat halaman konfirmasi pendaftaran...</p>
          </div>
        }>
          <SuccessDetails />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-6xl mx-auto">
          <p>&copy; 2026 Matias Fun Run &amp; Walk. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
