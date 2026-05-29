import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, asc } from 'drizzle-orm';
import * as schema from '../db/schema';
import { logs, workTypes, workers } from '../db/schema';
import { CreateLogDto } from './dto/constlogs.dto';

@Injectable()
export class LogsService {
  constructor(
    @Inject('DRIZZLE_CLIENT') private db: NodePgDatabase<typeof schema>,
  ) {}

  private async getOrCreateWorker(fullName: string): Promise<number> {
    const trimmed = fullName.trim();
    const existing = await this.db
      .select()
      .from(workers)
      .where(eq(workers.fullName, trimmed))
      .limit(1);
    if (existing.length) return existing[0].id;

    const inserted = await this.db
      .insert(workers)
      .values({ fullName: trimmed })
      .returning({ id: workers.id });
    return inserted[0].id;
  }

  private async getOrCreateWorkType(name: string): Promise<number | null> {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const existing = await this.db
      .select()
      .from(workTypes)
      .where(eq(workTypes.name, trimmed))
      .limit(1);
    if (existing.length) return existing[0].id;
    const inserted = await this.db
      .insert(workTypes)
      .values({ name: trimmed })
      .returning({ id: workTypes.id });
    return inserted[0].id;
  }

  async findAll(sort: 'asc' | 'desc' = 'desc') {
    const orderBy = sort === 'asc' ? asc(logs.workDate) : desc(logs.workDate);
    return this.db
      .select({
        id: logs.id,
        workDate: logs.workDate,
        workType: workTypes.name,
        volume: logs.volume,
        workerName: workers.fullName,
        workerId: workers.id,
      })
      .from(logs)
      .leftJoin(workTypes, eq(logs.workTypeId, workTypes.id))
      .innerJoin(workers, eq(logs.workerId, workers.id))
      .orderBy(orderBy);
  }

  async create(dto: CreateLogDto) {
    const typeId = await this.getOrCreateWorkType(dto.workType);
    const workerId = await this.getOrCreateWorker(dto.workerName);

    return await this.db
      .insert(logs)
      .values({
        workDate: dto.workDate,
        workTypeId: typeId,
        volume: dto.volume,
        workerId,
      })
      .returning()
      .then((res) => res[0]);
  }

  async update(id: number, dto: Partial<CreateLogDto>) {
    const typeId = dto.workType
      ? await this.getOrCreateWorkType(dto.workType)
      : undefined;
    const workerId = dto.workerName
      ? await this.getOrCreateWorker(dto.workerName)
      : undefined;

    const updated = await this.db
      .update(logs)
      .set({
        workTypeId: typeId,
        workerId,
        volume: dto.volume,
        workDate: dto.workDate,
        updatedAt: new Date(),
      })
      .where(eq(logs.id, id))
      .returning();

    if (!updated.length) throw new NotFoundException('Запись не найдена');
    return updated[0];
  }

  async remove(id: number) {
    const deleted = await this.db
      .delete(logs)
      .where(eq(logs.id, id))
      .returning();
    if (!deleted.length) throw new NotFoundException('Запись не найдена');
    return { success: true };
  }
}
