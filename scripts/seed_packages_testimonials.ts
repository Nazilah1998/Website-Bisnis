import 'dotenv/config';
import { db } from '../src/db';
import { pricingPlans, testimonials } from '../src/db/schema';

async function seed() {
  console.log('Seeding pricing plans and testimonials...');
  
  // Clear existing
  await db.delete(pricingPlans);
  await db.delete(testimonials);

  // Pricing plans
  const plans = [
    {
      id: 'plan_1',
      name: 'Starter',
      price: 'Rp 499.000',
      featuresJson: JSON.stringify(['1 Landing Page', 'Hosting 1 Tahun', 'Domain .my.id', 'Desain Template', 'Dukungan Basic']),
      isPopular: false,
      type: 'template',
    },
    {
      id: 'plan_2',
      name: 'Business',
      price: 'Rp 1.499.000',
      featuresJson: JSON.stringify(['3 Halaman', 'Hosting 1 Tahun', 'Domain .com', 'Desain Kustom Dasar', 'SEO Basic', 'Dukungan Prioritas']),
      isPopular: true,
      type: 'template',
    },
    {
      id: 'plan_3',
      name: 'Professional',
      price: 'Rp 3.499.000',
      featuresJson: JSON.stringify(['Hingga 10 Halaman', 'Hosting 1 Tahun', 'Domain .com', 'Desain Kustom Premium', 'SEO Lanjutan', 'Integrasi CMS', 'Dukungan 24/7']),
      isPopular: false,
      type: 'custom',
    },
    {
      id: 'plan_4',
      name: 'Enterprise',
      price: 'Mulai Rp 7.999.000',
      featuresJson: JSON.stringify(['Halaman Tak Terbatas', 'Cloud Hosting', 'Domain Bebas', 'Desain Eksklusif', 'Sistem E-Commerce/Portal', 'Optimasi Penuh', 'Manajer Akun Khusus']),
      isPopular: false,
      type: 'custom',
    },
  ];

  await db.insert(pricingPlans).values(plans);
  console.log('Inserted 4 pricing plans.');

  // Testimonials
  const testims = [
    {
      id: 't_1',
      clientName: 'Budi Santoso',
      role: 'CEO, TechNusantara',
      contentId: 'Layanan yang luar biasa! Website kami menjadi jauh lebih profesional dan menarik.',
      contentEn: 'Outstanding service! Our website has become much more professional and engaging.',
      avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      createdAt: new Date(),
    },
    {
      id: 't_2',
      clientName: 'Siti Rahmawati',
      role: 'Founder, Batik Indah',
      contentId: 'Sangat puas dengan hasilnya. Pengerjaan cepat dan sesuai ekspektasi.',
      contentEn: 'Very satisfied with the results. Fast execution and met expectations.',
      avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      createdAt: new Date(),
    },
    {
      id: 't_3',
      clientName: 'Andi Kusuma',
      role: 'Direktur, Maju Bersama',
      contentId: 'Komunikasi yang baik dan tim yang sangat responsif terhadap kebutuhan kami.',
      contentEn: 'Great communication and a team highly responsive to our needs.',
      avatarUrl: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
      createdAt: new Date(),
    },
    {
      id: 't_4',
      clientName: 'Diana Putri',
      role: 'Owner, Cafe Kopi',
      contentId: 'Desainnya modern dan kekinian, membuat pelanggan kami lebih mudah memesan online.',
      contentEn: 'Modern and trendy design, making it easier for our customers to order online.',
      avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
      createdAt: new Date(),
    },
  ];

  await db.insert(testimonials).values(testims);
  console.log('Inserted 4 testimonials.');
}

seed().catch(console.error);
