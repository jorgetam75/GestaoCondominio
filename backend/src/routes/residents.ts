import { Router } from 'express';
import * as residentsController from '../controllers/residents.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', residentsController.createResident);
router.get('/unit/:unit_id', residentsController.listResidentsByUnit);
router.get('/building/:building_id', residentsController.listResidentsByBuilding);
router.get('/:id', residentsController.getResident);
router.put('/:id', residentsController.updateResident);
router.delete('/:id', residentsController.deleteResident);

export default router;
