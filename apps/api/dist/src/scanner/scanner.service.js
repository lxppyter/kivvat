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
exports.ScannerService = void 0;
const common_1 = require("@nestjs/common");
const aws_scanner_1 = require("./aws.scanner");
const prisma_service_1 = require("../prisma/prisma.service");
const task_service_1 = require("../task/task.service");
let ScannerService = class ScannerService {
    awsScanner;
    prisma;
    taskService;
    constructor(awsScanner, prisma, taskService) {
        this.awsScanner = awsScanner;
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
        const RULE_TO_CONTROL_MAP = {
            'AWS-IAM-ROOT-MFA': 'A.9.1.1',
            'AWS-IAM-ROOT-KEYS': 'A.9.4.1',
            'AWS-IAM-GHOST-USER': 'A.9.2.1',
            'AWS-S3-ENCRYPTION': 'A.10.1.1',
            'AWS-S3-PUBLIC-BLOCK': 'A.13.1.1',
            'AWS-EC2-OPEN-SSH': 'A.13.1.1',
            'AWS-EC2-OPEN-RDP': 'A.13.1.1',
            'ENDPOINT-DISK-ENCRYPTION': 'A.10.1.1',
            'ENDPOINT-ANTIVIRUS': 'A.12.2.1',
        };
        return RULE_TO_CONTROL_MAP[ruleId] || null;
    }
    async runScan(provider, credentials, userId) {
        try {
            console.log(`Starting scan for user ${userId} with provider ${provider}`);
            let results = [];
            if (provider.toLowerCase() === 'aws') {
                results = await this.awsScanner.scan(credentials);
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
            console.log('User has no assets. Seeding demo data...');
            await this.prisma.asset.createMany({
                data: [
                    {
                        userId,
                        name: 'Demo-Laptop-Finans',
                        type: 'WORKSTATION',
                        provider: 'ENDPOINT',
                        status: 'ACTIVE',
                        details: { bitlocker: true, antivirus: false, serialNumber: 'DEMO-111' }
                    },
                    {
                        userId,
                        name: 'Demo-Server-DB',
                        type: 'SERVER',
                        provider: 'ON_PREM',
                        status: 'ACTIVE',
                        details: { bitlocker: false, antivirus: true, ip: '192.168.1.50' }
                    },
                    {
                        userId,
                        name: 'Demo-CEO-Macbook',
                        type: 'WORKSTATION',
                        provider: 'ENDPOINT',
                        status: 'ACTIVE',
                        details: { bitlocker: true, antivirus: true, serialNumber: 'DEMO-999' }
                    }
                ]
            });
            assets = await this.prisma.asset.findMany({
                where: { userId, provider: { in: ['ENDPOINT', 'ON_PREM'] } }
            });
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
        const defaultControl = await this.prisma.control.findFirst();
        for (const res of results) {
            let targetControlId = defaultControl?.id;
            const mappedCode = this.getControlCode(res.ruleId);
            if (mappedCode) {
                const output = await this.prisma.control.findFirst({
                    where: { code: mappedCode }
                });
                if (output)
                    targetControlId = output.id;
            }
            if (!targetControlId) {
                console.warn('No controls found in DB. Cannot link evidence.');
                continue;
            }
            const evidence = await this.prisma.evidence.create({
                data: {
                    source: 'Cloud-Guardian',
                    checkName: res.ruleId,
                    resourceId: res.resourceId,
                    result: res,
                    gaps: {
                        create: {
                            status: res.status === 'COMPLIANT' ? 'COMPLIANT' : 'NON_COMPLIANT',
                            details: res.details,
                            control: {
                                connect: { id: targetControlId }
                            }
                        }
                    }
                },
                include: { gaps: true }
            });
            if (res.status === 'NON_COMPLIANT' && evidence.gaps && evidence.gaps.length > 0) {
                const gap = evidence.gaps[0];
                const severityPrefix = res.severity ? `[${res.severity}] ` : '';
                await this.prisma.task.create({
                    data: {
                        title: `${severityPrefix}Fix ${res.ruleId}`,
                        description: `Automated remediation task for control ${mappedCode || 'Unknown'}. Detail: ${res.details}. Resource: ${res.resourceId || 'N/A'}`,
                        gapAnalysisId: gap.id,
                        status: 'OPEN',
                    },
                });
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
        prisma_service_1.PrismaService,
        task_service_1.TaskService])
], ScannerService);
//# sourceMappingURL=scanner.service.js.map