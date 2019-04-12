import express from 'express';
import passport from 'passport';
import FacebookRoutes from './FacebookRoutes';
import TwitterRoutes from './TwitterRoutes';
import GoogleRoutes from './GoogleRoutes';

import {
  createData,
  readData,
  updateData,
  deleteData,
} from '../controllers/user_controller';

const router = express.Router();

router.configure(() => {
  router.use(passport.initialize());
});

router.post('/login', passport.authenticate('local'), createData);

router.get('/enter_api', readData);
router.put('/enter_api/:id', updateData);
router.delete('/enter_api/:id', deleteData);

// Facebook authentication
// For more info check out http://www.passportjs.org/docs/facebook/
router.get('/auth/facebook', FacebookRoutes.authenticate());
router.get('/auth/facebook/callback', FacebookRoutes.callback());

// Twitter authentication
// For more info check out http://www.passportjs.org/docs/twitter/
router.get('/auth/twitter', TwitterRoutes.authenticate());
router.get('/auth/twitter/callback', TwitterRoutes.callback());

// Google authentication
// For more info check out http://www.passportjs.org/docs/google/
router.get('auth/google', GoogleRoutes.authenticate());
router.get('auth/google/callback', GoogleRoutes.callback());

module.exports = router;
