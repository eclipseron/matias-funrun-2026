import { FormSectionHeader } from "../FormSectionHeader"

export const FormSectionEmergencyContact = ({ headerText, wrapperClassname, validationErrors, formData, onInput, isLoading }) => {
  return (
    <div className={wrapperClassname}>
      <FormSectionHeader>{headerText}</FormSectionHeader>

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
            onChange={onInput}
            placeholder="e.g. Siti Rahma"
            disabled={isLoading}
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
            onChange={onInput}
            placeholder="e.g. 081234567890"
            disabled={isLoading}
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
            onChange={onInput}
            disabled={isLoading}
            className={`flat-input text-sm ${validationErrors.emergencyContactRelationship ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
          >
            <option value="">-- Pilih Hubungan --</option>
            <option value="ayah">Ayah</option>
            <option value="ibu">Ibu</option>
            <option value="kakak">Kakak</option>
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
              onChange={onInput}
              placeholder="e.g. Paman, Bibi, Sepupu"
              disabled={isLoading}
              className={`flat-input text-sm ${validationErrors.emergencyContactRelationship ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}