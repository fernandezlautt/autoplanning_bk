import { Router } from 'express';
import { WeekController } from './controller';

const router = Router();
const controller = new WeekController();

router.get('/:id', controller.getWeekById);
router.put('/:id', controller.updateWeek);
router.post('/:weekId/resources', controller.createResource);
router.put('/resources/:id', controller.updateResource);
router.delete('/resources/:id', controller.deleteResource);

export default router;
