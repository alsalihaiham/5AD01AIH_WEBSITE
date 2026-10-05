import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const cars=sqliteTable('cars',{id:text('id').primaryKey(),slug:text('slug').notNull().unique(),status:text('status').notNull().default('draft'),data:text('data').notNull(),updatedAt:text('updated_at').notNull()},t=>[index('idx_cars_status_updated').on(t.status,t.updatedAt)]);
export const media=sqliteTable('media',{id:text('id').primaryKey(),carId:text('car_id').notNull().references(()=>cars.id),key:text('key').notNull(),mime:text('mime').notNull(),size:integer('size').notNull()},t=>[index('idx_media_car').on(t.carId)]);
export const aiUsage=sqliteTable('ai_usage',{key:text('key').primaryKey(),count:integer('count').notNull().default(0)});

// Private seller requests: never joined into the public car catalogue.
export const sellSubmissions=sqliteTable('sell_submissions',{
  id:text('id').primaryKey(),reference:text('reference').notNull().unique(),
  tokenHash:text('token_hash').notNull(),status:text('status').notNull().default('draft'),
  data:text('data').notNull(),createdAt:text('created_at').notNull(),submittedAt:text('submitted_at'),
  expiresAt:integer('expires_at').notNull(),bytes:integer('bytes').notNull().default(0),
  photos:integer('photos').notNull().default(0),videos:integer('videos').notNull().default(0),
},t=>[index('idx_sell_status_created').on(t.status,t.createdAt),index('idx_sell_expiry').on(t.expiresAt)]);
export const sellMedia=sqliteTable('sell_media',{
  id:text('id').primaryKey(),submissionId:text('submission_id').notNull().references(()=>sellSubmissions.id,{onDelete:'cascade'}),
  key:text('key').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),
  state:text('state').notNull().default('pending'),createdAt:text('created_at').notNull(),
},t=>[index('idx_sell_media_submission').on(t.submissionId)]);
export const sellRateLimits=sqliteTable('sell_rate_limits',{
  key:text('key').primaryKey(),count:integer('count').notNull().default(0),expiresAt:integer('expires_at').notNull(),
},t=>[index('idx_sell_rate_expiry').on(t.expiresAt)]);
