import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenance.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', maintenanceController.createMaintenanceRequest);
router.get('/unit/:unit_id', maintenanceController.listMaintenanceByUnit);
router.get('/building/:building_id', maintenanceController.listMaintenanceByBuilding);
router.get('/building/:building_id/stats', maintenanceController.getMaintenanceStats);
router.get('/:id', maintenanceController.getMaintenanceRequest);
router.put('/:id', maintenanceController.updateMaintenanceRequest);
router.delete('/:id', maintenanceController.deleteMaintenanceRequest);

export default router;
