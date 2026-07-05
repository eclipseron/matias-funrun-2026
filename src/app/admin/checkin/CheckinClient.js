'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper to calculate age from birthdate string
function calculateAge(birthDateString) {
  if (!birthDateString) return 'N/A';
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function CheckinClient({ initialRunner, initialCodeQuery }) {
  const router = useRouter();
  const [searchCode, setSearchCode] = useState(initialCodeQuery);
  const [runner, setRunner] = useState(initialRunner);
  const [loading, setLoading] = useState(false);
  
  // Set initial error if code in URL search params didn't return any runner
  const [error, setError] = useState(
    initialCodeQuery && !initialRunner
      ? `Data peserta terverifikasi dengan kode registrasi "${initialCodeQuery.toUpperCase()}" tidak ditemukan.`
      : ''
  );
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Runner Lookup Search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!searchCode.trim()) {
      setError('Silakan masukkan kode registrasi.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setRunner(null);

    try {
      const cleanCode = searchCode.trim().toUpperCase();
      const res = await fetch(`/api/admin/checkin?code=${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Data peserta tidak ditemukan.');
      }

      setRunner(data.runner);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  // Mark Bag Distribution as Completed
  const handleCheckinComplete = async () => {
    if (!runner) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_code: runner.registration_code }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal memperbarui status check-in.');
      }

      setRunner(data.runner);
      setSuccessMessage(`Berhasil! Running bag telah diserahkan kepada ${data.runner.name}.`);
    } catch (err) {
      setError(err.message || 'Kesalahan memproses check-in.');
    } finally {
      setLoading(false);
    }
  };

  // Clear current lookup
  const handleClear = () => {
    setSearchCode('');
    setRunner(null);
    setError('');
    setSuccessMessage('');
    router.replace('/admin/checkin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-brand-dark">
      
      {/* Navbar */}
      <header className="bg-brand-dark text-brand-white py-4 px-4 sm:px-6 lg:px-8 border-b border-brand-dark">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-matias-run.png" alt="Matias Fun Run" className="h-10 w-auto object-contain" />
            <div className="h-6 w-[1px] bg-slate-700"></div>
            <img src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-8 w-auto object-contain hidden sm:block" />
            <div className="pl-1">
              <h1 className="text-sm font-bold text-brand-white leading-tight">
                CHECK-IN <span className="text-brand-blue">RACE BAG</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider leading-none">
                Meja Verifikasi Lapangan
              </p>
            </div>
          </div>
          <Link href="/admin/dashboard" className="text-xs bg-transparent hover:bg-brand-dark-light text-brand-white border border-slate-600 font-semibold py-2 px-4 transition duration-150 rounded-none tracking-wider">
            &larr; KEMBALI KE DASHBOARD
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-brand-blue-light border-l-4 border-brand-blue p-4 mb-6 text-sm text-brand-blue-hover font-semibold">
            {successMessage}
          </div>
        )}

        {/* Search Panel */}
        <div className="bg-brand-white border border-brand-border p-6 mb-8 rounded-none">
          <h2 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 border-b border-brand-border pb-2 font-mono">
            CARI KODE REGISTRASI PESERTA
          </h2>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Masukkan 8 Karakter Kode Registrasi (Contoh: AB12CD34)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              disabled={loading}
              className="flat-input text-md font-mono tracking-widest flex-grow"
              required
              maxLength={12}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flat-btn-blue text-sm flex-grow sm:flex-none uppercase tracking-wide whitespace-nowrap font-mono"
              >
                {loading ? 'Mencari...' : 'CARI KODE'}
              </button>
              {(runner || error || searchCode) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent hover:bg-brand-light text-brand-dark border border-brand-dark font-semibold py-2 px-4 transition duration-150 rounded-none text-sm tracking-wide font-mono"
                >
                  BATAL
                </button>
              )}
            </div>
          </form>
          <p className="text-xs text-slate-400 mt-2">
            Tip: Pemindaian QR Code di email akan mengarahkan ke halaman ini secara otomatis.
          </p>
        </div>

        {/* Runner Details Results */}
        {runner && (
          <div className="bg-brand-white border border-brand-border p-8 rounded-none space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-brand-border pb-6 gap-4">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Profil Pendaftar Terverifikasi</span>
                <h2 className="text-2xl font-black text-brand-dark tracking-tight mt-1">{runner.name}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{runner.email} | {runner.whatsapp}</p>
                <div className="flex gap-2 items-center mt-3 font-mono text-xs text-slate-400">
                  <span>UUID:</span>
                  <span className="bg-brand-light px-1.5 py-0.5 border border-brand-border select-all">{runner.uuid}</span>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Kode Registrasi</span>
                <span className="text-3xl font-mono font-bold text-brand-blue-hover tracking-widest bg-brand-light border border-brand-blue-border px-3 py-1">
                  {runner.registration_code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Details & Checkin Action */}
              <div className="space-y-6 text-xs">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Kategori Kompetisi</h4>
                    <p className="text-sm font-black text-brand-dark uppercase font-mono">{runner.competition_type}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Jenis Kelamin &amp; Umur</h4>
                    <p className="text-sm font-bold text-brand-dark">
                      {runner.gender} | <span className="text-brand-blue font-mono">{calculateAge(runner.birth_date)} Tahun</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Nama BIB Dada</h4>
                    <p className="text-sm font-bold text-brand-dark font-mono uppercase">{runner.bib_name}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ukuran Jersey</h4>
                    <p className="text-sm font-bold text-brand-dark uppercase font-mono">{runner.tshirt_size}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Identitas ({runner.identity_type})</h4>
                    <p className="text-xs font-semibold text-slate-700 font-mono">{runner.identity_number}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TTL</h4>
                    <p className="text-xs font-semibold text-slate-700">{runner.birth_place}, {new Date(runner.birth_date).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                <div className="border-t border-brand-border pt-4">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Kontak Darurat</h4>
                  <p className="text-xs font-bold text-slate-800">{runner.emergency_contact_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hubungan: <span className="capitalize font-semibold text-brand-blue">{runner.emergency_contact_relationship}</span></p>
                </div>

                <div className="border-t border-brand-border pt-4">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">Status Pengambilan Bag</h4>
                  
                  {runner.status === 'verified' && (
                    <div className="inline-block bg-brand-blue-light text-brand-blue-hover text-xs font-semibold px-3 py-1.5 rounded-none border border-brand-blue-border uppercase font-mono">
                      Terverifikasi (Lunas - Siap Ambil Race Bag)
                    </div>
                  )}

                  {runner.status === 'completed' && (
                    <div className="space-y-2">
                      <div className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-none border border-slate-200 uppercase font-mono">
                        Sudah Diambil (Selesai)
                      </div>
                      {runner.bag_distributed_at && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          Diambil pada: {new Date(runner.bag_distributed_at).toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  )}

                  {runner.status === 'pending' && (
                    <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-none border border-yellow-200 uppercase font-mono">
                      Pending Verifikasi (Pembayaran Belum Valid)
                    </div>
                  )}
                </div>

                {/* Checkin Distribution Action Button */}
                <div className="pt-6 border-t border-brand-border">
                  {runner.status === 'verified' ? (
                    <button
                      onClick={handleCheckinComplete}
                      disabled={loading}
                      className="w-full bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-bold py-4 px-6 transition duration-150 rounded-none text-sm tracking-wider uppercase font-mono"
                    >
                      {loading ? 'Memproses...' : 'SELESAI (MARK BAG AS DISTRIBUTED)'}
                    </button>
                  ) : runner.status === 'completed' ? (
                    <button
                      disabled
                      className="w-full bg-slate-200 text-slate-500 font-bold py-4 px-6 rounded-none text-sm tracking-wider cursor-not-allowed border border-slate-300 font-mono"
                    >
                      BAG SUDAH DIAMBIL
                    </button>
                  ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-xs text-yellow-800 leading-relaxed">
                      <strong>TIDAK DAPAT DILEPAS:</strong> Transaksi pendaftar ini belum diverifikasi oleh admin. Harap verifikasi bukti transfer terlebih dahulu di dashboard utama.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Receipt Verification */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Foto Bukti Pembayaran</h4>
                {runner.payment_screenshot ? (
                  <div className="border border-brand-border p-2 bg-brand-light">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={runner.payment_screenshot}
                      alt={`Bukti bayar ${runner.name}`}
                      className="w-full h-auto object-contain max-h-[300px]"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Bukti pembayaran tidak tersimpan.</p>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-500 py-6 px-4 text-center text-xs border-t border-slate-800">
        <p>&copy; 2026 Matias Fun Run &amp; Walk. On-Site Check-in Portal.</p>
      </footer>

    </div>
  );
}
