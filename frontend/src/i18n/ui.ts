export const defaultLang = 'id' as const;
export const languages = { id: 'Indonesia', en: 'English' } as const;
export type Locale = keyof typeof languages;

const id = {
  HomePage: {
    title: 'Jasa Pembuatan Website dan Aplikasi Profesional',
    subtitle: 'Kami membangun representasi digital premium untuk bisnis Anda.',
    cta_booking: 'Konsultasi Sekarang',
    cta_portfolio: 'Lihat Portofolio',
  },
  Navigation: {
    home: 'Beranda',
    about: 'Tentang Kami',
    services: 'Layanan',
    portfolio: 'Portofolio',
    pricing: 'Harga',
    testimonials: 'Testimoni',
    faqs: 'FAQ',
  },
  Services: {
    title: 'Layanan Kami',
    subtitle:
      'Solusi digital komprehensif yang dirancang khusus untuk memenuhi kebutuhan bisnis Anda.',
    items: {
      company_profile: {
        title: 'Company Profile',
        description:
          'Tingkatkan kredibilitas bisnis Anda dengan website company profile yang profesional dan responsif.',
      },
      ecommerce: {
        title: 'E-Commerce',
        description:
          'Bangun toko online Anda sendiri dengan fitur lengkap untuk memaksimalkan penjualan.',
      },
      landing_page: {
        title: 'Landing Page Promosi',
        description:
          'Halaman tunggal yang dioptimasi untuk konversi kampanye marketing Anda.',
      },
    },
  },
  Portfolio: {
    title: 'Portofolio',
    subtitle: 'Beberapa karya terbaik yang telah kami kerjakan untuk klien kami.',
  },
  Pricing: {
    title: 'Paket Harga',
    subtitle: 'Pilih paket yang sesuai dengan skala dan kebutuhan bisnis Anda.',
    custom_quote: 'Butuh fitur khusus? Hubungi kami untuk penawaran kustom.',
    popular: 'Paling Populer',
    per_project: '/proyek',
    contact_us: 'Hubungi Kami',
  },
  About: {
    metaTitle: 'Tentang Kami',
    metaDesc:
      'Kenali lebih dekat ZilyaDigital — agensi digital yang berdedikasi membantu bisnis berkembang di era digital.',
  },
} as const;

const en: Record<string, unknown> = {
  HomePage: {
    title: 'Professional Website Development Agency',
    subtitle: 'We build premium digital representation for your business.',
    cta_booking: 'Consult Now',
    cta_portfolio: 'View Portfolio',
  },
  Navigation: {
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    portfolio: 'Portfolio',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    faqs: 'FAQ',
  },
  Services: {
    title: 'Our Services',
    subtitle:
      'Comprehensive digital solutions tailored specifically to meet your business needs.',
    items: {
      company_profile: {
        title: 'Company Profile',
        description:
          'Enhance your business credibility with a professional and responsive company profile website.',
      },
      ecommerce: {
        title: 'E-Commerce',
        description:
          'Build your own online store with complete features to maximize sales.',
      },
      landing_page: {
        title: 'Promotional Landing Page',
        description:
          'A single page optimized for conversion of your marketing campaigns.',
      },
    },
  },
  Portfolio: {
    title: 'Portfolio',
    subtitle: 'Some of the best works we have delivered for our clients.',
  },
  Pricing: {
    title: 'Pricing Plans',
    subtitle: 'Choose a plan that fits the scale and needs of your business.',
    custom_quote: 'Need custom features? Contact us for a custom quote.',
    popular: 'Most Popular',
    per_project: '/project',
    contact_us: 'Contact Us',
  },
  About: {
    metaTitle: 'About Us',
    metaDesc:
      'Get to know ZilyaDigital — a digital agency dedicated to helping businesses grow in the digital era.',
  },
};

export const messages: Record<Locale, typeof id> = {
  id: id as typeof id,
  en: en as typeof id,
};