import {
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PRIORITY_LEVELS } from '../../common/constants';

export class TaskQueryDto {
  @ApiPropertyOptional({
    description: 'Numéro de page',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments par page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtrer par statut de complétion',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrer par priorité',
    enum: Object.values(PRIORITY_LEVELS),
    example: 'high',
  })
  @IsOptional()
  @IsEnum(Object.values(PRIORITY_LEVELS))
  priority?: string;

  @ApiPropertyOptional({
    description: 'Date de début pour l\'échéance (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date de fin pour l\'échéance (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @ApiPropertyOptional({
    description: 'Recherche dans le titre et la description',
    example: 'courses',
  })
  @IsOptional()
  search?: string;
}

