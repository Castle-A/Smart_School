import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageAdapter } from '../interfaces/storage.adapter.interface';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Adaptateur de stockage local pour le développement.
 * Sauvegarde les fichiers dans le dossier backend/uploads/
 */
@Injectable()
export class LocalStorageAdapter implements StorageAdapter {
  private readonly logger = new Logger(LocalStorageAdapter.name);
  private readonly uploadDir: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.publicUrl =
      this.configService.get<string>('LOCAL_STORAGE_URL') ||
      'http://localhost:3000/uploads';

    // Créer le dossier uploads si nécessaire
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Local storage directory ready: ${this.uploadDir}`);
    } catch (error) {
      this.logger.error('Failed to create uploads directory:', error);
    }
  }

  async upload(
    file: Buffer,
    key: string,
    mimeType: string,
    bucket: string,
  ): Promise<{ url?: string; key: string; size: number; checksum?: string }> {
    try {
      // Créer le chemin complet (inclus bucket comme sous-dossier)
      const filePath = path.join(this.uploadDir, bucket, key);
      const fileDir = path.dirname(filePath);

      // Créer les dossiers parents
      await fs.mkdir(fileDir, { recursive: true });

      // Écrire le fichier
      await fs.writeFile(filePath, file);

      const url = `${this.publicUrl}/${bucket}/${key}`;

      this.logger.log(`File uploaded locally: ${url}`);

      return {
        key,
        url,
        size: file.length,
      };
    } catch (error) {
      this.logger.error(`Error uploading file locally: ${key}`, error);
      throw error;
    }
  }

  async getSignedDownloadUrl(
    key: string,
    bucket: string,
    expiresIn = 3600,
  ): Promise<string> {
    // Pour le stockage local, on retourne juste l'URL publique
    const url = `${this.publicUrl}/${bucket}/${key}`;
    this.logger.log(`Generated local download URL: ${url}`);
    return url;
  }

  async delete(key: string, bucket: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, bucket, key);
      await fs.unlink(filePath);
      this.logger.log(`File deleted locally: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file locally: ${key}`, error);
      throw error;
    }
  }

  async getFileStream(key: string, bucket: string): Promise<any> {
    const filePath = path.join(this.uploadDir, bucket, key);
    // Utiliser fs.createReadStream pour retourner un stream
    // Note: fs/promises ne supporte pas createReadStream, on utilise 'fs' classique
    const fsNative = await import('fs');
    if (!fsNative.existsSync(filePath)) {
      throw new Error('File not found locally');
    }
    return fsNative.createReadStream(filePath);
  }
}
