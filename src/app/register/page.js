'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRegistrationPeriod } from '@/lib/registrationPeriods';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function Register() {
  const router = useRouter();
  
  const [periodInfo, setPeriodInfo] = useState(() => getRegistrationPeriod());
  
  const activePrice = periodInfo.priceString;
  const priceType = periodInfo.periodName;
  
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
    emergencyContactNumber: '',
    customRelationship: '',
    tshirtSize: '',
    customTshirtSize: '',
    bloodType: '',
    doctRecommendation: '',
    infoSource: '',
    prevDiagnose: '',
    prevAlergy: '',
    approval: '',
  });

  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Confirmation state
  const [isChecked, setIsChecked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (validationErrors.paymentScreenshot) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentScreenshot;
        return newErrors;
      });
    }

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

  const processSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setError('');

    // Field parsing (handle custom inputs for "other" selections)
    const finalRelationship = formData.emergencyContactRelationship === 'other'
      ? formData.customRelationship.trim()
      : formData.emergencyContactRelationship;

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
          emergency_contact_number: formData.emergencyContactNumber,
          tshirt_size: formData.tshirtSize,
          payment_screenshot: screenshotBase64,
          blood_type: formData.bloodType,
          doct_recommendation: formData.doctRecommendation,
          info_source: formData.infoSource,
          prev_diagnose: formData.prevDiagnose,
          prev_alergy: formData.prevAlergy,
          approval: isChecked,
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

  const handleFormSubmitClick = (e) => {
    e.preventDefault();
    
    const errors = {};
    let firstErrorField = null;

    const checkField = (condition, fieldName, errorMessage) => {
      if (condition) {
        errors[fieldName] = errorMessage;
        if (!firstErrorField) firstErrorField = fieldName;
      }
    };

    checkField(!competitionType, 'competitionType', 'Silakan pilih tipe kompetisi terlebih dahulu.');
    checkField(!formData.name.trim(), 'name', 'Nama lengkap wajib diisi.');
    checkField(!formData.email.trim() || !formData.email.includes('@'), 'email', 'Email tidak valid.');
    checkField(!formData.whatsapp.trim(), 'whatsapp', 'Nomor WhatsApp wajib diisi.');
    checkField(!formData.gender, 'gender', 'Jenis kelamin wajib dipilih.');
    checkField(!formData.birthPlace.trim(), 'birthPlace', 'Tempat lahir wajib diisi.');
    checkField(!formData.birthDate, 'birthDate', 'Tanggal lahir wajib diisi.');
    checkField(!formData.identityType, 'identityType', 'Jenis identitas wajib dipilih.');
    checkField(!formData.identityNumber.trim(), 'identityNumber', 'Nomor identitas wajib diisi.');
    checkField(!formData.bibName.trim(), 'bibName', 'Nama BIB wajib diisi.');
    checkField(formData.bibName.trim().length > 15, 'bibName', 'Nama BIB maksimal 15 karakter.');
    checkField(!formData.emergencyContactName.trim(), 'emergencyContactName', 'Nama kontak darurat wajib diisi.');
    checkField(!formData.emergencyContactNumber.trim(), 'emergencyContactNumber', 'Nomor kontak darurat wajib diisi.');
    checkField(!formData.bloodType, 'bloodType', 'Golongan darah wajib diisi.');
    checkField(!formData.doctRecommendation, 'doctRecommendation', 'Informasi rekomendasi dokter wajib diisi.');
    
    const finalRelationship = formData.emergencyContactRelationship === 'other'
      ? formData.customRelationship.trim() : formData.emergencyContactRelationship;
    checkField(!finalRelationship, 'emergencyContactRelationship', 'Hubungan kontak darurat wajib diisi.');

    const finalTshirtSize = formData.tshirtSize === 'other'
      ? formData.customTshirtSize.trim() : formData.tshirtSize;
    checkField(!finalTshirtSize, 'tshirtSize', 'Ukuran kaos wajib diisi.');

    checkField(!screenshotBase64, 'paymentScreenshot', 'Bukti pembayaran wajib diunggah.');
    checkField(!isChecked, 'terms', 'Harap centang kotak persetujuan.');

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Ada beberapa isian yang belum lengkap atau valid. Silakan periksa kolom yang ditandai merah.');
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationErrors({});
    setError('');
    setShowConfirmModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent z-0 text-brand-dark">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 size-200 bg-brand-blue/10 rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 size-150 bg-sky-300/10 rounded-full blur-3xl opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-[10%] left-0 -z-10 w-full h-200 bg-linear-to-br from-brand-blue/2 to-sky-200/5 -skew-y-6 origin-top-left pointer-events-none"></div>

      {/* Header */}
      <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-matias-run.png" alt="Matias Fun Run 2026" height={1} width={200} className="h-12 w-auto object-contain" />
            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
            <Image src="/logo-paroki.png" alt="Paroki Kosambi Baru" height={1} width={200} className="h-8 w-auto object-contain hidden sm:block" />
          </Link>
          <Link href="/" className="text-sm font-semibold hover:text-slate-300 text-brand-white border border-slate-700 px-4 py-2 hover:bg-brand-dark-light transition">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Service Desk Placeholders */}
            <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-6 sm:p-8 rounded-none relative overflow-hidden">
              <h2 className="text-lg font-black text-brand-dark uppercase tracking-tight mb-4 border-b border-slate-200 pb-3 italic">
                KONTAK
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  Butuh bantuan mengenai pendaftaran? Hubungi kami melalui:
                </p>
                <div className="pt-2 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-17.5">Email:</span>
                    <a href="mailto:matiasfunrun@gmail.com" className="text-brand-blue hover:underline">matiasfunrun@gmail.com</a>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-brand-dark min-w-17.5">Instagram:</span>
                    <Link href="https://www.instagram.com/matiasfunrun" target='_blank' className="text-slate-800 underline hover:text-brand-blue">@matiasfunrun</Link>
                  </div>
                  <div className='flex flex-col gap-1'>
                    <p className="font-semibold text-brand-dark min-w-17.5 mb-1">WhatsApp:</p>
                    <Link href={"https://wa.me/+6285811190695"} target="_blank" className="min-w-17.5 hover:underline hover:text-brand-blue-hover">0858-1119-0695 (Vicktoria)</Link>
                    <Link href={"https://wa.me/+6281317635341"} target="_blank" className="min-w-17.5 hover:underline hover:text-brand-blue-hover">0813-1763-5341 (Veronika)</Link>
                    <Link href={"https://wa.me/+6281237831860"} target="_blank" className="min-w-17.5 hover:underline hover:text-brand-blue-hover">0812-3783-1860 (Vanessa)</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Form / Selection Column (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* STEP 1: Choose Competition Type first */}
            {!periodInfo.formActive ? (
              <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 rounded-none text-center relative overflow-hidden">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="w-16 h-16 bg-amber-500 text-brand-white flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-brand-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight mb-2 uppercase italic">
                  PENDAFTARAN SEDANG DITUTUP
                </h2>
                <p className="text-sm font-mono text-amber-600 font-bold uppercase tracking-wider mb-6">
                  Status: Jeda Periode / Ditutup
                </p>
                <div className="text-slate-600 space-y-4 mb-8 text-left max-w-md mx-auto text-sm">
                  <p className="text-center font-bold text-brand-dark">
                    Informasi Penting Peserta:
                  </p>
                  <p className="bg-amber-50 border-l-4 border-amber-500 p-3 text-sm text-amber-800 leading-relaxed font-mono">
                    {periodInfo.message || 'Mohon maaf, saat ini pendaftaran tidak aktif.'}
                  </p>
                  <p className="leading-relaxed">
                    Silakan perhatikan jadwal periode pendaftaran resmi berikut agar Anda tidak melewatkan kesempatan berpartisipasi:
                  </p>
                  <div className="border border-brand-border bg-brand-light p-4 text-xs font-mono overflow-x-auto">
                    <table className="w-full whitespace-nowrap min-w-max">
                      <thead>
                        <tr className="border-b border-brand-border text-left">
                          <th className="pb-2 pr-6">Periode</th>
                          <th className="pb-2 px-6">Tanggal</th>
                          <th className="pb-2 pl-6 text-right">Biaya</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-brand-border/50 border-dashed">
                          <td className="py-2.5 pr-6 font-bold text-brand-dark">Early Bird 1</td>
                          <td className="py-2.5 px-6">15 - 30 Juli 2026</td>
                          <td className="py-2.5 pl-6 text-right font-bold text-brand-blue">Rp 125.000</td>
                        </tr>
                        <tr className="border-b border-brand-border/50 border-dashed">
                          <td className="py-2.5 pr-6 font-bold text-brand-dark">Early Bird 2</td>
                          <td className="py-2.5 px-6">15 Agt - 30 Sept 2026</td>
                          <td className="py-2.5 pl-6 text-right font-bold text-brand-blue">Rp 150.000</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-6 font-bold text-brand-dark">Normal Price</td>
                          <td className="py-2.5 px-6">4 Okt - 20 Nov 2026</td>
                          <td className="py-2.5 pl-6 text-right font-bold text-brand-blue">Rp 175.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="border-t border-brand-border pt-6 flex justify-center">
                  <Link href="/" className="inline-block bg-brand-dark hover:bg-brand-dark-hover text-brand-white font-semibold py-2.5 px-6 transition duration-150 rounded-none text-xs tracking-wider uppercase relative z-10">
                    KEMBALI KE BERANDA
                  </Link>
                </div>
              </div>
            ) : (
              !competitionType ? (
                <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 rounded-none text-center relative overflow-hidden">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none"></div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tight mb-2 uppercase italic">
                  PILIH KATEGORI
                </h2>
                <p className="text-sm text-brand-dark mb-8 max-w-md mx-auto">
                  Silakan tentukan kategori yang ingin Anda ikuti terlebih dahulu untuk membuka formulir pendaftaran.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
                  
                  <button
                    type="button"
                    onClick={() => setCompetitionType('Fun Run 4K')}
                    className="bg-white p-6 border-2 sm:border-4 border-brand-blue shadow-[8px_8px_0px_0px_rgba(0,102,255,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(0,102,255,0.25)] hover:-translate-y-1 hover:-translate-x-1 transition-all group text-left cursor-pointer"
                  >
                    <h3 className="text-xl font-black text-brand-blue italic tracking-tight mb-2">
                      FUN RUN 4K
                    </h3>
                      <p className="text-sm text-brand-dark font-medium">
                      Lebih menantang, penuh dengan energi, dan didesain tetap menyenangkan untuk pelari komunitas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompetitionType('Fun Walk 2.5K')}
                    className="bg-white p-6 border-2 sm:border-4 border-sky-400 shadow-[8px_8px_0px_0px_rgba(56,189,248,0.15)] hover:shadow-[12px_12px_0px_0px_rgba(56,189,248,0.25)] hover:-translate-y-1 hover:-translate-x-1 transition-all group text-left cursor-pointer"
                  >
                    <h3 className="text-xl font-black text-sky-500 italic tracking-tight mb-2">
                      FUN WALK 2.5K
                    </h3>
                    <p className="text-sm text-brand-dark font-medium">
                      Santai, seru, dan sangat cocok untuk diikuti oleh semua usia bersama seluruh anggota keluarga.
                    </p>
                  </button>

                </div>
              </div>
            ) : (
              
              /* STEP 2: The Registration Form */
              <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-brand-blue/5 border border-white p-8 rounded-none relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-sky-200/10 rounded-full blur-3xl pointer-events-none"></div>
                
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

                <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mb-6 uppercase italic">
                  FORMULIR PENDAFTARAN PESERTA
                </h2>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleFormSubmitClick} className="space-y-6">
                  
                  {/* Bagian 1: Data Diri Pelari */}
                  <div className="border-b border-brand-border pb-16 space-y-8">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      I. DATA DIRI PESERTA
                    </h3>

                    {/* Nama Lengkap */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider ">
                        Nama Lengkap (sesuai kartu identitas) <span className='text-rose-500'>*</span>
                      </label>
                      {validationErrors.name && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.name}</span>}
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Budi Santoso"
                        disabled={loading}
                        className={`flat-input text-sm ${validationErrors.name ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                      />
                    </div>

                    {/* Jenis Kelamin */}
                    <div id="gender">
                      <label className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Jenis Kelamin <span className='text-rose-500'>*</span>
                      </label>
                      {validationErrors.gender && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.gender}</span>}
                      <div className={`flex gap-6 mt-1 p-2 ${validationErrors.gender ? 'border border-red-500 bg-red-50/50' : ''}`}>
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
                        <label htmlFor="birthPlace" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Tempat Lahir <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.birthPlace && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.birthPlace}</span>}
                        <input
                          type="text"
                          id="birthPlace"
                          name="birthPlace"
                          value={formData.birthPlace}
                          onChange={handleInputChange}
                          placeholder="e.g. Jakarta"
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.birthPlace ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="birthDate" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Tanggal Lahir <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.birthDate && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.birthDate}</span>}
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.birthDate ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Jenis & Nomor Identitas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label htmlFor="identityType" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Jenis Identitas <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.identityType && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.identityType}</span>}
                        <select
                          id="identityType"
                          name="identityType"
                          value={formData.identityType}
                          onChange={handleInputChange}
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.identityType ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        >
                          <option value="">-- Pilih --</option>
                          <option value="KTP/NIK">KTP/NIK</option>
                          <option value="Paspor">Paspor</option>
                          <option value="Kitas">Kitas</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="identityNumber" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nomor Identitas <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.identityNumber && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.identityNumber}</span>}
                        <input
                          type="text"
                          id="identityNumber"
                          name="identityNumber"
                          value={formData.identityNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 3171****"
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.identityNumber ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bagian 2: Kontak & Detail BIB/Jersey */}
                  <div className="border-b border-brand-border pb-16 space-y-6">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      II. KONTAK &amp; ATRIBUT PESERTA
                    </h3>

                    {/* Email & Whatsapp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Alamat Email <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.email && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.email}</span>}
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. budi@gmail.com"
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.email ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Email konfirmasi dikirim ke sini.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="whatsapp" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nomor WhatsApp <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.whatsapp && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.whatsapp}</span>}
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="e.g. 081234567890"
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.whatsapp ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Nama BIB */}
                    <div>
                      <label htmlFor="bibName" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nama Peserta untuk Nomor Dada (BIB) <span className='text-rose-500'>*</span>
                      </label>
                      {validationErrors.bibName && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.bibName}</span>}
                      <input
                        type="text"
                        id="bibName"
                        name="bibName"
                        value={formData.bibName}
                        onChange={handleInputChange}
                        maxLength={15}
                        placeholder="e.g. BUDI (Maksimal 15 karakter)"
                        disabled={loading}
                        className={`flat-input text-sm font-mono ${validationErrors.bibName ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                      />
                    </div>

                    {/* Ukuran Kaos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="tshirtSize" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Ukuran Kaos (Jersey) <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.tshirtSize && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.tshirtSize}</span>}
                          <Image alt="jersey-chart" height={1080} width={1080} src='/jersey-chart.jpeg' className='w-72 mb-4' />
                        <select
                          id="tshirtSize"
                          name="tshirtSize"
                          value={formData.tshirtSize}
                          onChange={handleInputChange}
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.tshirtSize ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        >
                          <option value="">-- Pilih Ukuran --</option>
                          <option value="xs">XS</option>
                          <option value="s">S</option>
                          <option value="m">M</option>
                          <option value="l">L</option>
                          <option value="xl">XL</option>
                          <option value="xxl">XXL</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bagian 3: Informasi Kesehatan Peserta */}
                  <div className="border-b border-brand-border pb-16 space-y-8">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      III. INFORMASI KESEHATAN PESERTA
                    </h3>

                    {/* Golongan Darah */}
                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider ">
                        Golongan Darah <span className='text-rose-500'>*</span>
                      </label>
                        {validationErrors.bloodType && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.bloodType}</span>}
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`flat-input text-sm ${validationErrors.bloodType ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                      >
                        <option value="">-- Pilih --</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Rekomendasi Dokter */}
                    <div id="doctRecommendation">
                      <label className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                      Rekomendasi Dokter <span className='text-rose-500'>*</span>
                      </label>
                      {validationErrors.doctRecommendation && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.doctRecommendation}</span>}
                      <p className='block text-sm text-slate-600 tracking-wider'>Apakah dokter pernah mendiagnosa Anda memiliki masalah atau penyakit jantung atau tekanan darah tinggi dan Anda hanya boleh melakukan aktivitas fisik sesuai anjuran dokter?</p>
                            <div className={`flex flex-col gap-2 mt-1 p-2 w-fit ${validationErrors.doctRecommendation ? ' border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}>
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="doctRecommendation"
                            value="Ya"
                            checked={formData.doctRecommendation === 'Ya'}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="accent-brand-blue"
                          />
                          Ya
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="doctRecommendation"
                            value="Tidak"
                            checked={formData.doctRecommendation === 'Tidak'}
                            onChange={handleInputChange}
                            disabled={loading}
                            className="accent-brand-blue"
                          />
                          Tidak
                        </label>
                      </div>
                    </div>

                    {/* Riwayat Penyakit */}
                    <div>
                      <label htmlFor="prevDiagnose" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Riwayat Penyakit
                      </label>
                      <p className='block text-sm text-slate-600 tracking-wider mb-1'>Apakah Anda memiliki riwayat penyakit tertentu? <b>Kosongkan jika tidak ada.</b></p>
                      <input
                        type="text"
                        id="prevDiagnose"
                        name="prevDiagnose"
                        value={formData.prevDiagnose}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`flat-input text-sm`}
                      />
                    </div>

                    {/* Riwayat Alergi */}
                    <div>
                      <label htmlFor="prevAlergy" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Riwayat Alergi
                      </label>
                      <p className='block text-sm text-slate-600 tracking-wider mb-1'>Apakah Anda memiliki alergi? <b>Kosongkan jika tidak ada.</b></p>
                      <input
                        type="text"
                        id="prevAlergy"
                        name="prevAlergy"
                        value={formData.prevAlergy}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`flat-input text-sm`}
                      />
                    </div>
                  </div>

                  {/* Bagian 4: Kontak Darurat */}
                  <div className="border-b border-brand-border pb-16 space-y-6">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      IV. KONTAK DARURAT (EMERGENCY CONTACT)
                    </h3>

                    {/* Nama Kontak Darurat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContactName" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nama Kontak Darurat <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.emergencyContactName && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.emergencyContactName}</span>}
                        <input
                          type="text"
                          id="emergencyContactName"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleInputChange}
                          placeholder="e.g. Siti Rahma"
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.emergencyContactName ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContactNumber" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Nomor Kontak Darurat <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.emergencyContactNumber && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.emergencyContactNumber}</span>}
                        <input
                          type="text"
                          id="emergencyContactNumber"
                          name="emergencyContactNumber"
                          value={formData.emergencyContactNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. 081234567890"
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.emergencyContactNumber ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Hubungan Kontak Darurat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContactRelationship" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                          Hubungan dengan Kontak <span className='text-rose-500'>*</span>
                        </label>
                        {validationErrors.emergencyContactRelationship && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.emergencyContactRelationship}</span>}
                        <select
                          id="emergencyContactRelationship"
                          name="emergencyContactRelationship"
                          value={formData.emergencyContactRelationship}
                          onChange={handleInputChange}
                          disabled={loading}
                          className={`flat-input text-sm ${validationErrors.emergencyContactRelationship ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
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
                          <label htmlFor="customRelationship" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                            Tulis Hubungan Lainnya <span className='text-rose-500'>*</span>
                          </label>
                          {validationErrors.emergencyContactRelationship && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.emergencyContactRelationship}</span>}
                          <input
                            type="text"
                            id="customRelationship"
                            name="customRelationship"
                            value={formData.customRelationship}
                            onChange={handleInputChange}
                            placeholder="e.g. Paman, Bibi, Sepupu"
                            disabled={loading}
                            className={`flat-input text-sm ${validationErrors.emergencyContactRelationship ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bagian 5: Unggah Bukti Bayar */}
                  <div className="border-b border-brand-border pb-16 space-y-6">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      V. UNGGAH BUKTI TRANSFER PEMBAYARAN
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      Silakan lakukan pembayaran sesuai informasi berikut:
                    </p>

                    <div className="bg-brand-light border border-brand-border p-4 text-sm overflow-x-auto">
                      <table className="w-full whitespace-nowrap min-w-max">
                        <tbody>
                          <tr>
                            <td className="py-2 pr-6 text-slate-500 font-medium">Bank:</td>
                            <td className="py-2 font-bold text-brand-dark">SEABANK</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-6 text-slate-500 font-medium">No. Rekening:</td>
                            <td className="py-2 font-mono font-bold text-brand-blue tracking-wide">901344586030</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-6 text-slate-500 font-medium">Penerima:</td>
                            <td className="py-2 font-bold text-brand-dark">Isadora Fanri Putri</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-6 text-slate-500 font-medium">Nominal:</td>
                            <td className="py-2 font-bold text-brand-dark">{activePrice} <span className="text-[10px] text-slate-500 font-normal">({priceType})</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div id="paymentScreenshot">
                      <label className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Bukti Transfer Pembayaran (Maksimal 2MB) <span className='text-rose-500'>*</span>
                      </label>
                      {validationErrors.paymentScreenshot && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.paymentScreenshot}</span>}
                      
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
                            className={`flex items-center justify-center border border-dashed py-6 px-4 cursor-pointer text-sm transition duration-150 w-full ${validationErrors.paymentScreenshot ? 'border-red-500 text-red-500 bg-red-50/50' : 'border-slate-300 text-slate-500 hover:text-brand-blue hover:border-brand-blue'}`}
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

                  {/* VI. Informasi lainnya */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-4">
                      V. INFORMASI LAINNYA
                    </h3>
                    <div id="infoSource">
                      <label className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
                        Sumber Informasi Event
                      </label>
                      <p className='block text-sm text-slate-600 tracking-wider mb-1'>Darimana Anda memperoleh informasi terkait event ini?</p>
                      <input
                        type="text"
                        id="infoSource"
                        name="infoSource"
                        value={formData.infoSource}
                        onChange={handleInputChange}
                        placeholder="e.g. Instagram, Teman, Website"
                        disabled={loading}
                        className={`flat-input text-sm`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-brand-border" id="terms">
                    <label htmlFor="emergencyContactRelationship" className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">
                      Pernyataan persetujuan <span className='text-rose-500'>*</span>
                    </label>
                    <p className="text-sm text-slate-600 mb-1 font-medium leading-relaxed">
                      1. Saya menyatakan bahwa data yang saya isi benar.
                    </p>
                    <p className="text-sm text-slate-600 mb-1 font-medium leading-relaxed">
                      2. Saya memahami bahwa mengikuti acara ini, baik fun run maupun fun walk memiliki risiko cedera.
                    </p>
                    <p className="text-sm text-slate-600 mb-1 font-medium leading-relaxed">
                      3. Saya menyatakan dalam kondisi sehat untuk mengikuti kegiatan.
                    </p>
                    <p className="text-sm text-slate-600 mb-1 font-medium leading-relaxed">
                      4. Saya membebaskan panitia dari tuntutan yang timbul akibat kelalaian peserta sendiri selama kegiatan berlangsung.
                    </p>
                    <p className="text-sm text-slate-600 mb-1 font-medium leading-relaxed">
                      5. Saya menyetujui dokumentasi foto/video saya digunakan untuk keperluan publikasi acara.
                    </p>
                    <label className={`flex items-start gap-3 mb-6 cursor-pointer group p-2 ${validationErrors.terms ? 'border border-red-500 bg-red-50/50' : ''}`}>
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            setIsChecked(e.target.checked);
                            if (validationErrors.terms) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.terms;
                                return newErrors;
                              });
                            }
                          }}
                          className="w-4 h-4 mt-0.5 text-brand-blue rounded border-brand-border focus:ring-brand-blue focus:ring-2 cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-500 leading-relaxed group-hover:text-brand-dark transition-colors font-medium">
                          Saya telah membaca, memahami, dan menyetujui seluruh ketentuan tersebut.
                        </span>
                        {validationErrors.terms && <span className="text-rose-500 text-xs italic block mt-1">{validationErrors.terms}</span>}
                      </div>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flat-btn-blue tracking-wider text-xs uppercase ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Mengirim Data Pendaftaran...' : 'Kirim Pendaftaran'}
                    </button>
                  </div>

                </form>
              </div>
              )
            )}

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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 max-w-sm w-full border-4 border-brand-blue shadow-[12px_12px_0px_0px_rgba(0,102,255,0.2)] relative">
            <h3 className="text-xl font-black text-brand-dark italic uppercase tracking-tight mb-3">
              Konfirmasi
            </h3>
            <p className="text-sm text-slate-600 mb-2 font-medium leading-relaxed">
              Pastikan data yang Anda masukkan sudah sesuai.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 border-2 border-brand-dark text-brand-dark font-bold uppercase tracking-wider text-xs hover:bg-slate-100 transition-colors"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={processSubmit}
                className="flex-1 py-3 px-4 bg-brand-blue border-2 border-brand-blue text-white font-bold uppercase tracking-wider text-xs hover:bg-brand-blue/90 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,102,255,0.3)] transition-all"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
