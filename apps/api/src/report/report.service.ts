import { Injectable, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService implements OnModuleInit {
  private browser: puppeteer.Browser;
  private template: HandlebarsTemplateDelegate;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Compile template on init
    const templatePath = path.join(process.cwd(), 'src', 'report', 'templates', 'evidence-card.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    this.template = hbs.compile(templateSource);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'evidence');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  async generateEvidenceScreenshot(evidence: any): Promise<string> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Safer for containers
      });
    }

    const page = await this.browser.newPage();
    
    // Prepare data for template
    const html = this.template({
      id: evidence.id,
      ruleId: evidence.checkName, // Mapping checkName to ruleId for template
      resourceId: evidence.resourceId || 'N/A',
      status: evidence.result?.status || 'UNKNOWN', // Assuming result has status
      details: evidence.result?.details || JSON.stringify(evidence.result),
      timestamp: new Date().toISOString()
    });

    // Set content and wait for load
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Set viewport to match card size + padding
    await page.setViewport({ width: 650, height: 400, deviceScaleFactor: 2 });

    // Select the card element to screenshot only that
    const element = await page.$('.card');
    if (!element) throw new Error('Card element not found in template');

    const fileName = `${evidence.id}-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'uploads', 'evidence', fileName);

    await element.screenshot({ path: filePath });
    await page.close();

    // Return relative path for API access (assuming static serve setup later)
    return `/uploads/evidence/${fileName}`;
  }

  async generateFullPdfReport(reportId: string): Promise<string> {
    // 1. Fetch Real Data
    let report: any;
    
    if (reportId === 'latest') {
        report = await this.prisma.scanReport.findFirst({
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });
    } else {
        report = await this.prisma.scanReport.findUnique({
            where: { id: reportId },
            include: { user: true }
        });
    }

    if (!report) {
        throw new Error('Report not found');
    }

    const results = report.results as any[];
    const score = report.score;
    const rules = results.map(r => `
      <div class="rule ${r.status}">
        <div class="rule-header">
           <span class="status-icon">${r.status === 'COMPLIANT' ? '✅' : '❌'}</span>
           <strong>${r.ruleId}</strong>
           <span class="severity ${r.severity}">${r.severity}</span>
        </div>
        <div class="rule-details">
           ${r.resourceId ? `Resource: <code>${r.resourceId}</code><br>` : ''}
           ${r.details}
        </div>
      </div>
    `).join('');

    // 2. Launch Browser
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
    }
    const page = await this.browser.newPage();
    
    // 3. Generate HTML with Real Data
    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { margin: 0; color: #1a1f2c; font-size: 24px; }
            .meta { color: #666; font-size: 14px; margin-top: 5px; }
            .score-card { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e2e8f0; }
            .score-val { font-size: 36px; font-weight: bold; color: ${score >= 90 ? '#059669' : '#dc2626'}; }
            
            .rule { margin-bottom: 15px; border: 1px solid #eee; border-radius: 6px; page-break-inside: avoid; }
            .rule-header { padding: 10px 15px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; }
            .rule-details { padding: 10px 15px; font-size: 13px; color: #555; }
            
            .NON_COMPLIANT .rule-header { background: #fee2e2; border-bottom-color: #fecaca; }
            .COMPLIANT .rule-header { background: #d1fae5; border-bottom-color: #a7f3d0; }
            
            .severity { font-size: 10px; padding: 2px 6px; border-radius: 4px; color: white; background: #64748b; }
            .severity.CRITICAL { background: #dc2626; }
            .severity.HIGH { background: #ea580c; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 Kivvat Audit Report</h1>
            <div class="meta">
                Report ID: ${report.id} <br> 
                Date: ${new Date(report.createdAt).toLocaleString()} <br>
                Provider: ${report.provider.toUpperCase()}
            </div>
          </div>

          <div class="score-card">
            <div>
                <strong>Overall Compliance Score</strong>
                <div style="font-size: 12px; color: #666">Based on ${results.length} checks</div>
            </div>
            <div class="score-val">${score}%</div>
          </div>

          <h3>Detailed Findings</h3>
          ${rules}

          <div style="margin-top: 50px; font-size: 12px; color: #999; text-align: center;">
            Generated automatically by Kivvat Cloud-Guardian Engine
          </div>
        </body>
      </html>
    `;

    await page.setContent(html);
    
    // Ensure uploads/reports folder exists
    const reportPath = path.join(process.cwd(), 'uploads', 'reports', `report-${report.id}.pdf`);
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    await page.pdf({ 
      path: reportPath, 
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', bottom: '40px' }
    });
    
    await page.close();
    return reportPath;
  }

  async onApplicationShutdown() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
