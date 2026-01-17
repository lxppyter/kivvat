"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureProvider = void 0;
const common_1 = require("@nestjs/common");
const identity_1 = require("@azure/identity");
const arm_subscriptions_1 = require("@azure/arm-subscriptions");
const core_rest_pipeline_1 = require("@azure/core-rest-pipeline");
let AzureProvider = class AzureProvider {
    async verifyCredentials(credentials) {
        const { tenantId, clientId, clientSecret } = credentials;
        if (!tenantId || !clientId || !clientSecret) {
            throw new common_1.BadRequestException("Missing Azure credentials (Tenant ID, Client ID, Secret)");
        }
        try {
            const credential = new identity_1.ClientSecretCredential(tenantId, clientId, clientSecret);
            const client = new arm_subscriptions_1.SubscriptionClient(credential);
            const request = (0, core_rest_pipeline_1.createPipelineRequest)({
                method: "GET",
                url: `${client.$host}/subscriptions?api-version=${client.apiVersion}`
            });
            const result = await client.sendRequest(request);
            if (result.status !== 200) {
                throw new Error(`Azure API Error: ${result.status} ${result.bodyAsText}`);
            }
            const body = JSON.parse(result.bodyAsText || '{}');
            const subList = body.value || [];
            if (subList.length === 0) {
            }
            return {
                provider: 'AZURE',
                tenantId,
                clientId,
                subscriptionCount: subList.length,
            };
        }
        catch (error) {
            console.error("Azure Connection Error:", error);
            throw new common_1.BadRequestException("Failed to connect to Azure. Check credentials.");
        }
    }
};
exports.AzureProvider = AzureProvider;
exports.AzureProvider = AzureProvider = __decorate([
    (0, common_1.Injectable)()
], AzureProvider);
//# sourceMappingURL=azure.provider.js.map