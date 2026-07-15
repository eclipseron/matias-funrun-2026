import Link from "next/link"

export const ContactInformation = () => {
  return (
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
  )
}