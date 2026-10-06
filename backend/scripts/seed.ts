// Seed data untuk PocketBase (pengganti src/db/seed.ts + scripts/seedAll.ts lama).
// Jalankan: node scripts/seed.ts   (atau: npx tsx scripts/seed.ts)
//
// Wajib env:
//   PB_URL, PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASSWORD
// Opsional:
//   ADMIN_USERNAME (default: admin), ADMIN_PASSWORD (default: admin123456),
//   ADMIN_EMAIL (default: admin@zilya.id)

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Muat .env manual agar script ini tanpa dependensi (bisa jalan tanpa npm install).
function loadDotenv(): void {
  for (const f of ['.env', '.env.local']) {
    try {
      const text = readFileSync(resolve(process.cwd(), f), 'utf8');
      for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m || line.trim().startsWith('#')) continue;
        const value = m[2].replace(/^["']|["']$/g, '');
        if (!(m[1] in process.env)) process.env[m[1]] = value;
      }
    } catch {
      // file tidak ada, abaikan
    }
  }
}
loadDotenv();

const PB_URL = (process.env.PB_URL || 'http://127.0.0.1:8090').replace(/\/$/, '');
const SUPER_IDENTITY = process.env.PB_SUPERUSER_EMAIL || process.env.PB_EMAIL || '';
const SUPER_PASSWORD = process.env.PB_SUPERUSER_PASSWORD || process.env.PB_PASSWORD || '';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zilya.id';

// Id lama yang mengandung "-" tidak valid di PocketBase (pattern [a-z0-9]+),
// jadi pakai varian alnum — tidak direferensikan di luar seed.

