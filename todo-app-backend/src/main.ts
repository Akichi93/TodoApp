import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { NOTIFICATION_QUEUE } from './rabbitmq/rabbitmq.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Todo App API')
    .setDescription(
      'API REST complète pour la gestion des tâches avec authentification JWT, cache Redis, pagination et filtres avancés.\n\n' +
        '## Fonctionnalités\n\n' +
        '- Authentification JWT (access token + refresh token)\n' +
        '- CRUD complet pour les utilisateurs et les tâches\n' +
        '- Gestion du profil utilisateur\n' +
        '- Filtrage et pagination avancés\n' +
        '- Cache Redis pour optimiser les performances\n' +
        '- Validation des données\n' +
        '- Notifications automatiques pour les tâches dépassées\n\n' +
        '## Authentification\n\n' +
        'La plupart des endpoints nécessitent une authentification. Utilisez le bouton "Authorize" pour ajouter votre token JWT.\n\n' +
        '1. Inscrivez-vous via `/auth/register`\n' +
        '2. Connectez-vous via `/auth/login` pour obtenir votre access token\n' +
        '3. Utilisez le refresh token via `/auth/refresh` pour obtenir un nouveau access token',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag(
      'Auth',
      "Endpoints pour l'authentification (inscription, connexion, refresh token)",
    )
    .addTag(
      'Profile',
      'Endpoints pour la gestion du profil utilisateur (GET /users/me, PATCH /users/me)',
    )
    .addTag('Users', 'Endpoints pour la gestion des utilisateurs (CRUD)')
    .addTag(
      'Tasks',
      'Endpoints pour la gestion des tâches (CRUD, filtres, pagination)',
    )
    .addServer('http://localhost:3000', 'Serveur de développement')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Todo App API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: NOTIFICATION_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
