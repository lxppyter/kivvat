import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import type { Response } from 'express';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':id/pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const filePath = await this.reportService.generateFullPdfReport(id);
      res.download(filePath, `kivvat-report-${id}.pdf`);
    } catch (e) {
      console.error('PDF Generation Failed', e);
      res.status(500).send('Report generation failed');
    }
  }
}
