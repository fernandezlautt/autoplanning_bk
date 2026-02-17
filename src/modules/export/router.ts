import { Router } from 'express';
import { ExportController } from './controller';

const router = Router();
const controller = new ExportController();

router.get('/subjects/:subjectId', controller.exportSubject);

export default router;
