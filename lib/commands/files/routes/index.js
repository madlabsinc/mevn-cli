import express from 'express';
import { createData,
        readData,
        updateData,
        deleteData }
        from '../controllers/user_controller';

const router = express.Router();

router.post('/' + answers.api, createData);
router.get('/' + answers.api, readData);
router.update('/' + answers.api + '/:id', updateData);
router.delete('/' + answers.api + '/:id', deleteData);

module.exports = router;