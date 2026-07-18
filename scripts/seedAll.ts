// Script untuk seed data dummy
// Jalankan dengan: npx tsx scripts/seed.ts

import 'dotenv/config';
import { db } from '../src/db';
import { posts, clients, projects } from '../src/db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding data dummy...');

  // === Blog Posts ===
  console.log('📝 Seeding blog posts...');
  await db.insert(posts).values([
    {
      id: 'post-001',
      slug: '5-alasan-bisnis-umkm-butuh-website-profesional',
      titleId: '5 Alasan Mengapa Bisnis UMKM Butuh Website Profesional',
      titleEn: '5 Reasons Why SMEs Need a Professional Website',
      excerptId: 'Di era digital ini, website bukan lagi kemewahan—melainkan kebutuhan. Temukan mengapa bisnis UMKM yang punya website tumbuh 2x lebih cepat.',
      excerptEn: 'In the digital age, a website is no longer a luxury—it\'s a necessity. Discover why SMEs with websites grow 2x faster.',
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
      publishedAt: new Date('2026-07-01'),
      createdAt: new Date('2026-07-01'),
      orderIdx: 0,
    },
    {
      id: 'post-002',
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

More and more websites are adopting dark mode as their primary display.

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
      publishedAt: new Date('2026-07-10'),
      createdAt: new Date('2026-07-10'),
      orderIdx: 1,
    },
    {
      id: 'post-003',
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
      createdAt: new Date('2026-07-15'),
      orderIdx: 2,
    },
  ]).onConflictDoNothing();

  // === Client Portal - Demo Client ===
  console.log('👤 Seeding demo client...');
  const passwordHash = await bcrypt.hash('demo123', 10);
  await db.insert(clients).values({
    id: 'client-demo-001',
    name: 'Budi Santoso',
    email: 'budi@tokobagus.co.id',
    passwordHash,
    company: 'Toko Bagus Indonesia',
    phone: '081234567890',
    createdAt: new Date(),
  }).onConflictDoNothing();

  // === Project Demo ===
  console.log('📁 Seeding demo project...');
  await db.insert(projects).values({
    id: 'project-demo-001',
    clientId: 'client-demo-001',
    title: 'Website Company Profile Toko Bagus Indonesia',
    description: 'Pembuatan website company profile modern untuk Toko Bagus Indonesia dengan fitur katalog produk dan formulir pemesanan online.',
    status: 'in_progress',
    phase: 'development',
    progressPercent: 65,
    notes: 'Fase desain sudah selesai dan disetujui klien. Saat ini sedang dalam proses development fitur katalog produk. Estimasi selesai development dalam 7 hari ke depan.',
    startedAt: new Date('2026-07-05'),
    deliveredAt: new Date('2026-08-01'),
    createdAt: new Date('2026-07-05'),
  }).onConflictDoNothing();

  console.log('✅ Seeding selesai!');
  console.log('');
  console.log('📋 Akun demo Client Portal:');
  console.log('   Email   : budi@tokobagus.co.id');
  console.log('   Password: demo123');
  console.log('   URL     : /[locale]/client/login');
  process.exit(0);
}

seed().catch(console.error);
