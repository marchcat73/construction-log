import { relations } from 'drizzle-orm';
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

export const workers = pgTable('workers', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 150 }).notNull().unique(),
  // В будущем можно добавить: position, phone, hireDate и т.д.
});

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  workDate: date('work_date').notNull(),
  workTypeId: integer('work_type_id').references(() => workTypes.id, {
    onDelete: 'set null',
  }),
  volume: varchar('volume', { length: 20 }).notNull(),
  workerId: integer('worker_id')
    .references(() => workers.id, { onDelete: 'restrict' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 🔗 Отношения Drizzle
export const workTypesRelations = relations(workTypes, ({ many }) => ({
  logs: many(logs),
}));

export const workersRelations = relations(workers, ({ many }) => ({
  logs: many(logs),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  workType: one(workTypes, {
    fields: [logs.workTypeId],
    references: [workTypes.id],
  }),
  worker: one(workers, { fields: [logs.workerId], references: [workers.id] }),
}));
