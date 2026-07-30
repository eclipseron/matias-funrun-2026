import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

import { getRegistrationPeriod } from './registrationPeriods';

const logFilePath = path.join(process.cwd(), 'emails.log');

/**
 * Helper to format date like 27-06-2026 - 14:08:03
 */
function formatDateTime(date = new Date()) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  
  return `${day}-${month}-${year} - ${hours}:${minutes}:${seconds}`;
}

/**
 * Helper to determine price dynamically based on registration date
 */
function getPriceForDate(registeredAt) {
  const period = getRegistrationPeriod(registeredAt);
  return period.priceString.replace('Rp ', '');
}

/**
 * Sends an email using SMTP or logs it to file/console.
 * 
 * @param {Object} options - Email sending options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text content
 */
export async function sendEmail({ to, subject, html, text }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"Matias Fun Run" <info@matias-funrun.my.id>';

  // Fallback to console + file logging in development or if SMTP is missing
  if (!host) {
    const logEntry = `
========================================
[EMAIL SENT]
Timestamp: ${new Date().toISOString()}
To: ${to}
From: ${from} 
Subject: ${subject}
----------------------------------------
TEXT CONTENT:
${text || 'No plain text content provided'}
----------------------------------------
HTML CONTENT:
${html}
========================================
\n`;
    console.log(logEntry);
    try {
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
      console.log(`Email logged successfully to ${logFilePath}`);
    } catch (err) {
      console.error(`Failed to write email to ${logFilePath}:`, err);
    }
    return { success: true, logged: true };
  }

  // Attempt real SMTP transport if host is provided
  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port || '587', 10),
      auth: { user, pass },
      secure: port === '465',
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log('SMTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('SMTP Email sending failed. Error details:', error);
    
    // Log failure log entry
    const errorLogEntry = `
=======================================
[EMAIL SEND FAILURE]
Timestamp: ${new Date().toISOString()}
To: ${to}
Subject: ${subject}
Error: ${error.message}
=======================================
\n`;
    try {
      fs.appendFileSync(logFilePath, errorLogEntry, 'utf8');
    } catch (err) {}
    throw error;
  }
}

/**
 * Sends verification pending email to the runner immediately after registration.
 */
