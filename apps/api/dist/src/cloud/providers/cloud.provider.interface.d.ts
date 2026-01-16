export interface CloudProvider {
    verifyCredentials(credentials: any): Promise<any>;
}
