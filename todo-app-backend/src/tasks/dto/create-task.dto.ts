import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PRIORITY_LEVELS } from '../../common/constants';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Titre de la tâche',
    example: 'Faire les courses',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Description de la tâche',
    example: 'Acheter du pain, du lait et des œufs',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date d\'échéance (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Priorité de la tâche',
    enum: Object.values(PRIORITY_LEVELS),
    example: 'high',
  })
  @IsEnum(Object.values(PRIORITY_LEVELS))
  @IsOptional()
  priority?: string;
}