export async function sendVerificationPendingEmail(newRunner) {
  const subject = 'Pendaftaran Sedang Diverifikasi - Matias Fun Run & Walk 2026';
  const formattedDate = formatDateTime(newRunner.registered_at || new Date());
  
  const text = `Halo ${newRunner.name},\n\nTerima kasih telah mendaftar untuk Matias Fun Run & Walk 2026!\n\nBukti pembayaran Anda saat ini sedang dalam proses verifikasi oleh panitia (estimasi 1-3 hari kerja).\n\nRingkasan Pesanan:\n- ID Pesanan: ${newRunner.uuid}\n- Tanggal: ${formattedDate}\n- Total Pembayaran: Rp ${getPriceForDate(newRunner.registered_at)}\n- Status: Sedang dakam Verifikasi\n\nDetail Pendaftaran:\n- Kategori: ${newRunner.competition_type}\n- Nama di BIB: ${newRunner.bibName}\n- Ukuran Jersey: ${newRunner.tshirtSize}\n\nSalam hangat,\nPanitia Matias Fun Run`;

  const html = `
    <div
  style="background-color: #d1eae5; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; border-radius: 12px;">
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 25px;">
    <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">MATIAS FUN RUN 2026
    </h2>
    <p
      style="color: #475569; margin: 5px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
      Pendaftaran Event</p>
  </div>

  <!-- Card 1: Status Transaksi -->
  <div
    style="background-color: #111827; border-radius: 16px; padding: 25px; color: #ffffff; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; font-size: 13px; color: #9ca3af; margin-bottom: 5px;">
      Tanggal: ${formattedDate}
    </div>
    <div
      style="text-align: center; font-size: 13px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">
      Total Pembayaran
    </div>
    <div style="text-align: center; font-size: 32px; font-weight: 800; color: #ffffff; margin: 5px 0 15px 0;">
      IDR ${getPriceForDate(newRunner.registered_at)}
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
      <span
        style="background-color: #0ea5e9; color: #ffffff; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
        Sedang dalam verifikasi
      </span>
    </div>

    <div style="border-top: 1px solid #374151; padding-top: 15px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="font-size: 13px; color: #9ca3af; padding-bottom: 8px;">ID Pesanan:</td>
          <td align="right"
            style="font-size: 13px; color: #ffffff; font-family: monospace; font-weight: bold; padding-bottom: 8px;">
            ${newRunner.uuid.substring(0, 18)}...</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #9ca3af; padding-bottom: 8px;">Kategori:</td>
          <td align="right" style="padding-bottom: 8px; font-weight: bold; color: #ffffff;">${newRunner.competition_type}</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Card 2: Detail Informasi -->
  <div
    style="background-color: #1f2937; border-radius: 16px; padding: 25px; color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <h3
      style="margin-top: 0; color: #ffffff; font-size: 18px; font-weight: 700; border-bottom: 1px solid #374151; padding-bottom: 10px;">
      Dear ${newRunner.name},</h3>

    <p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin-bottom: 20px;">
      Proses verifikasi oleh penyelenggara biasanya membutuhkan waktu 1-3 hari kerja. Harap menunggu email informasi berikutnya.
    </p>

    <h4
      style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; border-bottom: 1px solid #374151; padding-bottom: 5px;">
      Detail Pendaftaran</h4>
    <h5
      style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      I. Data Diri Peserta</h5>
    <table cellpadding="0" cellspacing="0" border="0" width="100%"
      style="border-collapse: collapse; font-size: 14px; color: #d1d5db; margin-bottom: 10px;">
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Nama Lengkap (Sesuai Kartu Identitas) </td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Jenis Kelamin</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.sex}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Tempat Lahir</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.birthLoc}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af;">Tanggal Lahir</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.birthDate}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af;">Jenis Identitas</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.identity}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af;">No. Identitas</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.identityNumber}</td>
      </tr>
    </table>

    <h5 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      II. Kontak & Atribut Peserta</h5>
    <table cellpadding="0" cellspacing="0" border="0" width="100%"
      style="border-collapse: collapse; font-size: 14px; color: #d1d5db; margin-bottom: 10px;">
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Alamat email</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.email}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">No. WhatsApp</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.whatsapp}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Nama BIB</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.bibName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Ukuran kaos (Jersey)</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.tshirtSize}</td>
      </tr>
    </table>

    <h5 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      III. Informasi Kesehatan Peserta</h5>
    <table cellpadding="0" cellspacing="0" border="0" width="100%"
      style="border-collapse: collapse; font-size: 14px; color: #d1d5db; margin-bottom: 10px;">
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Golongan darah</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.bloodType}</td>
      </tr>
    </table>
    <p style="color: #9ca3af; font-size: 14px;">Apakah dokter pernah mendiagnosa Anda memiliki masalah atau penyakit jantung atau tekanan darah tinggi dan Anda hanya
    boleh melakukan aktivitas fisik sesuai anjuran dokter?</p>
    <p style="font-weight: bold; color: #ffffff; font-size: 14px;">${newRunner.doctRecommendation}</p>
    <p style="color: #9ca3af; font-size: 14px;">Apakah Anda memiliki riwayat penyakit tertentu?</p>
    <p style="font-weight: bold; color: #ffffff; font-size: 14px;">${newRunner.prevDiagnose}</p>
    <p style="color: #9ca3af; font-size: 14px;">Apakah Anda memiliki alergi?</p>
    <p style="font-weight: bold; color: #ffffff; font-size: 14px;">${newRunner.prevAlergy}</p>
    
    <h5 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      IV. Kontak Darurat (Emergency Contact)</h5>
    <table cellpadding="0" cellspacing="0" border="0" width="100%"
      style="border-collapse: collapse; font-size: 14px; color: #d1d5db; margin-bottom: 10px;">
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Nama kontak darurat</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.emergencyContact}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Hubungan kontak darurat</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.emergencyContactRelationship}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Nomor kontak darurat</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.emergencyContactNumber}</td>
      </tr>
    </table>

    <h5 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      V. Unggah Bukti Transfer Pembayaran</h5>
    <p style="color: #9ca3af; font-size: 14px;"><i>Bukti transfer terkirim.</i></p>
    
    <h5 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      VI. Informasi Lainnya</h5>
      <table cellpadding="0" cellspacing="0" border="0" width="100%"
      style="border-collapse: collapse; font-size: 14px; color: #d1d5db; margin-bottom: 10px;">
      <tr>
        <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Sumber Informasi Event</td>
        <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${newRunner.eventSource}</td>
      </tr>
    </table>
    <h5 style="margin: 0 0 10px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9;">
      Pernyataan Persetujuan</h5>
    <p style="color: #9ca3af; font-size: 14px;">1. Saya menyatakan bahwa data yang saya isi benar.</p>
    <p style="color: #9ca3af; font-size: 14px;">2. Saya memahami bahwa mengikuti acara ini, baik fun run maupun fun walk memiliki risiko cedera.</p>
    <p style="color: #9ca3af; font-size: 14px;">3. Saya menyatakan dalam kondisi sehat untuk mengikuti kegiatan.</p>
    <p style="color: #9ca3af; font-size: 14px;">4. Saya membebaskan panitia dari tuntutan yang timbul akibat kelalaian peserta sendiri selama kegiatan berlangsung.</p>
    <p style="color: #9ca3af; font-size: 14px;">5. Saya menyetujui dokumentasi foto/video saya digunakan untuk keperluan publikasi acara.</p>
    <p style="font-weight: bold; color: #ffffff;">Saya telah membaca, memahami, dan menyetujui seluruh ketentuan tersebut.</p>
    <!-- Footer of Card -->
    <div
      style="border-top: 1px solid #374151; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
      Jika Anda memiliki pertanyaan, silakan hubungi Layanan Informasi kami di <a href="mailto:info@matias-funrun.my.id"
        style="color: #10b981; text-decoration: none; font-weight: bold;">info@matias-funrun.my.id</a>.
    </div>
  </div>
</div>
  `;

  return sendEmail({ to: newRunner.email, subject, text, html });
}

