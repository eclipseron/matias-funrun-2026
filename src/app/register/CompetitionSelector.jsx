export const CompetitionSelector = ({ onSelect = () => {} }) => {
  return (
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
          onClick={() => onSelect('Fun Run 4K')}
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
          onClick={() => onSelect('Fun Walk 2.5K')}
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
  )
}