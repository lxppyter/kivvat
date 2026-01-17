import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudProvider } from './cloud.provider.interface';
import { ProjectsClient } from '@google-cloud/resource-manager';

@Injectable()
export class GcpProvider implements CloudProvider {
  async verifyCredentials(credentials: any): Promise<any> {
    const { serviceAccountJson } = credentials;

    if (!serviceAccountJson) {
        throw new BadRequestException("Missing GCP Service Account JSON");
    }

    let parsedKey;
    try {
        parsedKey = typeof serviceAccountJson === 'string' 
            ? JSON.parse(serviceAccountJson) 
            : serviceAccountJson;
    } catch (e) {
        throw new BadRequestException("Invalid JSON format for Service Account Key");
    }

    if (!parsedKey.project_id || !parsedKey.client_email || !parsedKey.private_key) {
         throw new BadRequestException("Invalid Service Account Key (Missing project_id, client_email, or private_key)");
    }

    try {
        const client = new ProjectsClient({
            credentials: {
                client_email: parsedKey.client_email,
                private_key: parsedKey.private_key,
            },
            projectId: parsedKey.project_id
        });
        
        // Verify by getting project details
        const [project] = await client.getProject({
            name: `projects/${parsedKey.project_id}`
        });

        return {
            provider: 'GCP',
            projectId: parsedKey.project_id,
            clientId: parsedKey.client_id, // Unique ID of the SA
            clientEmail: parsedKey.client_email,
            projectName: project.displayName,
            state: project.state
        };
    } catch (error) {
        console.error("GCP Connection Error:", error);
        throw new BadRequestException("Failed to connect to GCP. Check permissions or key.");
    }
  }
}
