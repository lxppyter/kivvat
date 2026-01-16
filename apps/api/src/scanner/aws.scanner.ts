import { Injectable } from '@nestjs/common';
import { CloudScanner, ScanResult } from './scanner.interface';
import { IAMClient, GetAccountSummaryCommand, ListUsersCommand } from '@aws-sdk/client-iam';
import { S3Client, ListBucketsCommand, GetBucketEncryptionCommand, GetPublicAccessBlockCommand } from '@aws-sdk/client-s3';
import { EC2Client, DescribeSecurityGroupsCommand, DescribeInstancesCommand } from '@aws-sdk/client-ec2';

@Injectable()
export class AwsScanner implements CloudScanner {
  async scan(credentials: any): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    
    // Ensure credentials have region
    const config = {
      region: credentials.region || 'us-east-1',
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    };

    const iam = new IAMClient(config);
    const s3 = new S3Client(config);
    const ec2 = new EC2Client(config);

    // 1. Identity Analyzer: Check Root MFA & Usage
    try {
      const summary = await iam.send(new GetAccountSummaryCommand({}));
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

    } catch (e: any) {
        console.error('IAM Root Scan Error:', e);
        results.push({ 
            ruleId: 'AWS-IAM-ROOT-CHECK', 
            status: 'NON_COMPLIANT', 
            details: `Root check failed: ${e.message}`,
            resourceId: 'RootAccount',
            severity: 'HIGH'
        });
    }

    // 2. Identity Analyzer: Passive User Detection (Ghost Accounts)
    try {
        const { Users } = await iam.send(new ListUsersCommand({}));
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
                } else {
                    // User has never logged in or has no password? 
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
    } catch (e: any) {
        console.error('IAM User Scan Error:', e);
        results.push({ 
            ruleId: 'AWS-IAM-USER-CHECK', 
            status: 'NON_COMPLIANT', 
            details: `Failed to list users: ${e.message}`,
            resourceId: 'IAM-Global',
            severity: 'HIGH'
        });
    }

    // 3. Storage Shield: Check S3 Buckets
    try {
      const { Buckets } = await s3.send(new ListBucketsCommand({}));
      if (Buckets) {
        for (const bucket of Buckets) {
            const bucketName = bucket.Name;
            if (!bucketName) continue;

            // Check Encryption
            try {
                await s3.send(new GetBucketEncryptionCommand({ Bucket: bucketName }));
                results.push({
                    ruleId: 'AWS-S3-ENCRYPTION',
                    status: 'COMPLIANT',
                    resourceId: bucketName,
                    details: `Bucket is encrypted.`,
                    severity: 'HIGH',
                });
            } catch (e: any) {
                // If GetBucketEncryption fails, it usually means no encryption configuration
                results.push({
                    ruleId: 'AWS-S3-ENCRYPTION',
                    status: 'NON_COMPLIANT',
                    resourceId: bucketName,
                    details: `Bucket is NOT encrypted (Default Encryption missing).`,
                    severity: 'HIGH',
                });
            }

            // Check Public Access Block
            try {
                const { PublicAccessBlockConfiguration } = await s3.send(new GetPublicAccessBlockCommand({ Bucket: bucketName }));
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
            } catch (e) {
                 // If GetPublicAccessBlock fails, assume it's not set
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
    } catch (e: any) {
         console.error('S3 Scan Error:', e);
         results.push({ 
            ruleId: 'AWS-S3-LIST', 
            status: 'NON_COMPLIANT', 
            details: `Failed to list buckets: ${e.message}`,
            resourceId: 'S3-Global',
            severity: 'HIGH'
        });
    }

    // 4. Network Perimeter Watch: Check Security Groups
    try {
      const { SecurityGroups } = await ec2.send(new DescribeSecurityGroupsCommand({}));
      if (SecurityGroups) {
          for (const sg of SecurityGroups) {
              const sgName = sg.GroupName || 'Unknown';
              const sgId = sg.GroupId || 'Unknown';
              
              if (sg.IpPermissions) {
                  for (const perm of sg.IpPermissions) {
                      // Check for 0.0.0.0/0
                      const isPublic = perm.IpRanges?.some(range => range.CidrIp === '0.0.0.0/0');
                      if (isPublic) {
                          const fromPort = perm.FromPort;
                          const toPort = perm.ToPort;
                          const protocol = perm.IpProtocol;
                          
                          // Check SSH (22)
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
                          
                          // Check RDP (3389)
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
    } catch (e: any) {
        console.error('EC2 Scan Error:', e);
        results.push({ 
            ruleId: 'AWS-EC2-CHECK', 
            status: 'NON_COMPLIANT', 
            details: `Failed to scan security groups: ${e.message}`,
            resourceId: 'EC2-Global',
            severity: 'HIGH'
        });
    }

    return results;
  }

  async discoverAssets(credentials: any) {
    const assets: any[] = [];
    const config = {
      region: credentials.region || 'us-east-1',
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    };

    // 1. Discover EC2 Instances
    try {
      const ec2 = new EC2Client(config);
      const { Reservations } = await ec2.send(new DescribeInstancesCommand({}));
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
    } catch (e) {
      console.error('EC2 Discovery Failed', e);
    }

    // 2. Discover S3 Buckets
    try {
      const s3 = new S3Client(config);
      const { Buckets } = await s3.send(new ListBucketsCommand({}));
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
    } catch (e) {
      console.error('S3 Discovery Failed', e);
    }

    // 3. Discover IAM Users
    try {
      const iam = new IAMClient(config);
      const { Users } = await iam.send(new ListUsersCommand({}));
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
    } catch (e) {
      console.error('IAM Discovery Failed', e);
    }

    return assets;
  }
}
