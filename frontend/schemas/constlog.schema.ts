import { z } from 'zod';

export const logSchema = z.object({
  id: z.number().optional(),
  workDate: z.string().min(1, 'Выберите дату'),
  workType: z.string().min(2, 'Выберите или введите вид работ'),
  volume: z
    .string()
    .regex(/^\d+(\.\d+)?\s*\S+$/, 'Формат: число + единица (напр. 23м³)'),
  workerName: z.string().min(3, 'Укажите ФИО'),
});

export type LogFormValues = z.infer<typeof logSchema>;
