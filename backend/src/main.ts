import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer CORS pour permettre les requêtes depuis le frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Port par défaut de Vite
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend is running on: http://localhost:${port}`);
}
bootstrap();
