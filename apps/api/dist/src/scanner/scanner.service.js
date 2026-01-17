"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerService = exports.RULE_TO_CONTROLS_MAP = void 0;
const common_1 = require("@nestjs/common");
const aws_scanner_1 = require("./aws.scanner");
const azure_scanner_1 = require("./azure.scanner");
const gcp_scanner_1 = require("./gcp.scanner");
const prisma_service_1 = require("../prisma/prisma.service");
const task_service_1 = require("../task/task.service");
exports.RULE_TO_CONTROLS_MAP = {
    'AWS-IAM-ROOT-MFA': ['A.9.4.2', 'CC6.1', 'TEKNIK.4', 'Req 8'],
    'AWS-IAM-MFA': ['A.9.4.2', 'CC6.1', 'TEKNIK.4', 'Req 8'],
    'AWS-IAM-ROOT-KEYS': ['A.9.2.3', 'CC6.1', 'TEKNIK.3'],
    'AWS-S3-ENCRYPTION': ['A.10.1.1', 'CC6.7', 'TEKNIK.11', 'Req 3'],
    'AWS-S3-PUBLIC-BLOCK': ['A.13.1.1', 'CC6.6', 'TEKNIK.5', 'Req 1'],
    'AWS-EC2-OPEN-SSH': ['A.13.1.1', 'CC6.6', 'TEKNIK.5', 'Req 1'],
    'AWS-EC2-OPEN-RDP': ['A.13.1.1', 'CC6.6', 'TEKNIK.5', 'Req 1'],
    'AWS-RDS-ENCRYPTION': ['A.10.1.1', 'CC6.1', 'TEKNIK.11', 'Req 3'],
    'AWS-CLOUDTRAIL': ['A.12.4.1', 'CC7.2', 'TEKNIK.2', 'Req 10'],
    'AZURE-STORAGE-SECURE-TRANSFER': ['A.10.1.1', 'CC6.7', 'TEKNIK.11'],
    'AZURE-STORAGE-NO-PUBLIC': ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
    'AZURE-SQL-AUDITING': ['A.12.4.1', 'CC7.2', 'TEKNIK.2'],
    'AZURE-SQL-TDE': ['A.10.1.1', 'CC6.1', 'TEKNIK.11'],
    'AZURE-SQL-FIREWALL': ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
    'AZURE-VM-NSG-SSH': ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
    'AZURE-VM-DISK-ENCRYPTION': ['A.10.1.1', 'CC6.1', 'TEKNIK.11'],
    'GCP-STORAGE-PUBLIC-BLOCK': ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
    'GCP-COMPUTE-NO-PUBLIC-IP': ['A.13.1.1', 'CC6.6', 'TEKNIK.5'],
    'GCP-COMPUTE-SHIELDED': ['A.12.1.2', 'CC6.8', 'TEKNIK.6'],
    'GCP-SQL-SSL': ['A.10.1.1', 'CC6.7', 'TEKNIK.11'],
    'GCP-IAM-NO-SERVICE-ACCOUNT-KEYS': ['A.9.2.3', 'CC6.1', 'TEKNIK.3'],
    'ENDPOINT-DISK-ENCRYPTION': ['A.10.1.1', 'CC6.1', 'TEKNIK.11'],
    'ENDPOINT-ANTIVIRUS': ['A.12.2.1', 'CC6.8', 'TEKNIK.6'],
};
let ScannerService = class ScannerService {
    awsScanner;
    azureScanner;
    gcpScanner;
    prisma;
    taskService;
    constructor(awsScanner, azureScanner, gcpScanner, prisma, taskService) {
        this.awsScanner = awsScanner;
        this.azureScanner = azureScanner;
        this.gcpScanner = gcpScanner;
        this.prisma = prisma;
        this.taskService = taskService;
    }
    async getReports(userId) {
        return this.prisma.scanReport.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }
    getControlCode(ruleId) {
        return exports.RULE_TO_CONTROLS_MAP[ruleId] || [];
    }
    async runScan(provider, credentials, userId) {
        try {
            console.log(`Starting scan for user ${userId} with provider ${provider}`);
            let results = [];
            if (provider.toLowerCase() === 'aws') {
                results = await this.awsScanner.scan(credentials);
            }
            else if (provider.toLowerCase() === 'azure') {
                results = await this.azureScanner.scan(credentials);
            }
            else if (provider.toLowerCase() === 'gcp') {
                results = await this.gcpScanner.scan(credentials);
            }
            console.log('Verifying Physical Assets...');
            const manualResults = await this.verifyManualAssets(userId);
            console.log(`Found ${manualResults.length} manual asset issues/checks.`);
            results = [...results, ...manualResults];
            await this.processResults(results);
            const passCount = results.filter(r => r.status === 'COMPLIANT').length;
            const total = results.length;
            const score = total > 0 ? Math.round((passCount / total) * 100) : 0;
            await this.prisma.scanReport.create({
                data: {
                    provider,
                    score,
                    status: 'COMPLETED',
                    results: results,
                    userId,
                }
            });
            return results;
        }
        catch (e) {
            console.error('CRITICAL SCAN ERROR:', e);
            throw e;
        }
    }
    async verifyManualAssets(userId) {
        const results = [];
        let assets = await this.prisma.asset.findMany({
            where: {
                userId,
                provider: { in: ['ENDPOINT', 'ON_PREM'] }
            }
        });
        if (assets.length === 0) {
            console.log('User has no manual assets. Skipping manual verification.');
            return [];
        }
        for (const asset of assets) {
            const details = asset.details || {};
            if (details.bitlocker === true) {
                results.push({
                    ruleId: 'ENDPOINT-DISK-ENCRYPTION',
                    status: 'COMPLIANT',
                    resourceId: asset.name,
                    details: `Disk encryption (BitLocker/FileVault) is ENABLED on ${asset.name}.`,
                    severity: 'HIGH'
                });
            }
            else {
                results.push({
                    ruleId: 'ENDPOINT-DISK-ENCRYPTION',
                    status: 'NON_COMPLIANT',
                    resourceId: asset.name,
                    details: `Disk encryption is DISABLED on ${asset.name}. Device is at risk of physical data theft.`,
                    severity: 'HIGH'
                });
            }
            if (details.antivirus === true) {
                results.push({
                    ruleId: 'ENDPOINT-ANTIVIRUS',
                    status: 'COMPLIANT',
                    resourceId: asset.name,
                    details: `Antivirus/EDR solution is ENABLED on ${asset.name}.`,
                    severity: 'MEDIUM'
                });
            }
            else {
                results.push({
                    ruleId: 'ENDPOINT-ANTIVIRUS',
                    status: 'NON_COMPLIANT',
                    resourceId: asset.name,
                    details: `Antivirus protection is MISSING on ${asset.name}.`,
                    severity: 'MEDIUM'
                });
            }
        }
        return results;
    }
    async processResults(results) {
        for (const res of results) {
            const mappedCodes = this.getControlCode(res.ruleId);
            if (mappedCodes.length === 0) {
                continue;
            }
            for (const code of mappedCodes) {
                const control = await this.prisma.control.findFirst({
                    where: { code: code },
                    include: { standard: true }
                });
                if (!control) {
                    console.warn(`Control code ${code} not found in DB.`);
                    continue;
                }
                const evidence = await this.prisma.evidence.create({
                    data: {
                        source: 'Cloud-Guardian',
                        checkName: `${res.ruleId} (${res.resourceId})`,
                        resourceId: res.resourceId,
                        result: res,
                        gaps: {
                            create: {
                                status: res.status === 'COMPLIANT' ? 'COMPLIANT' : 'NON_COMPLIANT',
                                details: res.details,
                                control: {
                                    connect: { id: control.id }
                                }
                            }
                        }
                    },
                    include: { gaps: true }
                });
                if (res.status === 'NON_COMPLIANT' && evidence.gaps && evidence.gaps.length > 0) {
                    const gap = evidence.gaps[0];
                    const severityPrefix = res.severity ? `[${res.severity}] ` : '';
                    const existingTask = await this.prisma.task.findFirst({
                        where: { gapAnalysisId: gap.id, status: { not: 'CLOSED' } }
                    });
                    if (!existingTask) {
                        await this.prisma.task.create({
                            data: {
                                title: `${severityPrefix}Düzelt: ${res.ruleId}`,
                                description: `Gereken İyileştirme: ${control.code} (${control.standard?.name || 'Standart'}) uyumluluğu için aksiyon alınmalı.\n\nTespit: ${res.details}`,
                                gapAnalysisId: gap.id,
                                status: 'OPEN',
                            },
                        });
                    }
                }
            }
        }
    }
    async syncAssets(userId, credentials) {
        const assets = await this.awsScanner.discoverAssets(credentials);
        await this.prisma.asset.deleteMany({ where: { userId } });
        for (const asset of assets) {
            const cleanAsset = {
                provider: asset.provider,
                type: asset.type,
                name: asset.name,
                region: asset.region || 'global',
                status: asset.status || 'UNKNOWN',
                details: asset.details || {},
                userId,
            };
            await this.prisma.asset.create({
                data: cleanAsset,
            });
        }
        return { count: assets.length };
    }
    async getAssets(userId) {
        return this.prisma.asset.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.ScannerService = ScannerService;
exports.ScannerService = ScannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_scanner_1.AwsScanner,
        azure_scanner_1.AzureScanner,
        gcp_scanner_1.GcpScanner,
        prisma_service_1.PrismaService,
        task_service_1.TaskService])
], ScannerService);
//# sourceMappingURL=scanner.service.js.map