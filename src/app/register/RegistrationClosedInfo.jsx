// !periodInfo.formActive

import { AlertCircle } from "lucide-react"
import Link from "next/link"

export const RegistrationClosedInfo = ({ message }) => {
  return (
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
          {message || 'Mohon maaf, saat ini pendaftaran tidak aktif.'}
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
                <td className="py-2.5 px-6">10 Agt - 30 Sept 2026</td>
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
  )
}