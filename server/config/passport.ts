import bcrypt from 'bcryptjs';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import User, { IUserModel } from '../models/User';
// import User, { IUser } from '../models/User';
import { PassportStatic } from 'passport';
import { Request, Response } from 'express';
import { Issuer, Strategy } from 'openid-client';

import { keycloak } from '../secrets';

function useLocal(passport: PassportStatic) {
  const authenticateUser: VerifyFunction = (username, password, done) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'No user with that username. ' });
        } else {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user, { message: 'Login Success. ' });
            } else {
              return done(null, false, { message: 'Password incorrect. ' });
            }
          });
        }
      })
      .catch((err) => {
        return done(err);
      });
  };

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        // passReqToCallback : true,
      }, //passReqToCallback: true },
      authenticateUser
    )
  );

  passport.serializeUser((user: any, done) => {
    // console.log('serializeUser', user);
    process.nextTick(function () {
      done(null, {
        id: user._id,
        username: user.username,
        roleType: user.roleType,
        // cart: user.cart,
      });
      // done(null, user);
    });
  });

  passport.deserializeUser((user: any, done) => {
    // console.log('deserializeUser', user);
    process.nextTick(() => {
      return done(null, user);
    });
  });
}
function initSerializeDeserialize(passport: PassportStatic) {
  passport.serializeUser((user: any, done) => {
    console.log('serializeUser', user);
    process.nextTick(function () {
      done(null, {
        id: user.sub,
        username: user.preferred_username,
        roleType: user.roleType,
      });
      // done(null, user);
    });
  });

  passport.deserializeUser((user: any, done) => {
    console.log('deserializeUser', user);
    process.nextTick(() => {
      return done(null, user);
    });
  });
}
async function useOpenId(passport: PassportStatic, app: any) {
  Issuer.discover(
    'http://127.0.0.1:8081/auth/realms/ecommerce/.well-known/openid-configuration'
  ).then((issuer) => {
    const client = new issuer.Client(keycloak);

    passport.use(
      'oidc',
      new Strategy(
        {
          client,
          params: {
            // this forces a fresh login screen every time
            prompt: 'login',
          },
        },
        async (tokenSet: any, userInfo: any, done: any) => {
          return done(null, userInfo);
        }
      )
    );
    app.get(
      '/api/login',
      passport.authenticate('oidc', { failureRedirect: '/api/login' }),
      (req: Request, res: Response) => res.redirect('/')
    );

    app.get(
      '/api/login-callback',
      passport.authenticate('oidc', {
        successRedirect: 'http://127.0.0.1:8082',
        failureRedirect: '/api/login',
      })
    );
  });
}

// function useJwt(passport: PassportStatic) {
//   const opts = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: 'secret',
//   };
//   passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//       // any!!!
//       User.findOne({ id: jwt_payload.sub }, function (err: any, user: any) {
//         if (err) {
//           return done(err, false);
//         }
//         if (user) {
//           return done(null, user);
//         } else {
//           return done(null, false);
//           // or you could create a new account  `
//         }
//       });
//     })
//   );
// }

export default function (passport: PassportStatic, app: any) {
  useLocal(passport);
  // useOpenId(passport, app);
  initSerializeDeserialize(passport);
  // useJwt(passport);
}
