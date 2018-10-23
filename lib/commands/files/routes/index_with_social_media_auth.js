import express from 'express';
import passport from 'passport';
import FacebookRoutes from './FacebookRoutes';
import TwitterRoutes from './TwitterRoutes';
import { Strategy as TwitterStrategy} from 'passport-twitter';

import { 
  createData,
  readData,
  updateData,
  deleteData 
}

from '../controllers/user_controller';

const router = express.Router();

router.configure(() => {
    router.use(passport.initialize());
});

router.post('/login', 
    passport.authenticate('local'),
    createData
);

router.get('/enter_api', readData);
router.put('/enter_api/:id', updateData);
router.delete('/enter_api/:id', deleteData);

// Facebook authentication
route.get('/auth/facebook', FacebookRoutes.authenticate());
route.get('/auth/facebook/callback', FacebookRoutes.callback());

// Twitter authentication
route.get('/auth/twitter', TwitterRoutes.authenticate());
route.get('/auth/twitter/callback', TwitterRoutes.callback());

module.exports = router;