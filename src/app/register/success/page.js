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

      <div className="text-slate-600 space-y-4 mb-8 text-left max-w-md mx-auto leading-relaxed">
        <p className="text-center font-bold text-brand-dark">
          Terima kasih telah mendaftar, {name}!
        </p>
        <p>
          Email konfirmasi pendaftaran akan dikirimkan ke <strong className="text-brand-blue">{email}</strong> dalam 5 menit berikutnya. 
        </p>
        <p>
          Apabila Anda belum menerima email konfirmasi, harap menghubungi kontak berikut:
        </p>
        <div className='flex flex-col gap-1 text-sm w-fit'>
          <Link href={"https://wa.me/+6285811190695"} target="_blank" rel="noopener noreferrer" className="min-w-17.5 hover:underline hover:text-brand-blue-hover">0858-1119-0695 (Vicktoria)</Link>
          <Link href={"https://wa.me/+6281317635341"} target="_blank" rel="noopener noreferrer" className="min-w-17.5 hover:underline hover:text-brand-blue-hover">0813-1763-5341 (Veronika)</Link>
          <Link href={"https://wa.me/+6281237831860"} target="_blank" rel="noopener noreferrer" className="min-w-17.5 hover:underline hover:text-brand-blue-hover">0812-3783-1860 (Vanessa)</Link>
        </div>

        <p className='text-sm'>
          Penyelenggara akan melakukan verifikasi data pendaftaran. Setelah pendaftaran terverifikasi, Anda akan menerima <strong>8 digit </strong> kode pengambilan race bag yang dikirim melalui email terdaftar.
        </p>
        <p className="text-xs text-slate-500 border-t border-brand-border pt-4">
          Catatan: Jika Anda tidak menemukan email kami, silakan periksa folder spam.
        </p>
      </div>

      {/* Social & Community Channels Section */}
      <div className="max-w-md mx-auto mb-8 bg-brand-light border border-brand-border p-5 text-center rounded-none">
        <p className="text-xs font-mono font-bold text-brand-dark uppercase tracking-wider mb-1.5">
          Follow & Join Sosial Media Kami 
        </p>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Follow Instagram dan Join ke WhatsApp Channel resmi kami untuk mendapat update seputar pengambilan race pack dan info hari-H:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="https://www.instagram.com/matiasfunrun/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-brand-white hover:bg-brand-dark text-brand-dark hover:text-brand-white border border-brand-dark py-2.5 px-4 transition duration-150 rounded-none text-xs font-semibold tracking-wider uppercase group"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>@matiasfunrun</span>
          </Link>

          <Link
            href="https://www.whatsapp.com/channel/0029VbCwG6GKGGGLjOWz9X3x"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-brand-blue hover:bg-brand-blue-hover text-brand-white border border-brand-blue py-2.5 px-4 transition duration-150 rounded-none text-xs font-semibold tracking-wider uppercase"
          >
            <svg 
              className="w-6 h-6 shrink-0 fill-current" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
            </svg>
            <span>WhatsApp Channel</span>
          </Link>
        </div>
      </div>

      {/* Navigation Buttons */}
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
            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
            <img src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-8 w-auto object-contain hidden sm:block" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
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