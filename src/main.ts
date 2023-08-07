import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import * as session from 'express-session';
import * as passport from 'passport';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * enable cors
   */
  const whitelist = ["http://localhost:3000","http://localhost:3001","http://172.20.101.38:3300","http://172.20.101.24:3000","http://127.0.0.1:5173"]
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.log("cors failed")
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials:true,
  });

  /**
   * Setup session store
   */
  const store = new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod:2*60*1000,
      dbRecordIdIsSessionId:true,
      dbRecordIdFunction:undefined,
    }
  )

  /**
   * Setup session
   */
  app.use(session({
    store,
    secret:"Replace it with session secrete",
    resave:false,
    saveUninitialized:false,
    name:'qid',
    cookie:{
      secure:false,
      httpOnly:true,
      maxAge:1000*60*60*24*7,
      sameSite:false,
    }
  }));
  /**
   * initialize passport session
   */
  app.use(passport.initialize());
  app.use(passport.session())

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  //add exception filters
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {enableImplicitConversion: true},
    forbidNonWhitelisted: true
  }))

  await app.listen(4000);
}
bootstrap();
