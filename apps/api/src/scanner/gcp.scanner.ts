import { Injectable } from '@nestjs/common';
import { CloudScanner, ScanResult } from './scanner.interface';
import { Storage } from '@google-cloud/storage';
import { InstancesClient, ZonesClient } from '@google-cloud/compute';
import { google } from 'googleapis';

@Injectable()
export class GcpScanner implements CloudScanner {
  async scan(credentials: any): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    const { serviceAccountJson } = credentials;

    if (!serviceAccountJson) {
        console.error("GCP Scan Error: Missing Service Account JSON");
        return [];
    }

    let parsedKey;
    try {
        parsedKey = typeof serviceAccountJson === 'string' 
            ? JSON.parse(serviceAccountJson) 
            : serviceAccountJson;
    } catch(e) {
        console.error("GCP Scan Error: Invalid JSON");
        return [];
    }

    const projectId = parsedKey.project_id;
    const clientEmail = parsedKey.client_email;
    const privateKey = parsedKey.private_key;

    const authOptions = {
        projectId,
        credentials: { client_email: clientEmail, private_key: privateKey }
    };

    try {
        console.log(`Starting GCP Scan for Project: ${projectId}`);

        // --- CHECK 1: CLOUD STORAGE (Public Access) ---
        // Rule: GCP-STORAGE-PUBLIC-BLOCK
        const storage = new Storage({ ...authOptions });
        const [buckets] = await storage.getBuckets();
        
        for (const bucket of buckets) {
            const [metadata] = await bucket.getMetadata();
            
            // Check Public Access Prevention
            const pap = metadata.iamConfiguration?.publicAccessPrevention;
            
            if (pap === 'enforced') {
                results.push({
                    ruleId: 'GCP-STORAGE-PUBLIC-BLOCK',
                    status: 'COMPLIANT',
                    resourceId: bucket.name,
                    details: `Public access prevention is ENFORCED for ${bucket.name}.`,
                    severity: 'HIGH'
                });
            } else {
                 results.push({
                    ruleId: 'GCP-STORAGE-PUBLIC-BLOCK',
                    status: 'NON_COMPLIANT',
                    resourceId: bucket.name,
                    details: `Public access prevention is NOT enforced for ${bucket.name}.`,
                    severity: 'HIGH'
                });
            }
        }

        // --- CHECK 2: COMPUTE ENGINE (External IP) ---
        // Rule: GCP-COMPUTE-NO-PUBLIC-IP
        // Strategy: List Zones -> List Instances per Zone (Avoids aggregatedList issues)
        const instancesClient = new InstancesClient({ ...authOptions });
        const zonesClient = new ZonesClient({ ...authOptions });

        const [zones] = await zonesClient.list({ project: projectId });
        let allInstances: any[] = [];

        // Limit to first 5 zones for performance in this demo/MVP
        // In prod, use Promise.all with concurrency limit
        for (const zone of zones.slice(0, 5)) {
            if (!zone.name) continue;
            try {
                const [zoneInstances] = await instancesClient.list({ 
                    project: projectId, 
                    zone: zone.name 
                });
                if (zoneInstances) {
                    allInstances = [...allInstances, ...zoneInstances];
                }
            } catch (err) {
                // Ignore empty zones or permission errors on specific zones
            }
        }

        for (const instance of allInstances) {
            // Check Network Interfaces for accessConfigs (External IP)
            const hasExternalIp = instance.networkInterfaces?.some((ni: any) => 
                ni.accessConfigs && ni.accessConfigs.length > 0 && ni.accessConfigs.some((ac: any) => ac.natIP)
            );

            if (hasExternalIp) {
                 results.push({
                    ruleId: 'GCP-COMPUTE-NO-PUBLIC-IP',
                    status: 'NON_COMPLIANT',
                    resourceId: instance.name || 'Unknown',
                    details: `Instance ${instance.name} has a Public IP exposed.`,
                    severity: 'HIGH'
                });
            } else {
                 results.push({
                    ruleId: 'GCP-COMPUTE-NO-PUBLIC-IP',
                    status: 'COMPLIANT',
                    resourceId: instance.name || 'Unknown',
                    details: `Instance ${instance.name} does not have a Public IP.`,
                    severity: 'HIGH'
                });
            }

            // --- CHECK 3: SHIELDED VM ---
            // Rule: GCP-COMPUTE-SHIELDED
            const isShielded = instance.shieldedInstanceConfig?.enableSecureBoot === true;
            if (isShielded) {
                results.push({
                    ruleId: 'GCP-COMPUTE-SHIELDED',
                    status: 'COMPLIANT',
                    resourceId: instance.name || 'Unknown',
                    details: `Shielded VM (Secure Boot) is ENABLED for ${instance.name}.`,
                    severity: 'MEDIUM'
                });
            } else {
                results.push({
                    ruleId: 'GCP-COMPUTE-SHIELDED',
                    status: 'NON_COMPLIANT',
                    resourceId: instance.name || 'Unknown',
                    details: `Shielded VM (Secure Boot) is DISABLED for ${instance.name}.`,
                    severity: 'MEDIUM'
                });
            }
        }

        // --- CHECK 4: CLOUD SQL SSL ---
        // Rule: GCP-SQL-SSL
        try {
            const sqlAdmin = google.sql({ version: 'v1beta4', auth: new google.auth.JWT({ 
                email: clientEmail, 
                key: privateKey, 
                scopes: ['https://www.googleapis.com/auth/sqlservice.admin'] 
            })});
            
            const { data } = await sqlAdmin.instances.list({ project: projectId });
            if (data.items) {
                for (const db of data.items) {
                    const requireSsl = db.settings?.ipConfiguration?.requireSsl;
                    if (requireSsl) {
                        results.push({
                            ruleId: 'GCP-SQL-SSL',
                            status: 'COMPLIANT',
                            resourceId: db.name || 'Unknown',
                            details: `Cloud SQL Instance ${db.name} enforces SSL connections.`,
                            severity: 'HIGH'
                        });
                    } else {
                        results.push({
                            ruleId: 'GCP-SQL-SSL',
                            status: 'NON_COMPLIANT',
                            resourceId: db.name || 'Unknown',
                            details: `Cloud SQL Instance ${db.name} allows non-SSL connections.`,
                            severity: 'HIGH'
                        });
                    }
                }
            }
        } catch (e: any) {
             // console.error('GCP SQL Scan Error', e);
        }

        // --- CHECK 5: IAM KEYS (User Managed) ---
        // Rule: GCP-IAM-NO-SERVICE-ACCOUNT-KEYS
        try {
            const iam = google.iam({ version: 'v1', auth: new google.auth.JWT({
                email: clientEmail, 
                key: privateKey, 
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            })});

            const { data: saData } = await iam.projects.serviceAccounts.list({ name: `projects/${projectId}` });
            if (saData.accounts) {
                for (const sa of saData.accounts) {
                    if (sa.email) {
                        const { data: keysData } = await iam.projects.serviceAccounts.keys.list({ 
                            name: `projects/${projectId}/serviceAccounts/${sa.email}`,
                            keyTypes: ['USER_MANAGED'] // Only care about user-created keys
                        });
                        
                        if (keysData.keys && keysData.keys.length > 0) {
                             results.push({
                                ruleId: 'GCP-IAM-NO-SERVICE-ACCOUNT-KEYS',
                                status: 'NON_COMPLIANT',
                                resourceId: sa.email,
                                details: `Service Account ${sa.email} has ${keysData.keys.length} user-managed keys. Prefer Keyless auth (Workload Identity).`,
                                severity: 'MEDIUM'
                            });
                        }
                    }
                }
            }
        } catch (e: any) {
            // console.error('GCP IAM Scan Error', e);
        }

    } catch (e) {
        console.error("GCP Scan Failed:", e);
        results.push({
            ruleId: 'GCP-SCAN-ERROR',
            status: 'NON_COMPLIANT',
            resourceId: 'GCP-Connection',
            details: `Failed to scan GCP: ${e.message}`,
            severity: 'CRITICAL'
        });
    }

    return results;
  }
}
