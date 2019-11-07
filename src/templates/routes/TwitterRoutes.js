import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import UserAuth from '../models/user_schema';
import TwitterKeys from '../../config/Twitter'
passport.use(
  new TwitterStrategy(
    TwitterKeys,
    (token, tokenSecret, profile, done) => {
      UserAuth.findOrCreate({ twitterId: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        done(null, user);
      });
    },
  ),
);

let TwitterRoutes = {
  authenticate: () => {
    return passport.authenticate('twitter');
  },

  callback: () => {
    return passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/auth/failed',
    });
  },
};

export default TwitterRoutes;
