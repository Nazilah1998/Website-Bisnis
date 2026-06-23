import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  descId: text('desc_id').notNull(),
  descEn: text('desc_en').notNull(),
  iconName: text('icon_name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const portfolios = sqliteTable('portfolios', {
  id: text('id').primaryKey(),
  titleId: text('title_id').notNull(),
  titleEn: text('title_en').notNull(),
  descId: text('desc_id').notNull(),
  descEn: text('desc_en').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  clientName: text('client_name').notNull(),
  techStack: text('tech_stack').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const pricingPlans = sqliteTable('pricing_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: text('price').notNull(),
  featuresJson: text('features_json').notNull(), // JSON array of strings
  isPopular: integer('is_popular', { mode: 'boolean' }).notNull().default(false),
  type: text('type').notNull(), // template / custom
});

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  company: text('company').notNull(),
  requirements: text('requirements').notNull(),
  estimatedBudget: text('estimated_budget').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const testimonials = sqliteTable('testimonials', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  role: text('role').notNull(),
  contentId: text('content_id').notNull(),
  contentEn: text('content_en').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const faqs = sqliteTable('faqs', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull(),
  questionEn: text('question_en').notNull(),
  answerId: text('answer_id').notNull(),
  answerEn: text('answer_en').notNull(),
  orderIdx: integer('order_idx').notNull().default(0),
});

export const clientLogos = sqliteTable('client_logos', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const stats = sqliteTable('stats', {
  id: text('id').primaryKey(),
  labelId: text('label_id').notNull(),
  labelEn: text('label_en').notNull(),
  value: text('value').notNull(), // string so we can have "100+" or "99%"
  orderIdx: integer('order_idx').notNull().default(0),
});
