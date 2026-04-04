import { Router } from 'express';
import * as accessCodesController from '../controllers/access-codes.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Verify endpoint is public (only needs code)
router.post('/verify', optionalAuth, accessCodesController.verifyAccessCode);

// All other endpoints require authentication
router.use(authMiddleware);

router.post('/', accessCodesController.createAccessCode);
router.get('/unit/:unit_id', accessCodesController.listAccessCodesByUnit);
router.get('/building/:building_id', accessCodesController.listAccessCodesByBuilding);
router.get('/:id', accessCodesController.getAccessCode);
router.post('/:id/expire', accessCodesController.expireAccessCode);
router.delete('/:id', accessCodesController.deleteAccessCode);

export default router;
