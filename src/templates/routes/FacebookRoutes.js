import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import UserAuth from '../models/user_schema';
import FacebookKeys from '../../config/Facebook'
passport.use(
  new FacebookStrategy(
    FacebookKeys,
    (accessToken, refreshToken, profile, done) => {
      UserAuth.findOrCreate({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        done(null, user);
      });
    },
  ),
);

let FacebookRoutes = {
  authenticate: () => {
    return passport.authenticate('facebook');
  },

  callback: () => {
    return passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/auth/failed',
    });
  },
};

export default FacebookRoutes;
