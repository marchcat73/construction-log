import {
  pgTable,
  serial,
  varchar,
  date,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

export const workTypes = pgTable('work_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
});

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  workDate: date('work_date').notNull(),
  workTypeId: integer('work_type_id').references(() => workTypes.id, {
    onDelete: 'set null',
  }),
  volume: varchar('volume', { length: 20 }).notNull(),
  workerName: varchar('worker_name', { length: 150 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
