export const FormSectionTerms = ({ validationErrors, isChecked, onInput }) => {
  return (
    <>
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
          onChange={onInput}
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
    </>
  )
}