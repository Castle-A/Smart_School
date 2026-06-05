import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Middleware cookie-parser (Master Security: Support des cookies HttpOnly)
  app.use(cookieParser());

  // Configuration du préfixe global API (Master Architecture: Standardisation des routes)
  app.setGlobalPrefix('api');

  // Serve static files from uploads directory (for local development)
  const express = await import('express');
  const path = await import('path');
  app.use(
    '/uploads',
    express.default.static(path.join(process.cwd(), 'uploads')),
  );

  // Filtre d'exceptions global (Master Quality: Gestion centralisée des erreurs)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Security headers
  app.use(helmet());

  // Rate limiting
  // 1. Strict Rate Limiting for Auth (Brute Force Protection)
  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // Limit each IP to 20 requests per windowMs
      message:
        'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // 2. Relaxed Rate Limiting for General API (Dashboard Usage)
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 1000, // 1000 requests per minute
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
      standardHeaders: true,
      legacyHeaders: false,
      // Skip auth routes as they have their own stricter limiter
      skip: (req) => req.path.startsWith('/api/auth'),
    }),
  );

  // CORS configuration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3003';
  const allowedOrigins = frontendUrl.split(',').map((url) => url.trim());

  // Autoriser ngrok UNIQUEMENT en mode développement via variable d'environnement
  if (process.env.NODE_ENV === 'development' && process.env.NGROK_URL) {
    const ngrokUrl = process.env.NGROK_URL.trim();
    if (!allowedOrigins.includes(ngrokUrl)) {
      allowedOrigins.push(ngrokUrl);
      console.log(`⚠️  DEV MODE: NGROK URL autorisée: ${ngrokUrl}`);
    }
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Port Configuration
  const port = process.env.PORT ?? 3010;

  // Swagger Documentation Setup (Master Architecture: Documentation auto-générée)
  if (process.env.NODE_ENV !== 'production') {
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('SmartSchool API')
      .setDescription('Documentation de l\'API SmartSchool v2.0')
      .setVersion('2.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .addTag('Auth', 'Authentification et gestion de session')
      .addTag('Finance', 'Gestion des paiements et dépenses')
      .addTag('School', 'Gestion des établissements')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
      },
      customSiteTitle: 'SmartSchool API Docs',
    });
    console.log(`📚 Swagger Documentation is running on: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);

  console.log(`🚀 Backend is running on: http://localhost:${port}`);
  console.log(`✅ Security: Helmet, Rate Limiting, CORS configured`);
  console.log(`✅ Validation: Global ValidationPipe enabled`);
  console.log(`🌐 CORS allowed origins:`);
  allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));
}
bootstrap();
