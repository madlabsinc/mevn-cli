import express from 'express';
import { createData,
        readData,
        updateData,
        deleteData }
        from '../controllers/user_controller';

const router = express.Router();

router.post('/enter_api' + answers.api, createData);
router.get('/enter_api' + answers.api, readData);
router.update('/enter_api' + answers.api + '/:id', updateData);
router.delete('/enter_api' + answers.api + '/:id', deleteData);

module.exports = router;