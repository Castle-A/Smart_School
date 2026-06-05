export interface StorageAdapter {
  upload(
    file: Buffer,
    key: string,
    mimeType: string,
    bucket: string,
  ): Promise<{ url?: string; key: string; size: number; checksum?: string }>;

  getSignedDownloadUrl(
    key: string,
    bucket: string,
    expiresIn?: number,
  ): Promise<string>;

  /**
   * Delete a file
   */
  delete(key: string, bucket: string): Promise<void>;

  /**
   * Get a file stream
   */
  getFileStream(key: string, bucket: string): Promise<any>;
}
