import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import pino from 'pino';
import expressPinoLogger from 'express-pino-logger';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import MongooseService from './config/database';
import initPassport from './config/passport';
import apiRouter from './api/';
import mongoose from 'mongoose';
import { sessionSecret } from './secrets';
import { keycloak } from './secrets';
import { Issuer, Strategy } from 'openid-client';
import User, { IUserModel } from './models/User';
import bcrypt from 'bcryptjs';

function main() {
  if (MongooseService.isConnected) {
    // set up Express
    const app = express();
    const port = parseInt(process.env.PORT) || 8095;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // set up session
    app.use(
      session({
        secret: sessionSecret.secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          maxAge: 1000 * 60 * 60 * 5, // 5 hrs
        },

        // comment out the following to default to a memory-based store, which,
        // of course, will not persist across load balanced servers
        // or survive a restart of the server
        store: MongoStore.create({
          mongoUrl: MongooseService.MONGODB_URI,
          ttl: 14 * 24 * 60 * 60, // 14 days
        }),
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    initPassport(passport, app);

    // set up Pino logging
    const logger = pino({
      transport: {
        target: 'pino-pretty',
      },
    });
    app.use(expressPinoLogger({ logger }));

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (!req.session.cart) {
        req.session.cart = [];
      }
      next();
    });

    app.use('/api/', apiRouter);

    app.listen(port, () => {
      console.log(`E-commerce server listening on port ${port}`);
    });
  } else {
    setTimeout(main, 0);
  }
}
main();
