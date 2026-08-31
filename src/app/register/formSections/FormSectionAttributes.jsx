import Image from "next/image"
import { FormSectionHeader } from "../FormSectionHeader"

export const FormSectionAttributes = ({ headerText, wrapperClassname, validationErrors, formData, onInput, isLoading }) => {
  return (
    <div className={wrapperClassname}>
      <FormSectionHeader>{headerText}</FormSectionHeader>
      
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
            onChange={onInput}
            placeholder="e.g. budi@gmail.com"
            disabled={isLoading}
            className={`flat-input text-sm ${validationErrors.email ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
          />
          <p className="text-xs text-slate-600 mt-1">
            Dianjurkan menggunakan <b>@gmail</b>. Email konfirmasi dikirim ke sini.
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
            onChange={onInput}
            placeholder="e.g. 081234567890"
            disabled={isLoading}
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
          onChange={onInput}
          maxLength={15}
          placeholder="e.g. BUDI (Maksimal 15 karakter)"
          disabled={isLoading}
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
            onChange={onInput}
            disabled={isLoading}
            className={`flat-input text-sm ${validationErrors.tshirtSize ? 'border-red-500 focus:ring-red-500 bg-red-50/50' : ''}`}
          >
            <option value="">-- Pilih Ukuran --</option>
            <option value="xs">XS</option>
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xl">XL</option>
            <option value="xxl">XXL</option>
            <option value="xxxl">XXXL</option>
          </select>
          <p className="text-xs text-slate-600 mt-3">
            Bila ukuran baju yang dinginkan tidak tersedia, bisa menghubungi <b>CP</b> yang terletak pada section <b>Kontak</b>.
          </p>
        </div>
      </div>
      
    </div>
  )
}