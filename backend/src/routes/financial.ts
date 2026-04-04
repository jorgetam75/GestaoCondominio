import { Router } from 'express';
import * as financialController from '../controllers/financial.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', financialController.createFinancialRecord);
router.get('/unit/:unit_id', financialController.listFinancialByUnit);
router.get('/building/:building_id', financialController.listFinancialByBuilding);
router.get('/building/:building_id/report', financialController.getBuildingFinancialReport);
router.get('/:id', financialController.getFinancialRecord);
router.put('/:id', financialController.updateFinancialRecord);
router.delete('/:id', financialController.deleteFinancialRecord);

export default router;
