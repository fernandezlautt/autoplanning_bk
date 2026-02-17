import { Request, Response } from 'express';
import { ExportService } from './service';

export class ExportController {
  private exportService: ExportService;

  constructor() {
    this.exportService = new ExportService();
  }

  exportSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      const subjectId = parseInt(req.params.subjectId);
      if (isNaN(subjectId)) {
        res.status(400).json({ error: 'Invalid subject ID' });
        return;
      }

      const buffer = await this.exportService.exportToBuffer({ subjectId });
      
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="subject-${subjectId}-planning.xlsx"`
      );
      
      res.send(buffer);
    } catch (error) {
      console.error('Error exporting subject:', error);
      if (error instanceof Error && error.message === 'Subject not found') {
        res.status(404).json({ error: 'Subject not found' });
      } else {
        res.status(500).json({ error: 'Failed to export subject' });
      }
    }
  };
}
