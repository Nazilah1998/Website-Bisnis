import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').notNull(),
});

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  descId: text('desc_id').notNull(),
  descEn: text('desc_en').notNull(),
  iconName: text('icon_name').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  orderIdx: integer('order_idx').notNull().default(0),
});

export const portfolios = pgTable('portfolios', {
  id: text('id').primaryKey(),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  descId: text('desc_id').notNull(),
  descEn: text('desc_en').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  clientName: text('client_name').notNull(),
  techStack: text('tech_stack').notNull(),
  // Case Study fields
  challenge: text('challenge'),
  solution: text('solution'),
  results: text('results'), // JSON: [{metric, label}]
  liveUrl: text('live_url'),
  createdAt: timestamp('created_at').notNull(),
  orderIdx: integer('order_idx').notNull().default(0),
});

export const pricingPlans = pgTable('pricing_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: text('price').notNull(),
  featuresJson: text('features_json').notNull(), // JSON array of strings
  isPopular: boolean('is_popular').notNull().default(false),
  type: text('type').notNull(), // template / custom
  orderIdx: integer('order_idx').notNull().default(0),
});

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  company: text('company').notNull(),
  requirements: text('requirements').notNull(),
  estimatedBudget: text('estimated_budget').notNull(),
  status: text('status').notNull().default('New'), // New, Contacted, Proposal, Closed Won, Closed Lost
  createdAt: timestamp('created_at').notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  role: text('role').notNull(),
  contentId: text('content_id').notNull(),
  contentEn: text('content_en').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: timestamp('created_at').notNull(),
  orderIdx: integer('order_idx').notNull().default(0),
});

export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull(),
  questionEn: text('question_en').notNull(),
  answerId: text('answer_id').notNull(),
  answerEn: text('answer_en').notNull(),
  orderIdx: integer('order_idx').notNull().default(0),
});

export const clientLogos = pgTable('client_logos', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  orderIdx: integer('order_idx').notNull().default(0),
});

export const stats = pgTable('stats', {
  id: text('id').primaryKey(),
  labelId: text('label_id').notNull(),
  labelEn: text('label_en').notNull(),
  value: text('value').notNull(), // string so we can have "100+" or "99%"
  orderIdx: integer('order_idx').notNull().default(0),
});

// --- Blog / Artikel ---
export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  excerptId: text('excerpt_id').notNull(),
  excerptEn: text('excerpt_en').notNull(),
  contentId: text('content_id').notNull(),
  contentEn: text('content_en').notNull(),
  coverImageUrl: text('cover_image_url').notNull(),
  category: text('category').notNull(),
  tags: text('tags').notNull().default('[]'), // JSON array
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull(),
  orderIdx: integer('order_idx').notNull().default(0),
});

// --- Client Portal ---
export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  company: text('company'),
  phone: text('phone'),
  createdAt: timestamp('created_at').notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('pending'), // pending, in_progress, review, done
  phase: text('phase').notNull().default('desain'),     // desain, development, testing, launch
  progressPercent: integer('progress_percent').notNull().default(0),
  notes: text('notes'),
  startedAt: timestamp('started_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').notNull(),
});

export const projectAssets = pgTable('project_assets', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(), // amount in IDR (integer is fine if we don't do decimals)
  description: text('description').notNull(),
  status: text('status').notNull().default('unpaid'), // unpaid, paid, overdue
  dueDate: timestamp('due_date').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const tickets = pgTable('tickets', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('open'), // open, resolved
  createdAt: timestamp('created_at').notNull(),
});
