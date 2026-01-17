"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GcpProvider = void 0;
const common_1 = require("@nestjs/common");
const resource_manager_1 = require("@google-cloud/resource-manager");
let GcpProvider = class GcpProvider {
    async verifyCredentials(credentials) {
        const { serviceAccountJson } = credentials;
        if (!serviceAccountJson) {
            throw new common_1.BadRequestException("Missing GCP Service Account JSON");
        }
        let parsedKey;
        try {
            parsedKey = typeof serviceAccountJson === 'string'
                ? JSON.parse(serviceAccountJson)
                : serviceAccountJson;
        }
        catch (e) {
            throw new common_1.BadRequestException("Invalid JSON format for Service Account Key");
        }
        if (!parsedKey.project_id || !parsedKey.client_email || !parsedKey.private_key) {
            throw new common_1.BadRequestException("Invalid Service Account Key (Missing project_id, client_email, or private_key)");
        }
        try {
            const client = new resource_manager_1.ProjectsClient({
                credentials: {
                    client_email: parsedKey.client_email,
                    private_key: parsedKey.private_key,
                },
                projectId: parsedKey.project_id
            });
            const [project] = await client.getProject({
                name: `projects/${parsedKey.project_id}`
            });
            return {
                provider: 'GCP',
                projectId: parsedKey.project_id,
                clientId: parsedKey.client_id,
                clientEmail: parsedKey.client_email,
                projectName: project.displayName,
                state: project.state
            };
        }
        catch (error) {
            console.error("GCP Connection Error:", error);
            throw new common_1.BadRequestException("Failed to connect to GCP. Check permissions or key.");
        }
    }
};
exports.GcpProvider = GcpProvider;
exports.GcpProvider = GcpProvider = __decorate([
    (0, common_1.Injectable)()
], GcpProvider);
//# sourceMappingURL=gcp.provider.js.map