import { FormSectionHeader } from "../FormSectionHeader"

export const FormSectionGeneralInfo = ({ headerText, wrapperClassname, validationErrors, formData, onInput, isLoading }) => {
  return (
    <div className={wrapperClassname}>
      <FormSectionHeader>{headerText}</FormSectionHeader>

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
          onChange={onInput}
          placeholder="e.g. Budi Santoso"
          disabled={isLoading}
          className={`flat-input text-sm ${validationErrors.name ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
        />
      </div>

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
              onChange={onInput}
              disabled={isLoading}
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
              onChange={onInput}
              disabled={isLoading}
              className="accent-brand-blue"
            />
            Perempuan
          </label>
        </div>
      </div>

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
            onChange={onInput}
            placeholder="e.g. Jakarta"
            disabled={isLoading}
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
            onChange={onInput}
            disabled={isLoading}
            className={`flat-input text-sm ${validationErrors.birthDate ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
          />
        </div>
      </div>

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
            onChange={onInput}
            disabled={isLoading}
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
            onChange={onInput}
            placeholder="e.g. 3171****"
            disabled={isLoading}
            className={`flat-input text-sm ${validationErrors.identityNumber ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
          />
        </div>
      </div>
    </div>
  )
}