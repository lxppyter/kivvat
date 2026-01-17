import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudProvider } from './cloud.provider.interface';
import { ClientSecretCredential } from '@azure/identity';
import { SubscriptionClient } from '@azure/arm-subscriptions';
import { createPipelineRequest } from '@azure/core-rest-pipeline';

@Injectable()
export class AzureProvider implements CloudProvider {
  async verifyCredentials(credentials: any): Promise<any> {
    const { tenantId, clientId, clientSecret } = credentials;

    if (!tenantId || !clientId || !clientSecret) {
        throw new BadRequestException("Missing Azure credentials (Tenant ID, Client ID, Secret)");
    }

    try {
        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const client = new SubscriptionClient(credential);
        
        // Verify by listing subscriptions via raw request (SDK v6 type issue workaround)
        // Path: /subscriptions
        const request = createPipelineRequest({
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
             // Valid credentials but no subscriptions is technically "connected" but useless.
             // We'll proceed but warn conceptually.
        }

        return {
            provider: 'AZURE',
            tenantId,
            clientId, // Service Principal ID
            subscriptionCount: subList.length,
            // primarySubscription: subList[0]?.subscriptionId
        };
    } catch (error) {
        console.error("Azure Connection Error:", error);
        throw new BadRequestException("Failed to connect to Azure. Check credentials.");
    }
  }
}
