export interface CloudProvider {
  /**
   * Verifies if the provided credentials are valid.
   * Returns the account ID or identity info if successful.
   * Throws error if invalid.
   */
  verifyCredentials(credentials: any): Promise<any>;

  /**
   * Scans the cloud environment for compliance.
   * @param credentials Credentials to use for scanning
   */
   // scan(credentials: any): Promise<any>; // Future Phase
}
