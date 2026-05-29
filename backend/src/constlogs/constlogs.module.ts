import { Module } from '@nestjs/common';
import { LogsController } from './constlogs.controller';
import { LogsService } from './constlogs.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService], // Экспортируем на случай, если понадобится в других модулях
})
export class LogsModule {}
