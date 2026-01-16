"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyModule = void 0;
const common_1 = require("@nestjs/common");
const policy_controller_1 = require("./policy.controller");
const policy_service_1 = require("./policy.service");
const prisma_module_1 = require("../prisma/prisma.module");
let PolicyModule = class PolicyModule {
};
exports.PolicyModule = PolicyModule;
exports.PolicyModule = PolicyModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [policy_controller_1.PolicyController],
        providers: [policy_service_1.PolicyService],
    })
], PolicyModule);
//# sourceMappingURL=policy.module.js.map