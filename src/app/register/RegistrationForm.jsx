'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompetitionSelector } from './CompetitionSelector';
import { FormSectionGeneralInfo } from './formSections/FormSectionGeneralInfo';
import { FormSectionAttributes } from './formSections/FormSectionAttributes';
import { FormSectionHealthInfo } from './formSections/FormSectionHealthInfo';
import { FormSectionEmergencyContact } from './formSections/FormSectionEmergencyContact';
import { FormSectionPayment } from './formSections/FormSectionPayment';
import { FormSectionOtherInfo } from './formSections/FormSectionOtherInfo';
import { FormSectionTerms } from './formSections/FormSectionTerms';

export const RegistrationForm = ({ currPrice, currType }) => {
  const router = useRouter();
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
    if (validationErrors.fileSize) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.fileSize;
        return newErrors;
      });
    }

    if (!file) return;

    // Validate size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran file bukti transfer maksimal melebihi 2MB.');
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        newErrors["fileSize"] = "Ukuran file bukti transfer melebihi 2MB"
        return newErrors
      })
      alert("Ukuran file bukti transfer maksimal adalah 2MB.")
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
    <>
      <div className="lg:col-span-8">
        {(!competitionType ? <CompetitionSelector onSelect={setCompetitionType} />: (
          
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
              <FormSectionGeneralInfo
                wrapperClassname="border-b border-brand-border pb-16 space-y-8"
                validationErrors={validationErrors}
                formData={formData}
                onInput={handleInputChange}
                isLoading={loading}
                headerText="I. DATA DIRI PESERTA"
                />
              <FormSectionAttributes
                wrapperClassname="border-b border-brand-border pb-16 space-y-8"
                validationErrors={validationErrors}
                formData={formData}
                onInput={handleInputChange}
                isLoading={loading}
                headerText="II. KONTAK & ATRIBUT PESERTA"
                />
              <FormSectionHealthInfo
                wrapperClassname="border-b border-brand-border pb-16 space-y-8"
                validationErrors={validationErrors}
                formData={formData}
                onInput={handleInputChange}
                isLoading={loading}
                headerText="III. INFORMASI KESEHATAN PESERTA"
              />
              <FormSectionEmergencyContact
                wrapperClassname="border-b border-brand-border pb-16 space-y-8"
                validationErrors={validationErrors}
                formData={formData}
                onInput={handleInputChange}
                isLoading={loading}
                headerText="IV. KONTAK DARURAT (EMERGENCY CONTACT)"
              />
              <FormSectionPayment
                wrapperClassname="border-b border-brand-border pb-16 space-y-8"
                validationErrors={validationErrors}
                imgInfo={{fileName, screenshotBase64}}
                pricingInfo={{currPrice, currType}}
                onInput={handleFileChange}
                isLoading={loading}
                headerText="V. UNGGAH BUKTI TRANSFER PEMBAYARAN"
              />
              <FormSectionOtherInfo
                wrapperClassname="pb-16 space-y-8"
                validationErrors={validationErrors}
                formData={formData}
                onInput={handleInputChange}
                isLoading={loading}
                headerText="VI. INFORMASI LAINNYA"
              />
              <div className="pt-6 border-t border-brand-border" id="terms">
                <FormSectionTerms
                  onInput={(e) => {
                    setIsChecked(e.target.checked);
                    if (validationErrors.terms) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.terms;
                        return newErrors;
                      });
                    }
                  }}
                  validationErrors={validationErrors}
                  isChecked={isChecked}
                />

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
    </>
  )
}
