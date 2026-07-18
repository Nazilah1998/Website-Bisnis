import { db } from './index';
import { services, portfolios, pricingPlans, testimonials, faqs, clientLogos, stats } from './schema';

async function main() {
  console.log('Seeding dummy data...');

  // 1. Services
  await db.insert(services).values([
    {
      id: 'profile',
      titleId: 'Profil Perusahaan',
      titleEn: 'Company Profile',
      descId: 'Website profesional untuk merepresentasikan bisnis Anda.',
      descEn: 'Professional website to represent your business.',
      iconName: 'Monitor',
      isActive: true,
    },
    {
      id: 'ecommerce',
      titleId: 'Toko Online',
      titleEn: 'E-Commerce',
      descId: 'Platform jualan online dengan fitur lengkap.',
      descEn: 'Full-featured online selling platform.',
      iconName: 'ShoppingCart',
      isActive: true,
    },
    {
      id: 'landing',
      titleId: 'Landing Page',
      titleEn: 'Landing Page',
      descId: 'Halaman konversi tinggi untuk produk atau kampanye.',
      descEn: 'High-conversion page for products or campaigns.',
      iconName: 'LayoutTemplate',
      isActive: true,
    }
  ]);

  // 2. Portfolios
  await db.insert(portfolios).values([
    {
      id: '1',
      titleId: 'Dashboard Analytics',
      titleEn: 'Dashboard Analytics',
      descId: 'Sistem manajemen data.',
      descEn: 'Data management system.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      category: 'Web App',
      clientName: 'PT Maju Bersama',
      techStack: 'React, Node.js',
      createdAt: new Date(),
    },
    {
      id: '2',
      titleId: 'Toko Elektronik Online',
      titleEn: 'Online Electronics Store',
      descId: 'E-commerce modern.',
      descEn: 'Modern e-commerce.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80',
      category: 'E-Commerce',
      clientName: 'ElectroShop',
      techStack: 'Next.js, Tailwind',
      createdAt: new Date(),
    },
    {
      id: '3',
      titleId: 'Aplikasi Fintech',
      titleEn: 'Fintech App',
      descId: 'Aplikasi keuangan.',
      descEn: 'Financial application.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      category: 'Mobile App',
      clientName: 'Finaku',
      techStack: 'React Native',
      createdAt: new Date(),
    }
  ]);

  // 3. Pricing
  await db.insert(pricingPlans).values([
    {
      id: 'basic',
      name: 'Basic',
      price: 'Rp 1.5M',
      featuresJson: JSON.stringify(['1 Landing Page', 'Mobile Responsive', 'SEO Basic', 'Revisi 1x']),
      isPopular: false,
      type: 'template'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'Rp 4.5M',
      featuresJson: JSON.stringify(['5 Halaman Web', 'Mobile Responsive', 'SEO Optimized', 'CMS Admin Panel', 'Revisi 3x']),
      isPopular: true,
      type: 'custom'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      featuresJson: JSON.stringify(['Custom Web App', 'E-Commerce / Dashboard', 'Advanced SEO & Analytics', 'Maintenance 1 Tahun']),
      isPopular: false,
      type: 'custom'
    }
  ]);

  // 4. Testimonials
  await db.insert(testimonials).values([
    {
      id: 't1',
      clientName: 'Budi Santoso',
      role: 'CEO Maju Bersama',
      contentId: 'Pelayanan luar biasa! Website selesai tepat waktu dan hasilnya sangat profesional.',
      contentEn: 'Outstanding service! Website completed on time and highly professional result.',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      createdAt: new Date(),
    },
    {
      id: 't2',
      clientName: 'Siti Aminah',
      role: 'Founder Butikku',
      contentId: 'Sejak menggunakan jasa mereka, penjualan online kami meningkat pesat berkat UI yang sangat mudah digunakan.',
      contentEn: 'Since using their service, our online sales skyrocketed thanks to the easy UI.',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      createdAt: new Date(),
    },
    {
      id: 't3',
      clientName: 'Ahmad Faisal',
      role: 'CTO TechInnovate',
      contentId: 'Sangat responsif dan solutif. Mereka benar-benar mengerti apa yang bisnis kami butuhkan di era digital.',
      contentEn: 'Very responsive and solution-oriented. They truly understand our digital business needs.',
      avatarUrl: 'https://i.pravatar.cc/150?img=8',
      createdAt: new Date(),
    }
  ]);

  // 5. FAQs
  await db.insert(faqs).values([
    {
      id: 'f1',
      questionId: 'Berapa lama proses pembuatan website?',
      questionEn: 'How long does the website development take?',
      answerId: 'Tergantung pada tingkat kerumitan fitur. Untuk paket Basic biasanya memakan waktu 3-5 hari kerja. Sedangkan paket Pro sekitar 2-3 minggu.',
      answerEn: 'Depends on the feature complexity. Basic packages take 3-5 working days. Pro packages take 2-3 weeks.',
      orderIdx: 1,
    },
    {
      id: 'f2',
      questionId: 'Apakah saya perlu menyiapkan domain & hosting?',
      questionEn: 'Do I need to prepare domain & hosting?',
      answerId: 'Tidak perlu. Semua paket kami sudah termasuk domain (.com / .id) dan hosting gratis untuk 1 tahun pertama.',
      answerEn: 'No need. All packages include a domain (.com/.id) and free hosting for the first year.',
      orderIdx: 2,
    },
    {
      id: 'f3',
      questionId: 'Apakah desainnya bisa disesuaikan (custom)?',
      questionEn: 'Can the design be customized?',
      answerId: 'Tentu. Paket Pro dan Enterprise menawarkan kustomisasi desain UI/UX sesuai dengan brand identity Anda secara eksklusif.',
      answerEn: 'Absolutely. Pro and Enterprise packages offer UI/UX customization tailored to your brand identity.',
      orderIdx: 3,
    }
  ]);

  // 6. Stats
  await db.insert(stats).values([
    {
      id: 's1',
      labelId: 'Proyek Selesai',
      labelEn: 'Completed Projects',
      value: '150+',
      orderIdx: 1,
    },
    {
      id: 's2',
      labelId: 'Klien Puas',
      labelEn: 'Happy Clients',
      value: '99%',
      orderIdx: 2,
    },
    {
      id: 's3',
      labelId: 'Ahli IT',
      labelEn: 'IT Experts',
      value: '20+',
      orderIdx: 3,
    },
    {
      id: 's4',
      labelId: 'Tahun Pengalaman',
      labelEn: 'Years Experience',
      value: '5+',
      orderIdx: 4,
    }
  ]);

  // 7. Client Logos
  await db.insert(clientLogos).values([
    {
      id: 'l1',
      name: 'Next.js',
      logoUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png',
      isActive: true,
    },
    {
      id: 'l2',
      name: 'React',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
      isActive: true,
    },
    {
      id: 'l3',
      name: 'Node.js',
      logoUrl: 'https://nodejs.org/static/images/logo.svg',
      isActive: true,
    },
    {
      id: 'l4',
      name: 'Tailwind CSS',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
      isActive: true,
    }
  ]);

  console.log('Seeding complete!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
