"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsScanner = void 0;
const common_1 = require("@nestjs/common");
const client_iam_1 = require("@aws-sdk/client-iam");
const client_s3_1 = require("@aws-sdk/client-s3");
const client_ec2_1 = require("@aws-sdk/client-ec2");
const client_rds_1 = require("@aws-sdk/client-rds");
const client_cloudtrail_1 = require("@aws-sdk/client-cloudtrail");
let AwsScanner = class AwsScanner {
    async scan(credentials) {
        const results = [];
        const config = {
            region: credentials.region || 'us-east-1',
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
            },
        };
        const iam = new client_iam_1.IAMClient(config);
        const s3 = new client_s3_1.S3Client(config);
        const ec2 = new client_ec2_1.EC2Client(config);
        const rds = new client_rds_1.RDSClient(config);
        const cloudtrail = new client_cloudtrail_1.CloudTrailClient(config);
        try {
            const summary = await iam.send(new client_iam_1.GetAccountSummaryCommand({}));
            const mfaEnabled = summary.SummaryMap?.['AccountMFAEnabled'];
            results.push({
                ruleId: 'AWS-IAM-ROOT-MFA',
                status: mfaEnabled === 1 ? 'COMPLIANT' : 'NON_COMPLIANT',
                details: mfaEnabled === 1 ? 'Root has Multi-Factor Authentication enabled.' : 'Root account is MISSING MFA protection.',
                resourceId: 'RootAccount',
                severity: 'CRITICAL',
            });
            const accessKeysPresent = summary.SummaryMap?.['AccountAccessKeysPresent'];
            results.push({
                ruleId: 'AWS-IAM-ROOT-KEYS',
                status: accessKeysPresent === 0 ? 'COMPLIANT' : 'NON_COMPLIANT',
                details: accessKeysPresent === 0 ? 'Root account has no active access keys.' : 'Root account SHOULD NOT have active access keys.',
                resourceId: 'RootAccount',
                severity: 'HIGH',
            });
        }
        catch (e) {
            console.error('IAM Root Scan Error:', e);
            results.push({
                ruleId: 'AWS-IAM-ROOT-CHECK',
                status: 'NON_COMPLIANT',
                details: `Root check failed: ${e.message}`,
                resourceId: 'RootAccount',
                severity: 'HIGH'
            });
        }
        try {
            const { Users } = await iam.send(new client_iam_1.ListUsersCommand({}));
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            if (Users) {
                for (const user of Users) {
                    if (user.PasswordLastUsed) {
                        const lastUsed = new Date(user.PasswordLastUsed);
                        if (lastUsed < ninetyDaysAgo) {
                            results.push({
                                ruleId: 'AWS-IAM-GHOST-USER',
                                status: 'NON_COMPLIANT',
                                resourceId: user.UserName || 'Unknown',
                                details: `User ${user.UserName} has not logged in since ${lastUsed.toISOString().split('T')[0]}.`,
                                severity: 'MEDIUM',
                            });
                        }
                    }
                    else {
                        const createDate = user.CreateDate ? new Date(user.CreateDate) : new Date();
                        if (createDate < ninetyDaysAgo) {
                            results.push({
                                ruleId: 'AWS-IAM-STALE-USER',
                                status: 'NON_COMPLIANT',
                                resourceId: user.UserName || 'Unknown',
                                details: `User ${user.UserName} created >90 days ago but never used password.`,
                                severity: 'MEDIUM',
                            });
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error('IAM User Scan Error:', e);
            results.push({
                ruleId: 'AWS-IAM-USER-CHECK',
                status: 'NON_COMPLIANT',
                details: `Failed to list users: ${e.message}`,
                resourceId: 'IAM-Global',
                severity: 'HIGH'
            });
        }
        try {
            const { Buckets } = await s3.send(new client_s3_1.ListBucketsCommand({}));
            if (Buckets) {
                for (const bucket of Buckets) {
                    const bucketName = bucket.Name;
                    if (!bucketName)
                        continue;
                    try {
                        await s3.send(new client_s3_1.GetBucketEncryptionCommand({ Bucket: bucketName }));
                        results.push({
                            ruleId: 'AWS-S3-ENCRYPTION',
                            status: 'COMPLIANT',
                            resourceId: bucketName,
                            details: `Bucket is encrypted.`,
                            severity: 'HIGH',
                        });
                    }
                    catch (e) {
                        results.push({
                            ruleId: 'AWS-S3-ENCRYPTION',
                            status: 'NON_COMPLIANT',
                            resourceId: bucketName,
                            details: `Bucket is NOT encrypted (Default Encryption missing).`,
                            severity: 'HIGH',
                        });
                    }
                    try {
                        const { PublicAccessBlockConfiguration } = await s3.send(new client_s3_1.GetPublicAccessBlockCommand({ Bucket: bucketName }));
                        const isBlocked = PublicAccessBlockConfiguration?.BlockPublicAcls &&
                            PublicAccessBlockConfiguration?.IgnorePublicAcls &&
                            PublicAccessBlockConfiguration?.BlockPublicPolicy &&
                            PublicAccessBlockConfiguration?.RestrictPublicBuckets;
                        results.push({
                            ruleId: 'AWS-S3-PUBLIC-BLOCK',
                            status: isBlocked ? 'COMPLIANT' : 'NON_COMPLIANT',
                            resourceId: bucketName,
                            details: isBlocked ? `Public Access Block enabled.` : `Public Access Block is NOT fully enabled.`,
                            severity: 'CRITICAL',
                        });
                    }
                    catch (e) {
                        results.push({
                            ruleId: 'AWS-S3-PUBLIC-BLOCK',
                            status: 'NON_COMPLIANT',
                            resourceId: bucketName,
                            details: `Public Access Block settings not found (Default allow).`,
                            severity: 'CRITICAL',
                        });
                    }
                }
            }
        }
        catch (e) {
            console.error('S3 Scan Error:', e);
            results.push({
                ruleId: 'AWS-S3-LIST',
                status: 'NON_COMPLIANT',
                details: `Failed to list buckets: ${e.message}`,
                resourceId: 'S3-Global',
                severity: 'HIGH'
            });
        }
        try {
            const { SecurityGroups } = await ec2.send(new client_ec2_1.DescribeSecurityGroupsCommand({}));
            if (SecurityGroups) {
                for (const sg of SecurityGroups) {
                    const sgName = sg.GroupName || 'Unknown';
                    const sgId = sg.GroupId || 'Unknown';
                    if (sg.IpPermissions) {
                        for (const perm of sg.IpPermissions) {
                            const isPublic = perm.IpRanges?.some(range => range.CidrIp === '0.0.0.0/0');
                            if (isPublic) {
                                const fromPort = perm.FromPort;
                                const toPort = perm.ToPort;
                                const protocol = perm.IpProtocol;
                                const isSsh = (fromPort === 22 || (fromPort !== undefined && toPort !== undefined && fromPort <= 22 && toPort >= 22)) || protocol === '-1';
                                if (isSsh) {
                                    results.push({
                                        ruleId: 'AWS-EC2-OPEN-SSH',
                                        status: 'NON_COMPLIANT',
                                        resourceId: sgName,
                                        details: `Security Group ${sgName} (${sgId}) allows SSH (22) from ANYWHERE (0.0.0.0/0). High Risk!`,
                                        severity: 'CRITICAL',
                                    });
                                }
                                const isRdp = (fromPort === 3389 || (fromPort !== undefined && toPort !== undefined && fromPort <= 3389 && toPort >= 3389)) || protocol === '-1';
                                if (isRdp) {
                                    results.push({
                                        ruleId: 'AWS-EC2-OPEN-RDP',
                                        status: 'NON_COMPLIANT',
                                        resourceId: sgName,
                                        details: `Security Group ${sgName} (${sgId}) allows RDP (3389) from ANYWHERE. High Risk!`,
                                        severity: 'CRITICAL',
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (e) {
            console.error('EC2 Scan Error:', e);
            results.push({
                ruleId: 'AWS-EC2-CHECK',
                status: 'NON_COMPLIANT',
                details: `Failed to scan security groups: ${e.message}`,
                resourceId: 'EC2-Global',
                severity: 'HIGH'
            });
        }
        try {
            const { DBInstances } = await rds.send(new client_rds_1.DescribeDBInstancesCommand({}));
            if (DBInstances) {
                for (const db of DBInstances) {
                    const dbId = db.DBInstanceIdentifier || 'Unknown';
                    const isEncrypted = db.StorageEncrypted === true;
                    if (isEncrypted) {
                        results.push({
                            ruleId: 'AWS-RDS-ENCRYPTION',
                            status: 'COMPLIANT',
                            resourceId: dbId,
                            details: `RDS Instance ${dbId} storage IS encrypted.`,
                            severity: 'HIGH',
                        });
                    }
                    else {
                        results.push({
                            ruleId: 'AWS-RDS-ENCRYPTION',
                            status: 'NON_COMPLIANT',
                            resourceId: dbId,
                            details: `RDS Instance ${dbId} storage is NOT encrypted. At rest data is vulnerable.`,
                            severity: 'HIGH',
                        });
                    }
                }
            }
        }
        catch (e) {
        }
        try {
            const { trailList } = await cloudtrail.send(new client_cloudtrail_1.DescribeTrailsCommand({}));
            let hasActiveTrail = false;
            if (trailList && trailList.length > 0) {
                for (const trail of trailList) {
                    if (trail.TrailARN) {
                        try {
                            const status = await cloudtrail.send(new client_cloudtrail_1.GetTrailStatusCommand({ Name: trail.TrailARN }));
                            if (status.IsLogging) {
                                hasActiveTrail = true;
                                break;
                            }
                        }
                        catch (err) { }
                    }
                }
            }
            if (hasActiveTrail) {
                results.push({
                    ruleId: 'AWS-CLOUDTRAIL',
                    status: 'COMPLIANT',
                    resourceId: 'CloudTrail-Global',
                    details: `CloudTrail is enabled and actively logging events.`,
                    severity: 'CRITICAL',
                });
            }
            else {
                results.push({
                    ruleId: 'AWS-CLOUDTRAIL',
                    status: 'NON_COMPLIANT',
                    resourceId: 'CloudTrail-Global',
                    details: `No active CloudTrail found! Forensics and audit logging is DISABLED.`,
                    severity: 'CRITICAL',
                });
            }
        }
        catch (e) {
        }
        return results;
    }
    async discoverAssets(credentials) {
        const assets = [];
        const config = {
            region: credentials.region || 'us-east-1',
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
            },
        };
        try {
            const ec2 = new client_ec2_1.EC2Client(config);
            const { Reservations } = await ec2.send(new client_ec2_1.DescribeInstancesCommand({}));
            Reservations?.forEach((res) => {
                res.Instances?.forEach((inst) => {
                    assets.push({
                        provider: 'AWS',
                        type: 'EC2_INSTANCE',
                        name: inst.InstanceId || 'Unknown-Instance',
                        region: config.region,
                        status: inst.State?.Name?.toUpperCase() || 'UNKNOWN',
                        details: {
                            instanceType: inst.InstanceType,
                            launchTime: inst.LaunchTime,
                            publicIp: inst.PublicIpAddress,
                        },
                    });
                });
            });
        }
        catch (e) {
            console.error('EC2 Discovery Failed', e);
        }
        try {
            const s3 = new client_s3_1.S3Client(config);
            const { Buckets } = await s3.send(new client_s3_1.ListBucketsCommand({}));
            Buckets?.forEach((bucket) => {
                assets.push({
                    provider: 'AWS',
                    type: 'S3_BUCKET',
                    name: bucket.Name || 'Unknown-Bucket',
                    region: config.region,
                    status: 'ACTIVE',
                    details: {
                        creationDate: bucket.CreationDate,
                    },
                });
            });
        }
        catch (e) {
            console.error('S3 Discovery Failed', e);
        }
        try {
            const iam = new client_iam_1.IAMClient(config);
            const { Users } = await iam.send(new client_iam_1.ListUsersCommand({}));
            Users?.forEach((user) => {
                assets.push({
                    provider: 'AWS',
                    type: 'IAM_USER',
                    name: user.UserName || 'Unknown-User',
                    region: 'global',
                    status: 'ACTIVE',
                    details: {
                        userId: user.UserId,
                        arn: user.Arn,
                        createdDate: user.CreateDate,
                    },
                });
            });
        }
        catch (e) {
            console.error('IAM Discovery Failed', e);
        }
        return assets;
    }
};
exports.AwsScanner = AwsScanner;
exports.AwsScanner = AwsScanner = __decorate([
    (0, common_1.Injectable)()
], AwsScanner);
//# sourceMappingURL=aws.scanner.js.map