async function api(path: string, init: RequestInit = {}, token = ''): Promise<any> {
  const res = await fetch(PB_URL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${init.method || 'GET'} ${path} -> ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

async function superuserToken(): Promise<string> {
  const res = await api('/api/collections/_superusers/auth-with-password', {
    method: 'POST',
    body: JSON.stringify({ identity: SUPER_IDENTITY, password: SUPER_PASSWORD }),
  });
  return res.token;
}

async function existingIds(token: string, collection: string): Promise<Set<string>> {
  const res = await api(`/api/collections/${collection}/records?perPage=500`, {}, token);
  return new Set((res.items || []).map((r: any) => r.id));
}

function normalizeId(id?: string): string | undefined {
  if (!id) return undefined;
  if (id.length < 15) {
    return id.toLowerCase().replace(/[^a-z0-9]/g, '').padEnd(15, '0');
  }
  return id;
}

async function createIfMissing(
  token: string,
  collection: string,
  record: Record<string, any>,
  present: Set<string>,
): Promise<void> {
  const normId = normalizeId(record.id);
  const toSend = normId ? { ...record, id: normId } : { ...record };
  if (normId && present.has(normId)) {
    console.log(`  = ${collection}/${normId} sudah ada, lewati`);
    return;
  }
  await api(`/api/collections/${collection}/records`, { method: 'POST', body: JSON.stringify(toSend) }, token);
  console.log(`  + ${collection}/${normId || '(auto)'}`);
}

async function main() {
  if (!SUPER_IDENTITY || !SUPER_PASSWORD) {
    throw new Error('PB_SUPERUSER_EMAIL / PB_SUPERUSER_PASSWORD belum di-set');
  }

  console.log(`Seeding ${PB_URL} ...`);
  const token = await superuserToken();

  // === Admin user (koleksi users) ===
  console.log('👤 Admin user...');
  const users = await existingIds(token, 'users');
  const usernameTaken = await api(
    `/api/collections/users/records?filter=${encodeURIComponent(`username = "${ADMIN_USERNAME}"`)}`,
    {},
    token,
  ).catch(() => ({ items: [] }));
  if ((usernameTaken.items || []).length === 0) {
    await api(
      '/api/collections/users/records',
      {
        method: 'POST',
        body: JSON.stringify({
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          emailVisibility: true,
          password: ADMIN_PASSWORD,
          passwordConfirm: ADMIN_PASSWORD,
          role: 'admin',
        }),
      },
      token,
    );
    console.log(`  + admin "${ADMIN_USERNAME}" dibuat`);
  } else {
    console.log(`  = admin "${ADMIN_USERNAME}" sudah ada, lewati`);
  }
  void users;

  // === Konten publik (port dari src/db/seed.ts) ===
  console.log('📦 Services...');
  const services = await existingIds(token, 'services');
  for (const r of [
    { id: 'profile', titleId: 'Profil Perusahaan', titleEn: 'Company Profile', descId: 'Website profesional untuk merepresentasikan bisnis Anda.', descEn: 'Professional website to represent your business.', iconName: 'Monitor', isActive: true, orderIdx: 1 },
    { id: 'ecommerce', titleId: 'Toko Online', titleEn: 'E-Commerce', descId: 'Platform jualan online dengan fitur lengkap.', descEn: 'Full-featured online selling platform.', iconName: 'ShoppingCart', isActive: true, orderIdx: 2 },
    { id: 'landing', titleId: 'Landing Page', titleEn: 'Landing Page', descId: 'Halaman konversi tinggi untuk produk atau kampanye.', descEn: 'High-conversion page for products or campaigns.', iconName: 'LayoutTemplate', isActive: true, orderIdx: 3 },
  ]) await createIfMissing(token, 'services', r, services);

  console.log('🖼️  Portfolios...');
  const portfolios = await existingIds(token, 'portfolios');
  for (const r of [
    { id: '1', titleId: 'Dashboard Analytics', titleEn: 'Dashboard Analytics', descId: 'Sistem manajemen data.', descEn: 'Data management system.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80', category: 'Web App', clientName: 'PT Maju Bersama', techStack: 'React, Node.js', orderIdx: 1 },
    { id: '2', titleId: 'Toko Elektronik Online', titleEn: 'Online Electronics Store', descId: 'E-commerce modern.', descEn: 'Modern e-commerce.', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80', category: 'E-Commerce', clientName: 'ElectroShop', techStack: 'Next.js, Tailwind', orderIdx: 2 },
    { id: '3', titleId: 'Aplikasi Fintech', titleEn: 'Fintech App', descId: 'Aplikasi keuangan.', descEn: 'Financial application.', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', category: 'Mobile App', clientName: 'Finaku', techStack: 'React Native', orderIdx: 3 },
  ]) await createIfMissing(token, 'portfolios', r, portfolios);

  console.log('💰 Pricing...');
  const pricing = await existingIds(token, 'pricingPlans');
  for (const r of [
    { id: 'basic', name: 'Basic', price: 'Rp 1.5M', featuresJson: JSON.stringify(['1 Landing Page', 'Mobile Responsive', 'SEO Basic', 'Revisi 1x']), isPopular: false, type: 'template', orderIdx: 1 },
    { id: 'pro', name: 'Pro', price: 'Rp 4.5M', featuresJson: JSON.stringify(['5 Halaman Web', 'Mobile Responsive', 'SEO Optimized', 'CMS Admin Panel', 'Revisi 3x']), isPopular: true, type: 'custom', orderIdx: 2 },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', featuresJson: JSON.stringify(['Custom Web App', 'E-Commerce / Dashboard', 'Advanced SEO & Analytics', 'Maintenance 1 Tahun']), isPopular: false, type: 'custom', orderIdx: 3 },
  ]) await createIfMissing(token, 'pricingPlans', r, pricing);

  console.log('💬 Testimonials...');
  const testimonials = await existingIds(token, 'testimonials');
  for (const r of [
    { id: 't1', clientName: 'Budi Santoso', role: 'CEO Maju Bersama', contentId: 'Pelayanan luar biasa! Website selesai tepat waktu dan hasilnya sangat profesional.', contentEn: 'Outstanding service! Website completed on time and highly professional result.', avatarUrl: 'https://i.pravatar.cc/150?img=11', orderIdx: 1 },
    { id: 't2', clientName: 'Siti Aminah', role: 'Founder Butikku', contentId: 'Sejak menggunakan jasa mereka, penjualan online kami meningkat pesat berkat UI yang sangat mudah digunakan.', contentEn: 'Since using their service, our online sales skyrocketed thanks to the easy UI.', avatarUrl: 'https://i.pravatar.cc/150?img=5', orderIdx: 2 },
    { id: 't3', clientName: 'Ahmad Faisal', role: 'CTO TechInnovate', contentId: 'Sangat responsif dan solutif. Mereka benar-benar mengerti apa yang bisnis kami butuhkan di era digital.', contentEn: 'Very responsive and solution-oriented. They truly understand our digital business needs.', avatarUrl: 'https://i.pravatar.cc/150?img=8', orderIdx: 3 },
  ]) await createIfMissing(token, 'testimonials', r, testimonials);

  console.log('❓ FAQs...');
  const faqs = await existingIds(token, 'faqs');
  for (const r of [
    { id: 'f1', questionId: 'Berapa lama proses pembuatan website?', questionEn: 'How long does the website development take?', answerId: 'Tergantung pada tingkat kerumitan fitur. Untuk paket Basic biasanya memakan waktu 3-5 hari kerja. Sedangkan paket Pro sekitar 2-3 minggu.', answerEn: 'Depends on the feature complexity. Basic packages take 3-5 working days. Pro packages take 2-3 weeks.', orderIdx: 1 },
    { id: 'f2', questionId: 'Apakah saya perlu menyiapkan domain & hosting?', questionEn: 'Do I need to prepare domain & hosting?', answerId: 'Tidak perlu. Semua paket kami sudah termasuk domain (.com / .id) dan hosting gratis untuk 1 tahun pertama.', answerEn: 'No need. All packages include a domain (.com/.id) and free hosting for the first year.', orderIdx: 2 },
    { id: 'f3', questionId: 'Apakah desainnya bisa disesuaikan (custom)?', questionEn: 'Can the design be customized?', answerId: 'Tentu. Paket Pro dan Enterprise menawarkan kustomisasi desain UI/UX sesuai dengan brand identity Anda secara eksklusif.', answerEn: 'Absolutely. Pro and Enterprise packages offer UI/UX customization tailored to your brand identity.', orderIdx: 3 },
  ]) await createIfMissing(token, 'faqs', r, faqs);

  console.log('📊 Stats...');
  const stats = await existingIds(token, 'stats');
  for (const r of [
    { id: 's1', labelId: 'Proyek Selesai', labelEn: 'Completed Projects', value: '150+', orderIdx: 1 },
    { id: 's2', labelId: 'Klien Puas', labelEn: 'Happy Clients', value: '99%', orderIdx: 2 },
    { id: 's3', labelId: 'Ahli IT', labelEn: 'IT Experts', value: '20+', orderIdx: 3 },
    { id: 's4', labelId: 'Tahun Pengalaman', labelEn: 'Years Experience', value: '5+', orderIdx: 4 },
  ]) await createIfMissing(token, 'stats', r, stats);

  console.log('🏷️  Client logos...');
  const logos = await existingIds(token, 'clientLogos');
  for (const r of [
    { id: 'l1', name: 'Next.js', logoUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png', isActive: true, orderIdx: 1 },
    { id: 'l2', name: 'React', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', isActive: true, orderIdx: 2 },
    { id: 'l3', name: 'Node.js', logoUrl: 'https://nodejs.org/static/images/logo.svg', isActive: true, orderIdx: 3 },
    { id: 'l4', name: 'Tailwind CSS', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', isActive: true, orderIdx: 4 },
  ]) await createIfMissing(token, 'clientLogos', r, logos);

  // === Data demo (port dari scripts/seedAll.ts) ===
  console.log('📝 Blog posts...');
  const posts = await existingIds(token, 'posts');
  const postSeeds = [
    {
      id: 'post001',
      slug: '5-alasan-bisnis-umkm-butuh-website-profesional',
      titleId: '5 Alasan Mengapa Bisnis UMKM Butuh Website Profesional',
      titleEn: '5 Reasons Why SMEs Need a Professional Website',
      excerptId: 'Di era digital ini, website bukan lagi kemewahan—melainkan kebutuhan. Temukan mengapa bisnis UMKM yang punya website tumbuh 2x lebih cepat.',
      excerptEn: "In the digital age, a website is no longer a luxury—it's a necessity. Discover why SMEs with websites grow 2x faster.",
      contentId: `## Mengapa Website Sangat Penting untuk UMKM?

Di era digital yang terus berkembang, kehadiran online bukan lagi pilihan—melainkan keharusan bagi setiap bisnis, termasuk UMKM.

## 1. Meningkatkan Kredibilitas Bisnis

Website profesional memberikan kesan pertama yang kuat. Calon pelanggan akan lebih percaya pada bisnis yang memiliki website dibandingkan yang hanya mengandalkan media sosial.

## 2. Tersedia 24/7 untuk Pelanggan

Berbeda dengan toko fisik yang punya jam buka-tutup, website Anda bekerja sepanjang waktu—memungkinkan pelanggan mengakses informasi kapan saja.

## 3. Memperluas Jangkauan Pasar

Dengan website yang dioptimasi SEO, bisnis Anda bisa ditemukan oleh calon pelanggan dari seluruh Indonesia, bahkan mancanegara.

## 4. Membangun Brand yang Kuat

Website adalah ruang digital milik Anda sendiri. Tidak seperti media sosial yang bisa mengubah algoritma kapan saja, website memberikan kontrol penuh atas branding Anda.

## 5. Meningkatkan Kepercayaan & Konversi

Studi menunjukkan bahwa 75% konsumen menilai kredibilitas bisnis dari desain websitenya. Website yang profesional secara langsung meningkatkan tingkat konversi.

## Kesimpulan

Investasi pada website profesional adalah salah satu keputusan terbaik yang bisa dilakukan UMKM. Jangan tunda lagi—mulai bangun kehadiran digital Anda sekarang!`,
      contentEn: `## Why is a Website So Important for SMEs?

In today's ever-evolving digital era, online presence is no longer optional—it's a must for every business.

## 1. Increases Business Credibility

A professional website creates a strong first impression. Potential customers trust businesses with websites more than those relying solely on social media.

## 2. Available 24/7 for Customers

Unlike physical stores with opening hours, your website works around the clock.

## 3. Expands Market Reach

With an SEO-optimized website, your business can be found by potential customers from across Indonesia and beyond.

## 4. Builds a Strong Brand

Your website is your own digital space, giving you full control over branding.

## 5. Increases Trust & Conversion

Studies show 75% of consumers judge business credibility by website design.

## Conclusion

Investing in a professional website is one of the best decisions an SME can make!`,
      coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      category: 'bisnis',
      tags: '["UMKM", "Website", "Digital Marketing", "Bisnis Online"]',
      isPublished: true,
      publishedAt: '2026-07-01T00:00:00.000Z',
      orderIdx: 0,
    },
    {
      id: 'post002',
      slug: 'tren-desain-website-2026',
      titleId: 'Tren Desain Website 2026 yang Wajib Anda Ketahui',
      titleEn: 'Web Design Trends 2026 You Must Know',
      excerptId: 'Dari Glassmorphism hingga AI-generated design—inilah tren desain website terpanas di 2026 yang akan membuat bisnis Anda tampil lebih modern.',
      excerptEn: 'From Glassmorphism to AI-generated design—these are the hottest web design trends in 2026.',
      contentId: `## Tren Desain Website yang Mendominasi 2026

Dunia desain web terus berevolusi. Berikut adalah tren yang paling dominan di tahun 2026.

## 1. Dark Mode sebagai Default

Semakin banyak website mengadopsi dark mode sebagai tampilan utama. Selain terlihat premium, dark mode juga lebih nyaman di mata.

## 2. Glassmorphism & Neumorphism

Efek kaca buram (*glassmorphism*) tetap menjadi favorit karena memberikan kesan modern dan elegan tanpa terlihat berlebihan.

## 3. Micro-Animations yang Bermakna

Animasi kecil yang responsif terhadap interaksi pengguna (hover, klik, scroll) menjadi elemen penting dalam menciptakan pengalaman yang terasa hidup.

## 4. AI-Generated Imagery

Gambar yang dihasilkan AI semakin marak digunakan untuk visual yang unik dan personal, menggantikan foto stok generik.

## 5. Tipografi Ekspresif

Font besar, tebal, dan berkarakter kini menjadi pusat perhatian desain—bukan hanya elemen pendukung.

## Kesimpulan

Mengikuti tren desain bukan sekadar soal estetika, tapi tentang memberikan pengalaman terbaik bagi pengguna website Anda.`,
      contentEn: `## Web Design Trends Dominating 2026

The world of web design continues to evolve. Here are the most dominant trends in 2026.

## 1. Dark Mode as Default

More and more websites are adopting dark mode as their primary display. Besides looking premium, dark mode is easier on the eyes.

## 2. Glassmorphism & Neumorphism

The frosted glass effect continues to be a favorite for its modern and elegant look.

## 3. Meaningful Micro-Animations

Small animations responsive to user interaction create a living experience.

## 4. AI-Generated Imagery

AI-generated images are increasingly used for unique and personalized visuals.

## 5. Expressive Typography

Large, bold, and characterful fonts are now the center of design attention.

## Conclusion

Following design trends is not just about aesthetics, but about providing the best experience for your website users.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
      category: 'desain',
      tags: '["Desain Web", "Tren 2026", "UI/UX", "Glassmorphism"]',
      isPublished: true,
      publishedAt: '2026-07-10T00:00:00.000Z',
      orderIdx: 1,
    },
    {
      id: 'post003',
      slug: 'cara-memilih-jasa-pembuatan-website',
      titleId: 'Cara Memilih Jasa Pembuatan Website yang Tepat untuk Bisnis Anda',
      titleEn: 'How to Choose the Right Web Development Agency for Your Business',
      excerptId: 'Tidak semua jasa pembuatan website sama. Panduan lengkap ini akan membantu Anda menghindari jebakan dan memilih partner yang tepat.',
      excerptEn: 'Not all web development services are equal. This guide will help you avoid pitfalls and choose the right partner.',
      contentId: `## Panduan Memilih Jasa Pembuatan Website

Memilih jasa pembuatan website adalah keputusan penting. Salah pilih bisa berakhir pada website yang lambat, tidak aman, atau bahkan tidak selesai.

## 1. Periksa Portofolio Mereka

Portofolio adalah cermin kemampuan sebenarnya. Pastikan desain dan kualitas website yang pernah mereka buat sesuai dengan standar yang Anda harapkan.

## 2. Transparansi Harga

Hindari vendor yang tidak transparan soal harga. Pastikan Anda mendapatkan rincian biaya yang jelas sebelum setuju.

## 3. Komunikasi yang Responsif

Vendor yang baik akan merespons pertanyaan Anda dengan cepat. Uji responsivitas mereka sebelum deal.

## 4. Layanan Purna Jual

Setelah website jadi, Anda pasti butuh bantuan untuk update atau perbaikan. Pastikan ada layanan maintenance yang jelas.

## 5. Kepemilikan Aset

Pastikan semua aset website (domain, hosting, kode) menjadi milik Anda sepenuhnya setelah proyek selesai.

## Kesimpulan

Pilih vendor yang tidak hanya murah, tapi dapat dipercaya dan memiliki rekam jejak yang jelas.`,
      contentEn: `## Guide to Choosing a Web Development Service

Choosing a web development service is an important decision that can make or break your online presence.

## 1. Check Their Portfolio

Portfolio is a mirror of true capability. Ensure the design quality meets your standards.

## 2. Price Transparency

Avoid vendors who are not transparent about pricing. Get a clear cost breakdown before agreeing.

## 3. Responsive Communication

A good vendor will respond to your questions quickly. Test their responsiveness before signing a deal.

## 4. After-Sales Service

After the website is done, you'll need help for updates or fixes. Ensure there's a clear maintenance service.

## 5. Asset Ownership

Ensure all website assets (domain, hosting, code) become fully yours after the project is complete.

## Conclusion

Choose a vendor who is not only affordable but also trustworthy with a clear track record.`,
      coverImageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
      category: 'tips',
      tags: '["Tips", "Website", "Vendor", "Panduan"]',
      isPublished: false,
      publishedAt: null,
      orderIdx: 2,
    },
  ];
  for (const r of postSeeds) await createIfMissing(token, 'posts', r, posts);

  console.log('👤 Demo client...');
  // Koleksi auth: id PB wajib ≥15 karakter dan password minimal 8 —
  // biarkan PB generate id, cari existing via email.
  const DEMO_EMAIL = 'budi@tokobagus.co.id';
  const DEMO_PASSWORD = 'demo1234';
  const foundClients = await api(
    `/api/collections/clients/records?filter=${encodeURIComponent(`email = "${DEMO_EMAIL}"`)}`,
    {},
    token,
  );
  let clientId: string | undefined = (foundClients.items || [])[0]?.id;
  if (!clientId) {
    const created = await api(
      '/api/collections/clients/records',
      {
        method: 'POST',
        body: JSON.stringify({
          name: 'Budi Santoso',
          email: DEMO_EMAIL,
          emailVisibility: true,
          password: DEMO_PASSWORD,
          passwordConfirm: DEMO_PASSWORD,
          company: 'Toko Bagus Indonesia',
          phone: '081234567890',
        }),
      },
      token,
    );
    clientId = created.id;
    console.log(`  + clients/${clientId}`);
  } else {
    console.log(`  = clients/${clientId} sudah ada, lewati`);
  }

  console.log('📁 Demo project...');
  const projects = await existingIds(token, 'projects');
  await createIfMissing(token, 'projects', {
    id: 'projectdemo001',
    clientId,
    title: 'Website Company Profile Toko Bagus Indonesia',
    description: 'Pembuatan website company profile modern untuk Toko Bagus Indonesia dengan fitur katalog produk dan formulir pemesanan online.',
    status: 'in_progress',
    phase: 'development',
    progressPercent: 65,
    notes: 'Fase desain sudah selesai dan disetujui klien. Saat ini sedang dalam proses development fitur katalog produk. Estimasi selesai development dalam 7 hari ke depan.',
    startedAt: '2026-07-05T00:00:00.000Z',
    deliveredAt: '2026-08-01T00:00:00.000Z',
  }, projects);

  console.log('');
  console.log('✅ Seeding selesai!');
  console.log('');
  console.log('📋 Akun:');
  console.log(`   Admin   : ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
  console.log(`   Client  : ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log('   URL     : /[locale]/client/login');
}

main().catch((e) => {
  console.error('❌ Seed gagal:', e.message || e);
  process.exit(1);
});
