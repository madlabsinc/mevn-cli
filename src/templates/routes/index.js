const express = require('express');

const {
  createData,
  readData,
  updateData,
  deleteData,
} = require('../controllers/user_controller');

const router = express.Router();

router.post('/', createData);
router.get('/', readData);
router.put('/', updateData);
router.delete('/', deleteData);

module.exports = router;
