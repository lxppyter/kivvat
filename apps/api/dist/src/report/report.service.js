"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
const hbs = __importStar(require("handlebars"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const prisma_service_1 = require("../prisma/prisma.service");
let ReportService = class ReportService {
    prisma;
    browser;
    template;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const templatePath = path.join(process.cwd(), 'src', 'report', 'templates', 'evidence-card.hbs');
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        this.template = hbs.compile(templateSource);
        const uploadDir = path.join(process.cwd(), 'uploads', 'evidence');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    }
    async generateEvidenceScreenshot(evidence) {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        const page = await this.browser.newPage();
        const html = this.template({
            id: evidence.id,
            ruleId: evidence.checkName,
            resourceId: evidence.resourceId || 'N/A',
            status: evidence.result?.status || 'UNKNOWN',
            details: evidence.result?.details || JSON.stringify(evidence.result),
            timestamp: new Date().toISOString()
        });
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.setViewport({ width: 650, height: 400, deviceScaleFactor: 2 });
        const element = await page.$('.card');
        if (!element)
            throw new Error('Card element not found in template');
        const fileName = `${evidence.id}-${Date.now()}.png`;
        const filePath = path.join(process.cwd(), 'uploads', 'evidence', fileName);
        await element.screenshot({ path: filePath });
        await page.close();
        return `/uploads/evidence/${fileName}`;
    }
    async generateFullPdfReport(reportId) {
        let report;
        if (reportId === 'latest') {
            report = await this.prisma.scanReport.findFirst({
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            });
        }
        else {
            report = await this.prisma.scanReport.findUnique({
                where: { id: reportId },
                include: { user: true }
            });
        }
        if (!report) {
            throw new Error('Report not found');
        }
        const results = report.results;
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
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        const page = await this.browser.newPage();
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
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map