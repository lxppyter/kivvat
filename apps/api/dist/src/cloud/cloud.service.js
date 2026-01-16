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
exports.CloudService = void 0;
const common_1 = require("@nestjs/common");
const aws_provider_1 = require("./providers/aws.provider");
const azure_provider_1 = require("./providers/azure.provider");
const gcp_provider_1 = require("./providers/gcp.provider");
let CloudService = class CloudService {
    awsProvider;
    azureProvider;
    gcpProvider;
    constructor(awsProvider, azureProvider, gcpProvider) {
        this.awsProvider = awsProvider;
        this.azureProvider = azureProvider;
        this.gcpProvider = gcpProvider;
    }
    async connect(provider, credentials) {
        switch (provider.toLowerCase()) {
            case 'aws':
                return this.awsProvider.verifyCredentials(credentials);
            case 'azure':
                return this.azureProvider.verifyCredentials(credentials);
            case 'gcp':
                return this.gcpProvider.verifyCredentials(credentials);
            default:
                throw new common_1.BadRequestException('Unsupported cloud provider');
        }
    }
};
exports.CloudService = CloudService;
exports.CloudService = CloudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_provider_1.AwsProvider,
        azure_provider_1.AzureProvider,
        gcp_provider_1.GcpProvider])
], CloudService);
//# sourceMappingURL=cloud.service.js.map