/**
 * Sends verification confirmation email containing registration code and QR code.
 */
export async function sendConfirmationEmail({
  email,
  name,
  uuid,
  whatsapp,
  gender,
  identity_number,
  competition_type,
  tshirt_size,
  registration_code,
  registered_at,
  bib_name
}) {
  const subject = 'Pendaftaran Terverifikasi! Kode Registrasi Anda - Matias Fun Run & Walk 2026';
  const formattedDate = formatDateTime(registered_at || new Date());

  const text = `Halo ${name},\n\nTerima kasih! Pembayaran Anda sudah diterima dan diverifikasi oleh panitia.\n\nDetail Transaksi:\n- ID Pesanan: ${uuid}\n- Status: SETTLEMENT (Berhasil)\n- Kode Registrasi: ${registration_code}\n\nDetail Pendaftaran:\n- Kategori: ${competition_type}\n- Nama di BIB: ${bib_name}\n- Ukuran Jersey: ${tshirt_size}\n\nHarap simpan email ini dan tunjukkan Kode Registrasi saat hari pengambilan running bag.\n\nSalam hangat,\nPanitia Matias Fun Run`;

  const html = `
    <div style="background-color: #d1eae5; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; max-width: 600px; margin: 0 auto; border-radius: 12px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">MATIAS FUN RUN 2026</h2>
        <p style="color: #475569; margin: 5px 0 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Pendaftaran Event</p>
      </div>

      <!-- Card 1: Status Transaksi -->
      <div style="background-color: #111827; border-radius: 16px; padding: 25px; color: #ffffff; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; font-size: 13px; color: #9ca3af; margin-bottom: 5px;">
          Tanggal: ${formattedDate}
        </div>
        <div style="text-align: center; font-size: 13px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">
          Total Pembayaran
        </div>
        <div style="text-align: center; font-size: 32px; font-weight: 800; color: #ffffff; margin: 5px 0 15px 0;">
          IDR ${getPriceForDate(registered_at)}
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="background-color: #22c55e; color: #ffffff; padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            settlement
          </span>
        </div>

        <div style="border-top: 1px solid #374151; padding-top: 15px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="font-size: 13px; color: #9ca3af; padding-bottom: 8px;">ID Pesanan:</td>
              <td align="right" style="font-size: 13px; color: #ffffff; font-family: monospace; font-weight: bold; padding-bottom: 8px;">${uuid.substring(0, 18)}...</td>
            </tr>
            <tr>
              <td style="font-size: 13px; color: #9ca3af;">Metode Pembayaran:</td>
              <td align="right" style="font-size: 13px; color: #ffffff; font-weight: bold;">Bank Transfer</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Card 2: Detail Informasi -->
      <div style="background-color: #1f2937; border-radius: 16px; padding: 25px; color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h3 style="margin-top: 0; color: #ffffff; font-size: 18px; font-weight: 700; border-bottom: 1px solid #374151; padding-bottom: 10px;">Dear ${name},</h3>
        
        <p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin-bottom: 20px;">
          Terima kasih! Pembayaran Anda sudah diterima. Silahkan lihat detail data Anda di bawah ini:
        </p>

        <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; border-bottom: 1px solid #374151; padding-bottom: 5px;">Detail Data</h4>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; font-size: 14px; color: #d1d5db; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #9ca3af; width: 40%;">Name</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Name On BIB</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${bib_name || ''}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">ID No</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${identity_number}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Gender</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${gender}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Tel No</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${whatsapp}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Kategori</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${competition_type}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Jersey</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${tshirt_size}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Status Pendaftaran</td>
            <td style="padding: 6px 0; font-weight: bold; color: #22c55e;">VERIFIED / SETTLEMENT</td>
          </tr>
        </table>

        <!-- Running Bag Collection Box --!>
        <div style="background-color: #111827; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0 0 0; border-radius: 4px;">
          <h4 style="margin: 0 0 5px 0; color: #ffffff; font-size: 13px; font-weight: bold;">Untuk Informasi pengambilan running bag akan diumumkan di Instagram Kami <a href="https://www.instagram.com/matiasfunrun/" style="color: #10b981; text-decoration: none; font-weight: bold;">@matiasfunrun</a>.</h4>
          
        </div>
        
        <!-- Registration Code Section -->
        <div style="text-align: center; background-color: #111827; border: 1px dashed #4b5563; padding: 25px; border-radius: 12px; margin-top: 25px;">
          <p style="margin: 0; font-size: 13px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Kode Registrasi Anda</p>
          <h1 style="margin: 10px 0 0 0; font-size: 36px; font-weight: 800; color: #10b981; letter-spacing: 4px; font-family: monospace;">${registration_code}</h1>
        </div>

        

        <!-- Footer of Card -->
        <div style="border-top: 1px solid #374151; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
          Jika Anda memiliki pertanyaan, silakan hubungi via DM Instagram kami di <a href="https://www.instagram.com/matiasfunrun/" style="color: #10b981; text-decoration: none; font-weight: bold;">@matiasfunrun</a>, atau ke email kami <a href="mailto:info@matias-funrun.my.id" style="color: #10b981; text-decoration: none; font-weight: bold;">info@matias-funrun.my.id</a>.
        </div>
      </div>
    </div>
  `;


  return sendEmail({ to: email, subject, text, html });
}
