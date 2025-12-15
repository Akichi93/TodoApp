import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle tâche' })
  @ApiResponse({
    status: 201,
    description: 'Tâche créée avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  create(@CurrentUser() user: { id: string }, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(user.id, createTaskDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtenir mes tâches',
    description:
      'Récupère la liste paginée des tâches de l\'utilisateur connecté avec des filtres avancés. ' +
      'Supporte la recherche, le filtrage par statut, priorité et dates d\'échéance.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des tâches récupérée avec succès',
    schema: {
      example: {
        data: {
          data: [
            {
              id: 'uuid',
              title: 'Faire les courses',
              description: 'Acheter du pain et du lait',
              completed: false,
              priority: 'high',
              dueDate: '2024-12-31T23:59:59.000Z',
              userId: 'user-uuid',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        },
        statusCode: 200,
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page (défaut: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Nombre d\'éléments par page (défaut: 10, max: 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'completed',
    required: false,
    type: Boolean,
    description: 'Filtrer par statut de complétion',
    example: false,
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['low', 'medium', 'high'],
    description: 'Filtrer par priorité',
    example: 'high',
  })
  @ApiQuery({
    name: 'dueDateFrom',
    required: false,
    type: String,
    description: 'Date de début pour l\'échéance (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'dueDateTo',
    required: false,
    type: String,
    description: 'Date de fin pour l\'échéance (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Recherche dans le titre et la description',
    example: 'courses',
  })
  findAll(@CurrentUser() user: { id: string }, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une tâche par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 200,
    description: 'Tâche trouvée',
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  findOne(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une tâche' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 200,
    description: 'Tâche modifiée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, user.id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une tâche' })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({
    status: 204,
    description: 'Tâche supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.tasksService.remove(id, user.id);
  }
}

