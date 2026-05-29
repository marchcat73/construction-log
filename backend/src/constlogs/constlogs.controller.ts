import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LogsService } from './constlogs.service';
import { CreateLogDto } from './dto/constlogs.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query('sort') sort?: 'asc' | 'desc') {
    // Валидация значения сортировки
    const validSort = ['asc', 'desc'].includes(sort!) ? sort : 'desc';
    return this.logsService.findAll(validSort);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLogDto: CreateLogDto) {
    return this.logsService.create(createLogDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLogDto: Partial<CreateLogDto>,
  ) {
    return this.logsService.update(id, updateLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logsService.remove(id);
  }
}
