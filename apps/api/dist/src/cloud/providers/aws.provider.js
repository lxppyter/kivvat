"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsProvider = void 0;
const common_1 = require("@nestjs/common");
const client_sts_1 = require("@aws-sdk/client-sts");
let AwsProvider = class AwsProvider {
    async verifyCredentials(credentials) {
        const { accessKeyId, secretAccessKey, region } = credentials;
        if (!accessKeyId || !secretAccessKey) {
            throw new common_1.BadRequestException('Missing AWS Access Key or Secret Key');
        }
        try {
            const client = new client_sts_1.STSClient({
                region: region || 'us-east-1',
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
            const command = new client_sts_1.GetCallerIdentityCommand({});
            const response = await client.send(command);
            return {
                provider: 'AWS',
                accountId: response.Account,
                arn: response.Arn,
                userId: response.UserId,
            };
        }
        catch (error) {
            console.error('AWS Connection Error:', error);
            throw new common_1.BadRequestException('Failed to connect to AWS. Check credentials.');
        }
    }
};
exports.AwsProvider = AwsProvider;
exports.AwsProvider = AwsProvider = __decorate([
    (0, common_1.Injectable)()
], AwsProvider);
//# sourceMappingURL=aws.provider.js.map