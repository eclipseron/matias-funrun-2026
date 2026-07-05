'use strict';
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  
  const CUTOFF_EARLY_BIRD = new Date('2026-11-10T23:59:59');
  const isEarlyBird = new Date() < CUTOFF_EARLY_BIRD;
  const activePrice = isEarlyBird ? 'Rp 125.000' : 'Rp 175.000';
  const priceType = isEarlyBird ? 'Early Bird' : 'Harga Normal';
  
  // State for choosing competition type first
  const [competitionType, setCompetitionType] = useState('');
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    gender: '',
    birthPlace: '',
    birthDate: '',
    identityType: '',
    identityNumber: '',
    bibName: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    customRelationship: '',
    tshirtSize: '',
    customTshirtSize: '',
  });

  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file bukti transfer maksimal adalah 2MB.');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotBase64(reader.result);
    };
    reader.onerror = () => {
      setError('Gagal membaca file gambar. Silakan coba file lain.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Field parsing (handle custom inputs for "other" selections)
    const finalRelationship = formData.emergencyContactRelationship === 'other'
      ? formData.customRelationship.trim()
      : formData.emergencyContactRelationship;

    const finalTshirtSize = formData.tshirtSize === 'other'
      ? formData.customTshirtSize.trim()
      : formData.tshirtSize;

    // Form validation
    if (!competitionType) {
      setError('Silakan pilih tipe kompetisi terlebih dahulu.');
      setLoading(false);
      return;
    }
    if (!formData.name.trim()) {
      setError('Nama lengkap wajib diisi.');
      setLoading(false);
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Email tidak valid.');
      setLoading(false);
      return;
    }
    if (!formData.whatsapp.trim()) {
      setError('Nomor WhatsApp wajib diisi.');
      setLoading(false);
      return;
    }
    if (!formData.gender) {
      setError('Jenis kelamin wajib dipilih.');
      setLoading(false);
      return;
    }
    if (!formData.birthPlace.trim()) {
      setError('Tempat lahir wajib diisi.');
      setLoading(false);
      return;
    }
    if (!formData.birthDate) {
      setError('Tanggal lahir wajib diisi.');
      setLoading(false);
      return;
    }
    if (!formData.identityType) {
      setError('Jenis identitas wajib dipilih.');
      setLoading(false);
      return;
    }
    if (!formData.identityNumber.trim()) {
      setError('Nomor identitas wajib diisi.');
      setLoading(false);
      return;
    }
    if (!formData.bibName.trim()) {
      setError('Nama BIB wajib diisi.');
      setLoading(false);
      return;
    }
    if (formData.bibName.trim().length > 15) {
      setError('Nama BIB maksimal 15 karakter.');
      setLoading(false);
      return;
    }
    if (!formData.emergencyContactName.trim()) {
      setError('Nama kontak darurat wajib diisi.');
      setLoading(false);
      return;
    }
    if (!finalRelationship) {
      setError('Hubungan kontak darurat wajib diisi.');
      setLoading(false);
      return;
    }
    if (!finalTshirtSize) {
      setError('Ukuran kaos wajib diisi.');
      setLoading(false);
      return;
    }
    if (!screenshotBase64) {
      setError('Bukti pembayaran wajib diunggah.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competition_type: competitionType,
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          gender: formData.gender,
          birth_place: formData.birthPlace,
          birth_date: formData.birthDate,
          identity_type: formData.identityType,
          identity_number: formData.identityNumber,
          bib_name: formData.bibName,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_relationship: finalRelationship,
          tshirt_size: finalTshirtSize,
          payment_screenshot: screenshotBase64,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Pendaftaran gagal. Silakan coba kembali.');
      }

      router.push(`/register/success?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Terjadi kesalahan tidak terduga. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-brand-dark">
      {/* Header */}
      <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-matias-run.png" alt="Matias Fun Run 2026" className="h-12 w-auto object-contain" />
            <div className="h-6 w-[1px] bg-slate-700 hidden sm:block"></div>
            <img src="/logo-paroki.png" alt="Paroki Kosambi Baru" className="h-8 w-auto object-contain hidden sm:block" />
          </Link>
          <Link href="/" className="text-sm font-semibold hover:text-slate-300 text-brand-white border border-slate-700 px-4 py-2 hover:bg-brand-dark-light transition">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Rincian Pembayaran */}
            <div className="bg-brand-white border border-brand-border p-6 rounded-none">
              <h2 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 border-b border-brand-border pb-2 font-mono">
                INFORMASI PEMBAYARAN
              </h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Silakan lakukan pembayaran sebesar <strong className="text-brand-dark">{activePrice}</strong> ({priceType}) ke rekening berikut sebelum mengisi formulir:
              </p>
              
              <div className="bg-brand-light border border-brand-border p-4 mb-4 text-xs">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-2 text-slate-500 font-medium">Bank:</td>
                      <td className="py-2 font-bold text-brand-dark flex items-center gap-2">
                        Bank BCA
                        <img src="/bca-logo.svg" alt="BCA Logo" className="h-6 w-auto object-contain" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">No. Rekening:</td>
                      <td className="py-1 font-mono font-bold text-brand-blue tracking-wide">877-009-8765</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">Penerima:</td>
                      <td className="py-1 font-bold text-brand-dark">Asosiasi Matias Fun Run</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-500 font-medium">Nominal:</td>
                      <td className="py-1 font-bold text-brand-dark">{activePrice} <span className="text-[10px] text-slate-500 font-normal">({priceType})</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-brand-blue-light border-l-4 border-brand-blue p-4 text-[11px] text-brand-blue-hover leading-relaxed">
                <strong>PENTING:</strong> Simpan bukti transfer dalam format gambar (PNG/JPG) untuk diunggah sebagai prasyarat pendaftaran.
              </div>
            </div>

            {/* Service Desk Placeholders */}
            <div className="bg-brand-white border border-brand-border p-6 rounded-none">
              <h2 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-4 border-b border-brand-border pb-2 font-mono">
                LAYANAN INFORMASI
              </h2>
              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Butuh bantuan mengenai pendaftaran, konfirmasi transaksi pembayaran, atau pengambilan jersey? Hubungi layanan bantuan kami:
                </p>
                <div className="pt-2 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-[70px]">Email:</span>
                    <a href="mailto:info@matias-funrun.my.id" className="text-brand-blue hover:underline">info@matias-funrun.my.id</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-[70px]">Telepon:</span>
                    <span className="text-slate-800">+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-[70px]">Jam Layanan:</span>
                    <span className="text-slate-800">Senin - Jumat, 09:00 - 17:00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Form / Selection Column (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: Choose Competition Type first */}
            {!competitionType ? (
              <div className="bg-brand-white border border-brand-border p-8 rounded-none text-center">
                <h2 className="text-2xl font-black text-brand-dark tracking-tight mb-2">
                  PILIH KATEGORI ACARA
                </h2>
                <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
                  Silakan tentukan kategori acara yang ingin Anda ikuti terlebih dahulu untuk membuka formulir pendaftaran.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  
                  <button
                    type="button"
                    onClick={() => setCompetitionType('Fun Run')}
                    className="border-2 border-brand-dark hover:border-brand-blue bg-brand-dark hover:bg-brand-blue text-brand-white p-8 rounded-none transition duration-150 group cursor-pointer"
                  >
                    <h3 className="text-xl font-bold tracking-wider mb-2 font-mono group-hover:text-brand-white">
                      FUN RUN
                    </h3>
                    <p className="text-xs text-slate-300 group-hover:text-blue-100">
                      Rute Lari Komunitas (4K). BIB personal, medali finisher, dan jersey pelari.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompetitionType('Fun Walk')}
                    className="border-2 border-brand-dark hover:border-brand-blue bg-brand-white hover:bg-brand-blue text-brand-dark hover:text-brand-white p-8 rounded-none transition duration-150 group cursor-pointer"
                  >
                    <h3 className="text-xl font-bold tracking-wider mb-2 font-mono text-brand-dark group-hover:text-brand-white">
                      FUN WALK
                    </h3>
                    <p className="text-xs text-slate-500 group-hover:text-blue-100">
                      Rute Jalan Sehat Santai (2.5K). Nomor BIB, medali finisher, dan jersey peserta.
                    </p>
                  </button>

                </div>
              </div>
            ) : (
              
              /* STEP 2: The Registration Form */
              <div className="bg-brand-white border border-brand-border p-8 rounded-none">
                
                {/* Selected category header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-brand-light border border-brand-border p-4 mb-6 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Kategori Pendaftaran</span>
                    <h3 className="text-lg font-black text-brand-blue tracking-wide uppercase font-mono">{competitionType}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Mengubah kategori akan menyetel ulang form. Lanjutkan?')) {
                        setCompetitionType('');
                        setScreenshotBase64('');
                        setFileName('');
                        setError('');
                      }
                    }}
                    className="text-xs text-brand-dark hover:text-brand-blue font-bold underline font-mono cursor-pointer"
                  >
                    [ UBAH KATEGORI ]
                  </button>
                </div>

                <h2 className="text-xl font-black text-brand-dark tracking-tight mb-6">
                  FORMULIR PENDAFTARAN PESERTA
                </h2>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Bagian 1: Data Diri Pelari */}
                  <div className="border-b border-brand-border pb-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      I. DATA DIRI PESERTA
                    </h3>

                    {/* Nama Lengkap */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Nama Lengkap (sesuai kartu identitas) *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Budi Santoso"
                        disabled={loading}
                        className="flat-input text-sm"
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Jenis Kelamin *
                      </label>
                      <div className="flex gap-6 mt-1">
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Laki-laki"
                            checked={formData.gender === 'Laki-laki'}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="accent-brand-blue"
                          />
                          Laki-laki
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Perempuan"
                            checked={formData.gender === 'Perempuan'}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="accent-brand-blue"
                          />
                          Perempuan
                        </label>
                      </div>
                    </div>

                    {/* Tempat & Tanggal Lahir */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="birthPlace" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Tempat Lahir *
                        </label>
                        <input
                          type="text"
                          id="birthPlace"
                          name="birthPlace"
                          value={formData.birthPlace}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Jakarta"
                          disabled={loading}
                          className="flat-input text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="birthDate" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Tanggal Lahir *
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="flat-input text-sm"
                        />
                      </div>
                    </div>

                    {/* Jenis & Nomor Identitas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label htmlFor="identityType" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Jenis Identitas *
                        </label>
                        <select
                          id="identityType"
                          name="identityType"
                          value={formData.identityType}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="flat-input text-sm"
                        >
                          <option value="">-- Pilih --</option>
                          <option value="KTP/NIK">KTP/NIK</option>
                          <option value="Paspor">Paspor</option>
                          <option value="Kitas">Kitas</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="identityNumber" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nomor Identitas *
                        </label>
                        <input
                          type="text"
                          id="identityNumber"
                          name="identityNumber"
                          value={formData.identityNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 3171xxxxxxxxxxxx"
                          disabled={loading}
                          className="flat-input text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bagian 2: Kontak & Detail BIB/Jersey */}
                  <div className="border-b border-brand-border pb-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      II. KONTAK &amp; ATRIBUT PESERTA
                    </h3>

                    {/* Email & Whatsapp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Alamat Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. budi@gmail.com"
                          disabled={loading}
                          className="flat-input text-sm"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Email tiket QR code dan konfirmasi dikirim ke sini.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="whatsapp" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nomor WhatsApp *
                        </label>
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 081234567890"
                          disabled={loading}
                          className="flat-input text-sm"
                        />
                      </div>
                    </div>

                    {/* Nama BIB */}
                    <div>
                      <label htmlFor="bibName" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Nama Peserta untuk Nomor Dada (BIB) *
                      </label>
                      <input
                        type="text"
                        id="bibName"
                        name="bibName"
                        value={formData.bibName}
                        onChange={handleInputChange}
                        required
                        maxLength={15}
                        placeholder="e.g. BUDI (Maksimal 15 karakter)"
                        disabled={loading}
                        className="flat-input text-sm font-mono"
                      />
                    </div>

                    {/* Ukuran Kaos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tshirtSize" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Ukuran Kaos (Jersey) *
                        </label>
                        <select
                          id="tshirtSize"
                          name="tshirtSize"
                          value={formData.tshirtSize}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="flat-input text-sm"
                        >
                          <option value="">-- Pilih Ukuran --</option>
                          <option value="xs">XS</option>
                          <option value="s">S</option>
                          <option value="m">M</option>
                          <option value="l">L</option>
                          <option value="xl">XL</option>
                          <option value="xxl">XXL</option>
                          <option value="other">Lainnya (Tulis manual)</option>
                        </select>
                      </div>
                      
                      {formData.tshirtSize === 'other' && (
                        <div>
                          <label htmlFor="customTshirtSize" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                            Tulis Ukuran Kaos Anda *
                          </label>
                          <input
                            type="text"
                            id="customTshirtSize"
                            name="customTshirtSize"
                            value={formData.customTshirtSize}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. XXXL, 4XL, dsb."
                            disabled={loading}
                            className="flat-input text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bagian 3: Kontak Darurat */}
                  <div className="border-b border-brand-border pb-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      III. KONTAK DARURAT (EMERGENCY CONTACT)
                    </h3>

                    {/* Nama Kontak Darurat */}
                    <div>
                      <label htmlFor="emergencyContactName" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Nama Kontak Darurat *
                      </label>
                      <input
                        type="text"
                        id="emergencyContactName"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Siti Rahma"
                        disabled={loading}
                        className="flat-input text-sm"
                      />
                    </div>

                    {/* Hubungan Kontak Darurat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContactRelationship" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Hubungan dengan Kontak *
                        </label>
                        <select
                          id="emergencyContactRelationship"
                          name="emergencyContactRelationship"
                          value={formData.emergencyContactRelationship}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="flat-input text-sm"
                        >
                          <option value="">-- Pilih Hubungan --</option>
                          <option value="ayah">Ayah</option>
                          <option value="ibu">Ibu</option>
                          <option value="kaka">Kaka</option>
                          <option value="adik">Adik</option>
                          <option value="suami">Suami</option>
                          <option value="istri">Istri</option>
                          <option value="anak">Anak</option>
                          <option value="teman">Teman</option>
                          <option value="other">Lainnya (Tulis manual)</option>
                        </select>
                      </div>

                      {formData.emergencyContactRelationship === 'other' && (
                        <div>
                          <label htmlFor="customRelationship" className="block text-xs font-bold text-brand-dark mb-1 uppercase tracking-wider">
                            Tulis Hubungan Lainnya *
                          </label>
                          <input
                            type="text"
                            id="customRelationship"
                            name="customRelationship"
                            value={formData.customRelationship}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Paman, Bibi, Sepupu"
                            disabled={loading}
                            className="flat-input text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bagian 4: Unggah Bukti Bayar */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      IV. UNGGAH BUKTI TRANSFER PEMBAYARAN
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">
                        Bukti Transfer Pembayaran (Maksimal 2MB) *
                      </label>
                      
                      <div className="flex flex-col items-start gap-4">
                        <div className="relative w-full">
                          <input
                            type="file"
                            id="screenshot-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                            className="hidden"
                          />
                          <label
                            htmlFor="screenshot-upload"
                            className="flex items-center justify-center border border-dashed border-slate-300 hover:border-brand-blue py-6 px-4 cursor-pointer text-sm text-slate-500 hover:text-brand-blue transition duration-150 w-full"
                          >
                            {fileName ? (
                              <span className="font-semibold text-brand-dark truncate">{fileName} (Ubah File)</span>
                            ) : (
                              <span>Klik untuk mengunggah screenshot bukti transfer (PNG, JPG)</span>
                            )}
                          </label>
                        </div>

                        {screenshotBase64 && (
                          <div className="w-full max-w-[200px] border border-brand-border p-1 bg-brand-light">
                            <p className="text-[10px] text-slate-500 font-bold mb-1 font-mono uppercase">Preview Gambar</p>
                            <img
                              src={screenshotBase64}
                              alt="Bukti bayar pratinjau"
                              className="w-full h-auto object-contain max-h-[250px]"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-brand-border">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flat-btn-blue tracking-wider text-xs uppercase ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Mengirim Data Pendaftaran...' : 'Kirim Pendaftaran'}
                    </button>
                    <p className="text-[11px] text-slate-500 mt-3 text-center">
                      Dengan mengklik tombol kirim, Anda menyatakan bahwa data yang diisi benar dan bukti transfer yang diunggah valid.
                    </p>
                  </div>

                </form>
              </div>
            )}

          </div>

        </div>
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
