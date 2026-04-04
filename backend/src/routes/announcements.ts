import { Router } from 'express';
import * as announcementsController from '../controllers/announcements.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', announcementsController.createAnnouncement);
router.get('/building/:building_id', announcementsController.listAnnouncementsByBuilding);
router.get('/:id', announcementsController.getAnnouncement);
router.put('/:id', announcementsController.updateAnnouncement);
router.delete('/:id', announcementsController.deleteAnnouncement);

export default router;
