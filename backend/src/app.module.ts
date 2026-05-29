import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './db/drizzle.module';
import { LogsModule } from './constlogs/constlogs.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Глобальная загрузка .env
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
