export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ContactInformation } from '../ContactInformation';
import { RegistrationForm } from './RegistrationForm';
import { getRegistrationPeriodWithCurrCount } from '@/lib/registrationPeriods';
import { RegistrationClosedInfo } from './RegistrationClosedInfo';
import { query } from '@/lib/db';

export default async function Register() {
  let currRegisteredCount = 0;
  try {
      const res = await query(`SELECT COUNT(is_active) AS registered FROM runners WHERE is_active = 1`);
      currRegisteredCount = res.rows[0]
    } catch (error) {
      console.error('Failed to fetch runners for admin dashboard:', error);
    }

  const registrationPeriod = getRegistrationPeriodWithCurrCount(currRegisteredCount.registered)
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent z-0 text-brand-dark">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -z-10 size-200 bg-brand-blue/10 rounded-full blur-3xl opacity-50 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 size-150 bg-sky-300/10 rounded-full blur-3xl opacity-60 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-[10%] left-0 -z-10 w-full h-200 bg-linear-to-br from-brand-blue/2 to-sky-200/5 -skew-y-6 origin-top-left pointer-events-none"></div>

      <Header>
        <Link href="/" className="text-sm font-semibold hover:text-slate-300 text-brand-white border border-slate-700 px-4 py-2 hover:bg-brand-dark-light transition">
          &larr; Kembali ke Beranda
        </Link>
      </Header>

      {/* Main Container */}
      <main className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8">
            <ContactInformation />
          </div>
          <div className="lg:col-span-8">
            {
              registrationPeriod.formActive 
              ? <RegistrationForm currPrice={registrationPeriod.priceString} currType={registrationPeriod.periodName} /> 
              : <RegistrationClosedInfo message={registrationPeriod.message} />
            }
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
