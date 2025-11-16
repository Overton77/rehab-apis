import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register multipart plugin for file uploads
  await app.register(multipart as any);

  app.enableShutdownHooks();
  await app.listen(
    process.env.PORT ? Number(process.env.PORT) : 4001,
    '0.0.0.0',
  );
}
bootstrap().catch(console.error);
