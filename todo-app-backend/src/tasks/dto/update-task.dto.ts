import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PRIORITY_LEVELS } from '../../common/constants';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Titre de la tâche',
    example: 'Faire les courses',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description de la tâche',
    example: 'Acheter du pain, du lait et des œufs',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Statut de complétion',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

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

