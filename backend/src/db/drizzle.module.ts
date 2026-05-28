/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
// src/db/drizzle.module.ts
import {
  Global,
  Module,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get<string>('DATABASE_URL'),
          max: 20, // пул соединений
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });

        const db = drizzle(pool, {
          schema,
          logger: process.env.NODE_ENV === 'development',
        });

        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DRIZZLE_CLIENT'],
})
export class DrizzleModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('DRIZZLE_CLIENT') private db: NodePgDatabase<typeof schema>,
  ) {}

  async onModuleInit() {
    // Проверка подключения
    await this.db.execute(sql`SELECT 1`);
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    // Закрываем пул соединений
    const pool = (this.db as any).client;
    await pool?.end?.();
    console.log('✅ Database connection closed');
  }
}
