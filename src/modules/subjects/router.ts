import { Router } from 'express';
import { SubjectController } from './controller';

const router = Router();
const controller = new SubjectController();

router.post('/', controller.createSubject);
router.get('/', controller.getAllSubjects);
router.get('/:id', controller.getSubjectById);
router.put('/:id', controller.updateSubject);
router.delete('/:id', controller.deleteSubject);

export default router;
