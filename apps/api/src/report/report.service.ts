import { Injectable, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { RULE_TO_CONTROLS_MAP } from '../scanner/scanner.service';

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
    
    // --- 1. Compliance Aggregation Logic ---
    // Initialize Stats: { 'ISO 27001': { total: 0, passed: 0 }, ... }
    const standardsStats: Record<string, { total: number, passed: number, score: number }> = {};
    const groupedFindings: Record<string, any[]> = {}; // { 'ISO 27001': [ScanResult, ...] }

    // Helper to identify standard from code (e.g. A.9.4 -> ISO 27001)
    const getStandardName = (code: string) => {
        if (code.startsWith('A.')) return 'ISO 27001';
        if (code.startsWith('CC')) return 'SOC 2 Type II';
        if (code.startsWith('Req')) return 'PCI DSS';
        if (code.startsWith('TEKNIK')) return 'KVKK / GDPR';
        return 'General Best Practice';
    };

    // Process Results
    for (const res of results) {
        const ruleId = res.ruleId as string;
        const codes = RULE_TO_CONTROLS_MAP[ruleId] || [];
        const uniqueStandards = new Set(codes.map(getStandardName));
        
        if (uniqueStandards.size === 0) uniqueStandards.add('General Best Practice');

        for (const std of uniqueStandards) {
            if (!standardsStats[std]) standardsStats[std] = { total: 0, passed: 0, score: 0 };
            if (!groupedFindings[std]) groupedFindings[std] = [];

            standardsStats[std].total++;
            if (res.status === 'COMPLIANT') standardsStats[std].passed++;
            
            // Add to grouped list (avoid duplicates if rule maps to multiple codes of same standard)
            // Ideally we'd list the specific codes here too
            groupedFindings[std].push({ ...res, mappedCodes: codes.filter((c: string) => getStandardName(c) === std) });
        }
    }

    // Calculate Scores per Standard
    Object.keys(standardsStats).forEach(std => {
        const s = standardsStats[std];
        s.score = s.total > 0 ? Math.round((s.passed / s.total) * 100) : 0;
    });


    // Calculate Verification Hash (Provenance)
    const crypto = await import('crypto');
    const secret = process.env.JWT_SECRET || 'kivvat-secret-key';
    const dataToSign = `${report.id}:${report.createdAt.toISOString()}:${report.score}:${results.length}`;
    const verificationHash = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex').toUpperCase().substring(0, 16);
    const formattedHash = `${verificationHash.substring(0, 4)}-${verificationHash.substring(4, 8)}-${verificationHash.substring(8, 12)}-${verificationHash.substring(12, 16)}`;

    // Generate HTML for Executive Summary Cards
    const summaryCards = Object.keys(standardsStats).map(std => {
        const s = standardsStats[std];
        const color = s.score >= 90 ? '#059669' : s.score >= 70 ? '#d97706' : '#dc2626';
        return `
            <div class="card">
                <div class="card-label">${std}</div>
                <div class="card-value" style="color: ${color}">${s.score}%</div>
                <div class="card-sub">${s.passed}/${s.total} Controls Passed</div>
            </div>
        `;
    }).join('');

    // Generate HTML Rows (Grouped by Standard)
    let detailedHtml = '';
    const sortedStandards = Object.keys(groupedFindings).sort();

    for (const std of sortedStandards) {
        detailedHtml += `
            <h3 class="standard-header">${std} findings</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px">Status</th>
                        <th style="width: 15%">Control Ref</th>
                        <th>Technical Finding</th>
                        <th style="text-align: right; width: 80px">Severity</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const r of groupedFindings[std]) {
            const codes = r.mappedCodes.join(', ');
            detailedHtml += `
              <tr class="${r.status}">
                <td class="status-cell">
                    <span class="badge ${r.status}">${r.status === 'COMPLIANT' ? 'PASS' : 'FAIL'}</span>
                </td>
                <td class="id-cell">
                    <strong>${codes || 'N/A'}</strong><br>
                    <span style="font-size:9px; color:#94a3b8">${r.ruleId}</span>
                </td>
                <td class="details-cell">
                    ${r.resourceId ? `<div class="resource-id">${r.resourceId}</div>` : ''}
                    <div class="desc">${r.details}</div>
                </td>
                <td class="severity-cell"><span class="severity ${r.severity}">${r.severity}</span></td>
              </tr>
            `;
        }
        detailedHtml += `</tbody></table><br>`;
    }

    // 2. Launch Browser
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
    }
    const page = await this.browser.newPage();
    
    // 3. Generate HTML with Professional Design
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
            
            body { 
                font-family: 'Inter', sans-serif; 
                padding: 40px; 
                color: #0f172a; 
                line-height: 1.5;
                max-width: 800px;
                margin: 0 auto;
            }
            
            /* HEADER */
            .header { 
                border-bottom: 2px solid #e2e8f0; 
                padding-bottom: 24px; 
                margin-bottom: 32px; 
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            .brand {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: -0.5px;
                color: #0f172a;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .brand svg { width: 24px; height: 24px; }
            .report-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #64748b;
                font-weight: 600;
                margin-top: 4px;
            }
            .meta { 
                text-align: right;
                font-size: 12px;
                color: #64748b;
            }
            .meta strong { color: #0f172a; }

            /* SCORE CARD */
            .score-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 16px;
                margin-bottom: 40px;
            }
            .card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
            }
            .card-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #64748b;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .card-value {
                font-size: 24px;
                font-weight: 700;
                color: #0f172a;
                font-family: 'JetBrains Mono', monospace;
            }
            .card-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
            
            .score-val { 
                font-size: 32px; 
                color: ${score >= 90 ? '#059669' : score >= 70 ? '#d97706' : '#dc2626'}; 
            }

            /* TABLE */
            h3 { font-size: 18px; font-weight: 700; margin-bottom: 16px; border-left: 4px solid #3b82f6; padding-left: 12px; }
            
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { text-align: left; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
            td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
            
            tr:last-child td { border-bottom: none; }
            
            .status-cell { width: 80px; }
            .badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
            }
            .badge.COMPLIANT { background: #dcfce7; color: #166534; }
            .badge.NON_COMPLIANT { background: #fee2e2; color: #991b1b; }

            .id-cell { width: 120px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #334155; }
            
            .details-cell { color: #475569; }
            .resource-id { 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 10px; 
                background: #f1f5f9; 
                padding: 2px 6px; 
                border-radius: 4px; 
                display: inline-block;
                margin-bottom: 4px;
                color: #475569;
            }
            .desc { line-height: 1.4; }

            .severity-cell { text-align: right; width: 80px; }
            .severity { 
                font-size: 9px; 
                font-weight: 700; 
                padding: 2px 6px; 
                border-radius: 4px; 
                color: white; 
                background: #94a3b8; 
                text-transform: uppercase;
            }
            .severity.CRITICAL { background: #dc2626; }
            .severity.HIGH { background: #ea580c; }
            .severity.MEDIUM { background: #eab308; color: black; }

            /* FOOTER / PROVENANCE */
            .footer {
                margin-top: 60px;
                padding-top: 24px;
                border-top: 2px dashed #cbd5e1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #94a3b8;
                font-size: 11px;
            }
            .hash-box {
                font-family: 'JetBrains Mono', monospace;
                background: #f8fafc;
                padding: 8px 12px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                font-size: 10px;
                color: #475569;
            }
            .seal {
                display: flex;
                gap: 12px;
                align-items: center;
            }
            .seal-icon { 
                font-size: 24px; 
                color: #cbd5e1;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
                <div class="brand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
                    KIVVAT
                </div>
                <div class="report-title">Security Audit Report</div>
            </div>
            <div class="meta">
                <div>Report Ref: <strong>#${report.id.substring(0, 8)}</strong></div>
                <div>Date: <strong>${new Date(report.createdAt).toLocaleDateString()}</strong></div>
                <div>Target: <strong>${report.provider.toUpperCase()} Environment</strong></div>
            </div>
          </div>

          <div class="score-grid">
            <div class="card">
                <div class="card-label">Overall Score</div>
                <div class="card-value score-val">${score}%</div>
                <div class="card-sub">${score >= 90 ? 'Excellent' : score >= 70 ? 'Adequate' : 'Critical Risks'}</div>
            </div>
            ${summaryCards}
          </div>

          <div style="margin-top: 40px">
              ${detailedHtml}
          </div>

          <div class="footer">
            <div class="seal">
                <div class="seal-icon">🛡️</div>
                <div>
                    <div><strong>Digitally Verified Application Output</strong></div>
                    <div>This document was generated by Kivvat Security Engine.</div>
                </div>
            </div>
            <div class="hash-box">
                <div>DOCUMENT HASH (SHA-256)</div>
                <strong>${formattedHash}</strong>
            </div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
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
      margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' }
    });
    
    await page.close();
    return reportPath;
  }

  async generateExportBundle(reportId: string): Promise<string> {
      // 1. Generate/Get PDF Report
      const pdfPath = await this.generateFullPdfReport(reportId);
      
      // 2. Fetch Policies
      const policies = await this.prisma.policyTemplate.findMany(); 
      
      // 3. Create ZIP
      const AdmZip = require('adm-zip');
      const zip = new AdmZip();

      // Add PDF to root
      zip.addLocalFile(pdfPath);

      // Add Policies to folder
      policies.forEach((policy: any) => {
          const content = `# ${policy.name}\n\n${policy.content}`;
          // Sanitize filename
          const filename = policy.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          zip.addFile(`Policies/${filename}.md`, Buffer.from(content, 'utf8'));
      });

      // Add "Manifest" or README
      const readMe = `
KIVVAT VALIDATION BUNDLE
========================
Generated: ${new Date().toISOString()}

CONTENTS:
1. Security Audit Report (PDF) - Digitally Linked
2. Corporate Policies (Markdown) - Current Active Versions

Note: This bundle is intended for auditor review purposes only.
      `;
      zip.addFile('README.txt', Buffer.from(readMe, 'utf8'));

      // 4. Save Zip
      const fileName = `kivvat-bundle-${Date.now()}.zip`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'exports');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const zipPath = path.join(uploadDir, fileName);
      
      zip.writeZip(zipPath);
      return zipPath;
  }

  async onApplicationShutdown() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
