import passport from 'passport';
import { Strategy as TwitterStrategy} from 'passport-twitter';

passport.use(new TwitterStrategy({
    consumerKey: 'TWITTER_CONSUMER_KEY',
    consumerSecret: 'TWITTER_CONSUMER_SECRET',
    callbackURL: "http://www.example.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

let TwitterRoutes = {
    authenticate: () => {
        return passport.authenticate('twitter');
    },

    callback: () => {
        return passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/auth/failed'
        });
    }
}

export default TwitterRoutes;