import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'exception';
import { version } from '../package.json';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app.config.service';

// Result dari prisma terkadang ada yang tipe BigInt
// saat direturn, maka nestJS akan stringify menggunakan JSON.stringify
// dan akan error. Kode di bawah ini adalah workaroundnya
(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

// patch nestjs agar swagger bisa menampilkan zod schema
patchNestjsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error'] });
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 3600
  })
  const { PORT, DOCS_URL } = app.get(AppConfigService).env;
  if (DOCS_URL) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Nest ESM Prisma Docs')
        .setDescription('The Nest ESM Prisma API Documentation')
        .addBearerAuth()
        .setVersion(version)
        .build(),
    );
    SwaggerModule.setup(
      DOCS_URL,
      app,
      {
        ...document,
        openapi: '3.1.0', // see https://github.com/anatine/zod-plugins/issues/191
      },
      {
        swaggerOptions: {
          persistAuthorization: true,
        },
      },
    );
  }
  await app.listen(PORT);
  console.log(`App run on http://localhost:${PORT}`);
}
bootstrap();
