import { Router } from 'express';
import * as unitsController from '../controllers/units.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', unitsController.createUnit);
router.get('/building/:building_id', unitsController.listUnitsByBuilding);
router.get('/:id', unitsController.getUnit);
router.put('/:id', unitsController.updateUnit);
router.delete('/:id', unitsController.deleteUnit);

export default router;
