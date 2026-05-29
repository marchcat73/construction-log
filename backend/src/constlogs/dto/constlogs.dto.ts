import { IsString, IsDateString, Matches } from 'class-validator';

export class CreateLogDto {
  @IsDateString()
  workDate: string;

  @IsString()
  workType: string;

  @IsString()
  @Matches(/^\d+(\.\d+)?\s*\S+$/, {
    message: 'Объём должен быть числом с единицей измерения (напр. 23м³)',
  })
  volume: string;

  @IsString()
  workerName: string; // Теперь это fullName, который разрешится в workerId
}
