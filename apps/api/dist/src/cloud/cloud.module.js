"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudModule = void 0;
const common_1 = require("@nestjs/common");
const cloud_service_1 = require("./cloud.service");
const cloud_controller_1 = require("./cloud.controller");
const aws_provider_1 = require("./providers/aws.provider");
const azure_provider_1 = require("./providers/azure.provider");
const gcp_provider_1 = require("./providers/gcp.provider");
const asset_module_1 = require("../asset/asset.module");
let CloudModule = class CloudModule {
};
exports.CloudModule = CloudModule;
exports.CloudModule = CloudModule = __decorate([
    (0, common_1.Module)({
        imports: [asset_module_1.AssetModule],
        controllers: [cloud_controller_1.CloudController],
        providers: [cloud_service_1.CloudService, aws_provider_1.AwsProvider, azure_provider_1.AzureProvider, gcp_provider_1.GcpProvider],
        exports: [cloud_service_1.CloudService],
    })
], CloudModule);
//# sourceMappingURL=cloud.module.js.map