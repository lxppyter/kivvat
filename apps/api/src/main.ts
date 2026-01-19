import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FingerprintExceptionFilter } from './common/filters/fingerprint.exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Register Fingerprint Filter
  app.useGlobalFilters(new FingerprintExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev (avoid blocking inline scripts/styles if needed)
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    xssFilter: true, // Protection against Cross-site scripting (XSS) attacks
    noSniff: true, // Protection against MIME type sniffing
    hidePoweredBy: true, // Hide X-Powered-By header
    frameguard: { action: 'deny' }, // Protection against Clickjacking
  }));

  // CORS Configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  console.log(`Application is running on: http://localhost:${port} [v2.2]`);
  
  // Anti-Theft / Copyright Notice (Watermark)
  // Check removed for visibility in Dev
  console.log(`\x1b[31m
    ********************************************
    * KIVVAT SECURITY ENGINE (AGPLv3 LICENSED) *
    * COPYRIGHT (C) 2026 KIVVAT INC.           *
    * UNAUTHORIZED COPYING IS PROHIBITED       *
    * TRACKING ID: KIV-992-X-771               *
    ********************************************
    \x1b[0m`);

  await app.listen(port);
}
bootstrap();
