import Image from "next/image"
import Link from "next/link"

export const Header = ({ children }) => {
  return (
    <header className="bg-brand-dark text-brand-white border-b border-brand-dark py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-matias-run.png" alt="Matias Fun Run 2026" height={1} width={200} className="h-12 w-auto object-contain" />
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <Image src="/logo-paroki.png" alt="Paroki Kosambi Baru" height={1} width={200} className="h-8 w-auto object-contain hidden sm:block" />
        </Link>
        <div>{ children }</div>
      </div>
  </header>
  )
}