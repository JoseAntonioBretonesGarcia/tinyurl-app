import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('');
  const port = process.env.PORT || 3000;
  await app.listen(port as number);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error starting Nest application', err);
});
