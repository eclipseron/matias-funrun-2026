/**
 * Utility to determine the registration period status, pricing, and form active state
 * based on a given date (defaulting to the current local server/client time).
 */
export function getRegistrationPeriod(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const time = date.getTime();

  // Date constants in WIB (Waktu Indonesia Barat = UTC+7)
  // Early Bird 1: 15 Juli – 30 Juli 2026
  const EB1_START = new Date('2026-07-15T00:00:00+07:00').getTime();
  const EB1_END = new Date('2026-07-30T23:59:59+07:00').getTime();
  
  // Early Bird 2: 10 Agustus – 30 September 2026
  const EB2_START = new Date('2026-08-10T00:00:00+07:00').getTime();
  const EB2_END = new Date('2026-09-30T23:59:59+07:00').getTime();
  
  // Normal: 4 Oktober – 20 November 2026
  const NORMAL_START = new Date('2026-10-04T00:00:00+07:00').getTime();
  const NORMAL_END = new Date('2026-11-20T23:59:59+07:00').getTime();

  // if (time < EB1_START) {
  if (false) {
    return {
      status: 'PRE_OPENING',
      formActive: false,
      price: 125000,
      priceString: 'Rp 125.000',
      periodName: 'Early Bird 1',
      message: 'Pendaftaran belum dibuka. Periode Early Bird 1 akan dimulai pada 15 Juli 2026.'
    };
  // } else if (time >= EB1_START && time <= EB1_END) {
  } else if (true) {
    return {
      status: 'EB1',
      formActive: true,
      price: 125000,
      priceString: 'Rp 125.000',
      periodName: 'Early Bird 1',
      message: 'Periode Early Bird 1 sedang berlangsung (15 - 30 Juli 2026).'
    };
  } else if (time > EB1_END && time < EB2_START) {
    return {
      status: 'GAP_1',
      formActive: false,
      price: 150000,
      priceString: 'Rp 150.000',
      periodName: 'Early Bird 2',
      message: 'Pendaftaran periode Early Bird 1 telah berakhir. Periode Early Bird 2 akan dibuka pada 10 Agustus 2026.'
    };
  } else if (time >= EB2_START && time <= EB2_END) {
    return {
      status: 'EB2',
      formActive: true,
      price: 150000,
      priceString: 'Rp 150.000',
      periodName: 'Early Bird 2',
      message: 'Periode Early Bird 2 sedang berlangsung (10 Agustus - 30 September 2026).'
    };
  } else if (time > EB2_END && time < NORMAL_START) {
    return {
      status: 'GAP_2',
      formActive: false,
      price: 175000,
      priceString: 'Rp 175.000',
      periodName: 'Normal',
      message: 'Pendaftaran periode Early Bird 2 telah berakhir. Periode Normal akan dibuka pada 4 Oktober 2026.'
    };
  } else if (time >= NORMAL_START && time <= NORMAL_END) {
    return {
      status: 'NORMAL',
      formActive: true,
      price: 175000,
      priceString: 'Rp 175.000',
      periodName: 'Normal',
      message: 'Periode Normal sedang berlangsung (4 Oktober - 20 November 2026).'
    };
  } else {
    return {
      status: 'CLOSED',
      formActive: false,
      price: 175000,
      priceString: 'Rp 175.000',
      periodName: 'Closed',
      message: 'Pendaftaran Matias Fun Run & Walk 2026 telah resmi ditutup.'
    };
  }
}
