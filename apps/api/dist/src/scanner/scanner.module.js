"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerModule = void 0;
const common_1 = require("@nestjs/common");
const aws_scanner_1 = require("./aws.scanner");
const azure_scanner_1 = require("./azure.scanner");
const scanner_service_1 = require("./scanner.service");
const scanner_controller_1 = require("./scanner.controller");
const cloud_module_1 = require("../cloud/cloud.module");
const prisma_module_1 = require("../prisma/prisma.module");
const task_module_1 = require("../task/task.module");
let ScannerModule = class ScannerModule {
};
exports.ScannerModule = ScannerModule;
exports.ScannerModule = ScannerModule = __decorate([
    (0, common_1.Module)({
        imports: [cloud_module_1.CloudModule, prisma_module_1.PrismaModule, task_module_1.TaskModule],
        controllers: [scanner_controller_1.ScannerController],
        providers: [aws_scanner_1.AwsScanner, azure_scanner_1.AzureScanner, scanner_service_1.ScannerService],
        exports: [scanner_service_1.ScannerService],
    })
], ScannerModule);
//# sourceMappingURL=scanner.module.js.map