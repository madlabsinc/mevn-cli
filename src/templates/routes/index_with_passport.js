'use strict';

import express from 'express';
import passport from 'passport';

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

module.exports = router;
