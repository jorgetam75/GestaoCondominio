import { Router } from 'express';
import * as buildingsController from '../controllers/buildings.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', buildingsController.createBuilding);
router.get('/', buildingsController.listBuildings);
router.get('/:id', buildingsController.getBuilding);
router.put('/:id', buildingsController.updateBuilding);
router.delete('/:id', buildingsController.deleteBuilding);

export default router;
