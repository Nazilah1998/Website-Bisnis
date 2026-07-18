import { Resend } from 'resend';

// Use a fallback key for development if env is not set, or throw error
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function sendLeadNotification(leadData: { name: string; email: string; phone: string; service: string; message: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Skipping email notification because RESEND_API_KEY is not set.', leadData);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ZilyaDigital <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'admin@ZilyaDigital.com',
      subject: `Prospek Baru: ${leadData.name} - ${leadData.service}`,
      html: `
        <h2>Anda mendapatkan prospek baru dari ZilyaDigital!</h2>
        <p><strong>Nama:</strong> ${leadData.name}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>WhatsApp:</strong> ${leadData.phone}</p>
        <p><strong>Layanan:</strong> ${leadData.service}</p>
        <p><strong>Pesan:</strong> ${leadData.message}</p>
        <br/>
        <p>Segera hubungi klien melalui WhatsApp untuk menindaklanjuti.</p>
      `
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
