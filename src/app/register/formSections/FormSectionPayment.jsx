import { FormSectionHeader } from "../FormSectionHeader"

export const FormSectionPayment = ({ headerText, wrapperClassname, imgInfo, validationErrors, pricingInfo, onInput, isLoading }) => {
  return (
    <div className={wrapperClassname}>
      <FormSectionHeader>{headerText}</FormSectionHeader>

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
              <td className="py-2 font-bold text-brand-dark">{pricingInfo.currPrice} <span className="text-[10px] text-slate-500 font-normal">({pricingInfo.currType})</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="paymentScreenshot">
        <label className="block text-sm font-bold text-brand-dark mb-1 uppercase tracking-wider">
          Bukti Transfer Pembayaran (Maksimal 2MB) <span className='text-rose-500'>*</span>
        </label>
        {validationErrors.paymentScreenshot && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.paymentScreenshot}</span>}
        {validationErrors.fileSize && <span className="text-rose-500 text-xs italic block mb-1">{validationErrors.fileSize}</span>}
        
        <div className="flex flex-col items-start gap-4">
          <div className="relative w-full">
            <input
              type="file"
              id="screenshot-upload"
              accept="image/*"
              onChange={onInput}
              disabled={isLoading}
              className="hidden"
            />
            <label
              htmlFor="screenshot-upload"
              className={`flex items-center justify-center border border-dashed py-6 px-4 cursor-pointer text-sm transition duration-150 w-full ${validationErrors.paymentScreenshot ? 'border-red-500 text-red-500 bg-red-50/50' : 'border-slate-300 text-slate-500 hover:text-brand-blue hover:border-brand-blue'}`}
            >
              {imgInfo.fileName ? (
                <span className="font-semibold text-brand-dark truncate">{imgInfo.fileName} (Ubah File)</span>
              ) : (
                <span>Klik untuk mengunggah screenshot bukti transfer (PNG, JPG)</span>
              )}
            </label>
          </div>

          {imgInfo.screenshotBase64 && (
            <div className="w-full max-w-50 border border-brand-border p-1 bg-brand-light">
              <p className="text-[10px] text-slate-500 font-bold mb-1 font-mono uppercase">Preview Gambar</p>
              <img
                src={imgInfo.screenshotBase64}
                alt="Bukti bayar pratinjau"
                className="w-full h-auto object-contain max-h-62.5"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}