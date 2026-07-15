import { FormSectionHeader } from "../FormSectionHeader"

export const FormSectionHealthInfo = ({ headerText, wrapperClassname, validationErrors, formData, onInput, isLoading }) => {
  return (
    <div className={wrapperClassname}>
      <FormSectionHeader>{headerText}</FormSectionHeader>

      <div>
        <label htmlFor="bloodType" className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider ">
          Golongan Darah <span className='text-rose-500'>*</span>
        </label>
          {validationErrors.bloodType && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.bloodType}</span>}
        <select
          id="bloodType"
          name="bloodType"
          value={formData.bloodType}
          onChange={onInput}
          disabled={isLoading}
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
              onChange={onInput}
              disabled={isLoading}
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
              onChange={onInput}
              disabled={isLoading}
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
          onChange={onInput}
          disabled={isLoading}
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
          onChange={onInput}
          disabled={isLoading}
          className={`flat-input text-sm`}
        />
      </div>
    </div>
  )
}