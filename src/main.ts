import dotenv from 'dotenv';
// ! 모든 모듈이 로드되기 전에 .env를 불러 와야 하기 때문에 항상 최상위에서 로드해야 한다.
dotenv.config();
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './httpException.filter';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  // Class-validator 파이프
  app.useGlobalPipes(new ValidationPipe());
  // Exception filter 적용
  app.useGlobalFilters(new HttpExceptionFilter());
  // Swagger 세팅
  const config = new DocumentBuilder()
    .setTitle("D'OH Project API")
    .setDescription("D'OH 프로젝트 API")
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // CORS 설정
  app.enableCors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
  });
  // 쿠키, Passport 설정
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(port);
  console.log(`listening on port ${port}`);
  // Hot-reloading 설정
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
