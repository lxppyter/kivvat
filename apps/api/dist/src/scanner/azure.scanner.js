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
let AzureScanner = class AzureScanner {
    async scan(credentials) {
        return [
            {
                ruleId: 'AZURE-MFA-ENFORCED',
                status: 'NON_COMPLIANT',
                details: 'Azure scanning is not fully enabled yet. Defaulting to compliant for demo.',
                resourceId: 'Tenant-Root'
            }
        ];
    }
};
exports.AzureScanner = AzureScanner;
exports.AzureScanner = AzureScanner = __decorate([
    (0, common_1.Injectable)()
], AzureScanner);
//# sourceMappingURL=azure.scanner.js.map