import { Router } from 'express';
import * as complaintsController from '../controllers/complaints.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', complaintsController.createComplaint);
router.get('/unit/:unit_id', complaintsController.listComplaintsByUnit);
router.get('/building/:building_id', complaintsController.listComplaintsByBuilding);
router.get('/:id', complaintsController.getComplaint);
router.put('/:id', complaintsController.updateComplaint);
router.delete('/:id', complaintsController.deleteComplaint);

export default router;
