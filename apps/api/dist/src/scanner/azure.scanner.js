"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureScanner = void 0;
const common_1 = require("@nestjs/common");
const identity_1 = require("@azure/identity");
const arm_resources_1 = require("@azure/arm-resources");
const arm_storage_1 = require("@azure/arm-storage");
const arm_sql_1 = require("@azure/arm-sql");
const arm_compute_1 = require("@azure/arm-compute");
const arm_network_1 = require("@azure/arm-network");
const core_rest_pipeline_1 = require("@azure/core-rest-pipeline");
const arm_subscriptions_1 = require("@azure/arm-subscriptions");
let AzureScanner = class AzureScanner {
    async scan(credentials) {
        const results = [];
        const { tenantId, clientId, clientSecret } = credentials;
        const getResourceGroup = (id) => {
            const match = id.match(/\/resourceGroups\/([^\/]+)\//i);
            return match ? match[1] : 'Unknown';
        };
        try {
            const credential = new identity_1.ClientSecretCredential(tenantId, clientId, clientSecret);
            const subClient = new arm_subscriptions_1.SubscriptionClient(credential);
            const request = (0, core_rest_pipeline_1.createPipelineRequest)({
                method: "GET",
                url: `${subClient.$host}/subscriptions?api-version=${subClient.apiVersion}`
            });
            const subResult = await subClient.sendRequest(request);
            const subBody = JSON.parse(subResult.bodyAsText || '{}');
            const subscriptions = subBody.value || [];
            if (subscriptions.length === 0) {
                console.warn("No subscriptions found for Azure Scanner.");
                return results;
            }
            const subscriptionId = subscriptions[0].subscriptionId;
            console.log(`Azure Scanning Subscription: ${subscriptionId}`);
            const resourceClient = new arm_resources_1.ResourceManagementClient(credential, subscriptionId);
            const storageClient = new arm_storage_1.StorageManagementClient(credential, subscriptionId);
            const sqlClient = new arm_sql_1.SqlManagementClient(credential, subscriptionId);
            const computeClient = new arm_compute_1.ComputeManagementClient(credential, subscriptionId);
            const networkClient = new arm_network_1.NetworkManagementClient(credential, subscriptionId);
            const storageAccounts = await this.listAll(storageClient.storageAccounts.list());
            for (const account of storageAccounts) {
                if (account.enableHttpsTrafficOnly) {
                    results.push({
                        ruleId: 'AZURE-STORAGE-SECURE-TRANSFER',
                        status: 'COMPLIANT',
                        resourceId: account.name || 'Unknown',
                        details: `Secure transfer (HTTPS) is enabled for ${account.name}.`,
                        severity: 'MEDIUM'
                    });
                }
                else {
                    results.push({
                        ruleId: 'AZURE-STORAGE-SECURE-TRANSFER',
                        status: 'NON_COMPLIANT',
                        resourceId: account.name || 'Unknown',
                        details: `Secure transfer (HTTPS) is DISABLED for ${account.name}.`,
                        severity: 'MEDIUM'
                    });
                }
                if (account.allowBlobPublicAccess === false) {
                    results.push({
                        ruleId: 'AZURE-STORAGE-NO-PUBLIC',
                        status: 'COMPLIANT',
                        resourceId: account.name || 'Unknown',
                        details: `Public blob access is explicitly BLOCKED for ${account.name}.`,
                        severity: 'HIGH'
                    });
                }
                else {
                    results.push({
                        ruleId: 'AZURE-STORAGE-NO-PUBLIC',
                        status: 'NON_COMPLIANT',
                        resourceId: account.name || 'Unknown',
                        details: `Public blob access is NOT blocked for ${account.name}.`,
                        severity: 'HIGH'
                    });
                }
            }
            const sqlServers = await this.listAll(sqlClient.servers.list());
            for (const server of sqlServers) {
                results.push({
                    ruleId: 'AZURE-SQL-AUDITING',
                    status: 'NON_COMPLIANT',
                    resourceId: server.name || 'Unknown',
                    details: `Auditing check requires deeper inspection of ${server.name}.`,
                    severity: 'MEDIUM'
                });
                const rg = getResourceGroup(server.id || '');
                const databases = await this.listAll(sqlClient.databases.listByServer(rg, server.name || 'Unknown'));
                for (const db of databases) {
                    if (db.name === 'master')
                        continue;
                    try {
                        const tde = await sqlClient.transparentDataEncryptions.get(rg, server.name || '', db.name || '', 'current');
                        if (tde.state === 'Enabled') {
                            results.push({
                                ruleId: 'AZURE-SQL-TDE',
                                status: 'COMPLIANT',
                                resourceId: `${server.name}/${db.name}`,
                                details: `TDE is ENABLED for database ${db.name}.`,
                                severity: 'HIGH'
                            });
                        }
                        else {
                            results.push({
                                ruleId: 'AZURE-SQL-TDE',
                                status: 'NON_COMPLIANT',
                                resourceId: `${server.name}/${db.name}`,
                                details: `TDE is DISABLED for database ${db.name}. Data at rest is vulnerable.`,
                                severity: 'HIGH'
                            });
                        }
                    }
                    catch (e) {
                    }
                }
                const firewallRules = await this.listAll(sqlClient.firewallRules.listByServer(rg, server.name || ''));
                for (const rule of firewallRules) {
                    if (rule.startIpAddress === '0.0.0.0' && rule.endIpAddress === '0.0.0.0') {
                        results.push({
                            ruleId: 'AZURE-SQL-FIREWALL',
                            status: 'NON_COMPLIANT',
                            resourceId: server.name || 'Unknown',
                            details: `Firewall rule '${rule.name}' allows access from ALL Azure IPs. Review this access.`,
                            severity: 'MEDIUM'
                        });
                    }
                }
            }
            const nsgs = await this.listAll(networkClient.networkSecurityGroups.listAll());
            for (const nsg of nsgs) {
                const rules = nsg.securityRules || [];
                for (const rule of rules) {
                    if (rule.access === 'Allow' && rule.direction === 'Inbound' && (rule.sourceAddressPrefix === '*' || rule.sourceAddressPrefix === 'Internet')) {
                        const isSsh = (rule.destinationPortRange === '22' || rule.destinationPortRange === '*');
                        if (isSsh) {
                            results.push({
                                ruleId: 'AZURE-VM-NSG-SSH',
                                status: 'NON_COMPLIANT',
                                resourceId: nsg.name || 'Unknown',
                                details: `NSG '${nsg.name}' rule '${rule.name}' allows SSH (22) from Internet. Critical risk!`,
                                severity: 'CRITICAL'
                            });
                        }
                    }
                }
            }
            const vms = await this.listAll(computeClient.virtualMachines.listAll());
            for (const vm of vms) {
                const osDisk = vm.storageProfile?.osDisk;
                if (osDisk?.managedDisk) {
                    const adeExtension = vm.resources ? vm.resources.find(r => r.name && (r.name.includes('AzureDiskEncryption') || r.name.includes('OmsAgent'))) : null;
                    results.push({
                        ruleId: 'AZURE-VM-DISK-ENCRYPTION',
                        status: 'COMPLIANT',
                        resourceId: vm.name || 'Unknown',
                        details: `VM ${vm.name} uses Managed Disks (SSE Encrypted by default).`,
                        severity: 'HIGH'
                    });
                }
            }
        }
        catch (e) {
            console.error("Azure Scan Failed:", e);
            results.push({
                ruleId: 'AZURE-SCAN-ERROR',
                status: 'NON_COMPLIANT',
                resourceId: 'Azure-Connection',
                details: `Failed to scan Azure: ${e.message}`,
                severity: 'CRITICAL'
            });
        }
        return results;
    }
    async listAll(iterator) {
        const items = [];
        for await (const item of iterator) {
            items.push(item);
        }
        return items;
    }
};
exports.AzureScanner = AzureScanner;
exports.AzureScanner = AzureScanner = __decorate([
    (0, common_1.Injectable)()
], AzureScanner);
//# sourceMappingURL=azure.scanner.js.map