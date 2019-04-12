import express from 'express';

import {
  createData,
  readData,
  updateData,
  deleteData,
} from '../controllers/user_controller';

const router = express.Router();

router.post('/enter_api', createData);
router.get('/enter_api', readData);
router.put('/enter_api/:id', updateData);
router.delete('/enter_api/:id', deleteData);

module.exports = router;
