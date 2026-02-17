import ExcelJS from 'exceljs';
import { SubjectService } from '../subjects/service';
import { ExportOptions } from './types';

export class ExportService {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService();
  }

  async exportToExcel(options: ExportOptions): Promise<ExcelJS.Workbook> {
    const subject = await this.subjectService.getSubjectById(options.subjectId);
    
    if (!subject) {
      throw new Error('Subject not found');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(subject.name);

    // Set column headers
    worksheet.columns = [
      { header: 'Week', key: 'week', width: 10 },
      { header: 'Content', key: 'content', width: 50 },
      { header: 'Resources', key: 'resources', width: 100 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add subject info
    worksheet.insertRow(1, ['Subject', subject.name]);
    worksheet.insertRow(2, ['Semester', subject.semester]);
    worksheet.insertRow(3, ['Start Week', subject.startWeek]);
    worksheet.insertRow(4, ['End Week', subject.endWeek]);
    worksheet.insertRow(5, []); // Empty row

    // Add weeks data
    if (subject.weeks) {
      subject.weeks.forEach((week) => {
        const resourcesText = week.resources
          ?.map((r) => `${r.title || r.url}${r.description ? ` - ${r.description}` : ''} (${r.url})`)
          .join('; ') || '';

        worksheet.addRow({
          week: week.weekNumber,
          content: week.content,
          resources: resourcesText,
        });
      });
    }

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      if (column.width) {
        column.width = Math.max(column.width || 0, 10);
      }
    });

    return workbook;
  }

  async exportToBuffer(options: ExportOptions): Promise<Buffer> {
    const workbook = await this.exportToExcel(options);
    return (await workbook.xlsx.writeBuffer()) as Buffer;
  }
}
