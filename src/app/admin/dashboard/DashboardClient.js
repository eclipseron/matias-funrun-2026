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

export default function DashboardClient({ initialRunners }) {
  const router = useRouter();
  const [runners, setRunners] = useState(initialRunners);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Verification states
  const [verifyingId, setVerifyingId] = useState(null);
  const [actionError, setActionError] = useState('');

  // Runner Details Modal state
  const [activeRunner, setActiveRunner] = useState(null);
  const [activeScreenshot, setActiveScreenshot] = useState('');
  const [loadingScreenshot, setLoadingScreenshot] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter, pageSize]);

  // Stats calculation
  const totalCount = runners.length;
  const pendingCount = runners.filter((r) => r.status === 'pending').length;
  const verifiedCount = runners.filter((r) => r.status === 'verified').length;
  const completedCount = runners.filter((r) => r.status === 'completed').length;

  // Handle Logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Open details modal and fetch screenshot
  const openDetailsModal = async (runner) => {
    setActiveRunner(runner);
    setActiveScreenshot('');
    setLoadingScreenshot(true);
    try {
      const res = await fetch(`/api/admin/screenshot?id=${runner.id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveScreenshot(data.payment_screenshot);
      } else {
        setActionError(data.error || 'Gagal memuat bukti pembayaran.');
      }
    } catch (err) {
      setActionError('Kesalahan koneksi saat memuat bukti pembayaran.');
    } finally {
      setLoadingScreenshot(false);
    }
  };

  // Close details modal
  const closeDetailsModal = () => {
    setActiveRunner(null);
    setActiveScreenshot('');
  };

  // Trigger verify payment for runner
  const handleVerify = async (id) => {
    if (!confirm('Apakah Anda yakin ingin memverifikasi pembayaran ini dan membuat kode registrasi?')) return;
    
    setVerifyingId(id);
    setActionError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Verifikasi gagal.');
      }

      // Update local state immediately
      setRunners((prev) =>
        prev.map((runner) =>
          runner.id === id
            ? { ...runner, status: 'verified', registration_code: data.runner.registration_code }
            : runner
        )
      );

      // If details modal is open for this runner, update the modal display status too
      if (activeRunner && activeRunner.id === id) {
        setActiveRunner((prev) => ({
          ...prev,
          status: 'verified',
          registration_code: data.runner.registration_code
        }));
      }
    } catch (err) {
      setActionError(err.message || 'Error memverifikasi pendaftaran.');
    } finally {
      setVerifyingId(null);
    }
  };

  // Filter and search runners
  const filteredRunners = runners.filter((runner) => {
    const matchesStatus = statusFilter === 'all' || runner.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || runner.competition_type === categoryFilter;
    
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      runner.name.toLowerCase().includes(term) ||
      runner.email.toLowerCase().includes(term) ||
      runner.whatsapp.includes(term) ||
      runner.birth_place.toLowerCase().includes(term) ||
      runner.identity_number.includes(term) ||
      runner.bib_name.toLowerCase().includes(term) ||
      (runner.registration_code && runner.registration_code.toLowerCase().includes(term)) ||
      runner.uuid.toLowerCase().includes(term);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Pagination Calculations
  const totalItems = filteredRunners.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedRunners = filteredRunners.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      
      {/* Admin Navbar */}
      <header className="bg-brand-dark text-brand-white py-4 px-4 sm:px-6 lg:px-8 border-b border-brand-dark">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo-matias-run.png" alt="Matias Fun Run" className="h-10 w-auto object-contain" />
            <div className="h-6 w-[1px] bg-slate-700"></div>
            <img src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-8 w-auto object-contain hidden sm:block" />
            <div className="pl-1">
              <h1 className="text-sm font-bold text-brand-white leading-tight">
                MATIAS FUN RUN <span className="text-brand-blue">ADMIN</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider leading-none">
                Registrasi &amp; Verifikasi
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/checkin" className="inline-block bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-semibold py-2 px-4 transition duration-150 rounded-none text-xs tracking-wider">
              CHECK-IN RACE BAG
            </Link>
            <button
              onClick={handleLogout}
              className="bg-transparent hover:bg-brand-dark-light text-brand-white border border-slate-600 font-semibold py-2 px-4 transition duration-150 rounded-none text-xs tracking-wider"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Verification Errors Notification */}
        {actionError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-sm text-red-700">
            {actionError}
            <button onClick={() => setActionError('')} className="float-right font-bold">&times;</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-brand-white border border-brand-border p-5 rounded-none">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Pendaftar</p>
            <h3 className="text-3xl font-extrabold text-brand-dark mt-2">{totalCount}</h3>
          </div>

          <div className="bg-brand-white border border-brand-border p-5 rounded-none border-l-4 border-yellow-500">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider text-yellow-600">Menunggu Verifikasi</p>
            <h3 className="text-3xl font-extrabold text-brand-dark mt-2">{pendingCount}</h3>
          </div>

          <div className="bg-brand-white border border-brand-border p-5 rounded-none border-l-4 border-brand-blue">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider text-brand-blue">Terverifikasi (Lunas)</p>
            <h3 className="text-3xl font-extrabold text-brand-dark mt-2">{verifiedCount}</h3>
          </div>

          <div className="bg-brand-white border border-brand-border p-5 rounded-none border-l-4 border-slate-400">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider text-slate-500">Bag Terdistribusi</p>
            <h3 className="text-3xl font-extrabold text-brand-dark mt-2">{completedCount}</h3>
          </div>

        </div>

        {/* Filters Controls Panel */}
        <div className="bg-brand-white border border-brand-border p-6 mb-6 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="Cari Nama, Email, WhatsApp, NIK, Kode, UUID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flat-input text-sm"
            />
          </div>

          {/* Filter Dropdown & Export */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Kategori Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">Kategori:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-brand-border bg-brand-white p-2 text-xs rounded-none text-brand-dark outline-none focus:border-brand-blue"
              >
                <option value="all">Semua Kategori</option>
                <option value="Fun Run">Fun Run</option>
                <option value="Fun Walk">Fun Walk</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-brand-border bg-brand-white p-2 text-xs rounded-none text-brand-dark outline-none focus:border-brand-blue"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <a
              href="/api/admin/export"
              download
              className="bg-brand-dark hover:bg-brand-dark-hover text-brand-white font-semibold py-2 px-4 transition duration-150 rounded-none text-xs tracking-wider inline-flex items-center gap-1"
            >
              📊 EXPORT EXCEL
            </a>

          </div>

        </div>

        {/* Runners Data Table */}
        <div className="bg-brand-white border border-brand-border rounded-none overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-dark text-brand-white text-xs font-mono uppercase tracking-wider">
                <th className="p-4 border-b border-brand-dark font-semibold">ID</th>
                <th className="p-4 border-b border-brand-dark font-semibold">Kategori</th>
                <th className="p-4 border-b border-brand-dark font-semibold">Peserta (Gender &amp; Umur)</th>
                <th className="p-4 border-b border-brand-dark font-semibold">Kontak</th>
                <th className="p-4 border-b border-brand-dark font-semibold">BIB &amp; Kaos</th>
                <th className="p-4 border-b border-brand-dark font-semibold">Status</th>
                <th className="p-4 border-b border-brand-dark font-semibold">Kode</th>
                <th className="p-4 border-b border-brand-dark font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {filteredRunners.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 font-medium">
                    Tidak ada data pendaftar yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedRunners.map((runner, index) => (
                  <tr key={runner.id} className={index % 2 === 0 ? 'bg-brand-white' : 'bg-brand-light'}>
                    <td className="p-4 font-mono font-bold text-slate-400">{runner.id}</td>
                    <td className="p-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-none font-mono border uppercase ${
                        runner.competition_type === 'Fun Run 4K' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {runner.competition_type}
                      </span>
                      {
                        runner.payment_period && 
                        <p className="ml-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-none font-mono border uppercase bg-cyan-50 text-cyan-700 border-cyan-200">
                          {runner.payment_period}
                        </p>
                      }
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-brand-dark">{runner.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wide font-mono">
                        {runner.gender === 'Laki-laki' ? 'Laki-laki (L)' : 'Perempuan (P)'} | <strong className="text-brand-blue">{calculateAge(runner.birth_date)} Tahun</strong>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">Lahir: {runner.birth_place}, {new Date(runner.birth_date).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-slate-700">{runner.whatsapp}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{runner.email}</p>
                    </td>
                    <td className="p-4 font-mono">
                      <p className="text-xs font-bold text-slate-800">BIB: {runner.bib_name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Kaos: <span className="uppercase font-bold text-slate-700">{runner.tshirt_size}</span></p>
                    </td>
                    <td className="p-4">
                      {runner.status === 'pending' && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-none border border-yellow-200 uppercase font-mono">
                          Pending
                        </span>
                      )}
                      {runner.status === 'verified' && (
                        <span className="inline-block bg-brand-blue-light text-brand-blue-hover text-[10px] font-bold px-2 py-0.5 rounded-none border border-brand-blue-border uppercase font-mono">
                          Verified
                        </span>
                      )}
                      {runner.status === 'completed' && (
                        <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-none border border-slate-200 uppercase font-mono">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-brand-dark">
                      {runner.registration_code ? (
                        <span className="bg-brand-light border border-brand-border px-1.5 py-0.5 select-all">{runner.registration_code}</span>
                      ) : (
                        <span className="text-slate-400 font-normal italic text-xs">Belum Ada</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      
                      {/* View Screenshot / Details */}
                      <button
                        onClick={() => openDetailsModal(runner)}
                        className="bg-transparent hover:bg-brand-light text-brand-dark border border-brand-dark font-semibold py-1.5 px-3 transition duration-150 rounded-none text-xs tracking-wider uppercase font-mono"
                      >
                        DETAIL
                      </button>

                      {/* Verify Action */}
                      {runner.status === 'pending' && (
                        <button
                          onClick={() => handleVerify(runner.id)}
                          disabled={verifyingId === runner.id}
                          className="bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-semibold py-1.5 px-3 transition duration-150 rounded-none text-xs tracking-wider disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono"
                        >
                          {verifyingId === runner.id ? 'PROSES...' : 'VERIFIKASI'}
                        </button>
                      )}

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredRunners.length > 0 && (
          <div className="bg-brand-white border border-brand-border border-t-0 p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <span>Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border border-brand-border bg-brand-white p-1 rounded-none text-brand-dark font-bold outline-none focus:border-brand-blue"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>data per halaman</span>
            </div>

            <div>
              <span>
                Menampilkan <strong className="text-brand-dark">{startIndex + 1}</strong> - <strong className="text-brand-dark">{endIndex}</strong> dari <strong className="text-brand-dark">{totalItems}</strong> pendaftar
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={activePage === 1}
                className="px-2.5 py-1 border border-brand-border bg-brand-white text-brand-dark hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                title="Halaman Pertama"
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-2.5 py-1 border border-brand-border bg-brand-white text-brand-dark hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                title="Halaman Sebelumnya"
              >
                &larr;
              </button>
              
              <span className="px-3 py-1 bg-brand-light border border-brand-border text-brand-dark font-bold">
                Hal {activePage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={activePage === totalPages}
                className="px-2.5 py-1 border border-brand-border bg-brand-white text-brand-dark hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                title="Halaman Selanjutnya"
              >
                &rarr;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={activePage === totalPages}
                className="px-2.5 py-1 border border-brand-border bg-brand-white text-brand-dark hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                title="Halaman Terakhir"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Modal: View Details & Receipt */}
      {activeRunner && (
        <div className="fixed inset-0 bg-brand-dark bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-brand-white border border-brand-border p-6 max-w-2xl w-full rounded-none relative">
            
            <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
              <div>
                <h3 className="font-black text-brand-dark text-lg uppercase tracking-tight">Detail Peserta &amp; Bukti Transfer</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Pendaftar ID: {activeRunner.id} | UUID: {activeRunner.uuid}</p>
              </div>
              <button
                onClick={closeDetailsModal}
                className="text-slate-400 hover:text-brand-dark text-2xl font-bold font-mono cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Full Registration Data */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Kategori Pilihan</h4>
                  <p className="text-sm font-bold text-brand-dark uppercase font-mono">{activeRunner.competition_type}</p>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Nama Lengkap &amp; Jenis Kelamin</h4>
                  <p className="text-sm font-bold text-brand-dark">{activeRunner.name} ({activeRunner.gender === 'Laki-laki' ? 'L' : 'P'})</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TTL &amp; Umur</h4>
                    <p className="text-xs font-semibold text-brand-dark">
                      {activeRunner.birth_place}, {new Date(activeRunner.birth_date).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-brand-blue font-bold font-mono mt-0.5">{calculateAge(activeRunner.birth_date)} Tahun</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Identitas ({activeRunner.identity_type})</h4>
                    <p className="text-xs font-semibold text-brand-dark font-mono">{activeRunner.identity_number}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Atribut Peserta</h4>
                    <p className="text-xs text-brand-dark font-bold">BIB: {activeRunner.bib_name}</p>
                    <p className="text-xs text-brand-dark uppercase">Kaos: {activeRunner.tshirt_size}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Kontak Utama</h4>
                    <p className="text-xs font-semibold text-brand-dark font-mono">{activeRunner.whatsapp}</p>
                    <p className="text-xs text-slate-500 truncate">{activeRunner.email}</p>
                  </div>
                </div>

                <div className="border-t border-brand-border pt-3">
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Kontak Darurat</h4>
                  <p className="text-xs font-bold text-slate-800">{activeRunner.emergency_contact_number} ({activeRunner.emergency_contact_name})</p>
                  <p className="text-xs text-slate-600 mt-0.5">Hubungan: <span className="capitalize font-semibold text-brand-blue">{activeRunner.emergency_contact_relationship}</span></p>
                </div>
              </div>

              <div className="border-t border-brand-border pt-4 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Status Pembayaran</p>
                  {activeRunner.status === 'pending' && <span className="text-amber-500 font-bold uppercase font-mono">Menunggu Verifikasi</span>}
                  {activeRunner.status === 'verified' && <span className="text-brand-blue font-bold uppercase font-mono">Terverifikasi (Kode: {activeRunner.registration_code})</span>}
                  {activeRunner.status === 'completed' && <span className="text-slate-500 font-bold uppercase font-mono">Selesai (Bag Diambil)</span>}
                </div>
              </div>

              {/* Right Column: Screenshot Receipt */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Bukti Pembayaran Transfer</h4>
                {loadingScreenshot ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-brand-border bg-brand-light">
                    <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-wide">Memuat Gambar...</p>
                  </div>
                ) : activeScreenshot ? (
                  <div className="bg-brand-light border border-brand-border p-2 text-center overflow-auto max-h-[40vh] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeScreenshot}
                      alt={`Bukti bayar ${activeRunner.name}`}
                      className="max-w-full h-auto object-contain max-h-[35vh]"
                    />
                  </div>
                ) : (
                  <div className="py-8 text-center text-red-500 font-semibold text-xs border border-brand-border">
                    Gagal memuat bukti pembayaran.
                  </div>
                )}
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-border">
              {activeRunner.status === 'pending' && !loadingScreenshot && activeScreenshot && (
                <button
                  onClick={() => {
                    const id = activeRunner.id;
                    closeDetailsModal();
                    handleVerify(id);
                  }}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-brand-white font-semibold py-2 px-4 transition duration-150 rounded-none text-xs tracking-wider uppercase font-mono"
                >
                  VERIFIKASI &amp; KIRIM EMAIL
                </button>
              )}
              <button
                onClick={closeDetailsModal}
                className="bg-brand-dark hover:bg-brand-dark-hover text-brand-white font-semibold py-2 px-4 transition duration-150 rounded-none text-xs tracking-wider uppercase font-mono"
              >
                TUTUP
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-dark text-slate-500 py-6 px-4 text-center text-xs border-t border-slate-800">
        <p>&copy; 2026 Matias Fun Run &amp; Walk. Halaman Administrator.</p>
      </footer>

    </div>
  );
}
