
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT;
const STORAGE_ACCESS_KEY_ID = process.env.STORAGE_ACCESS_KEY_ID;
const STORAGE_SECRET_ACCESS_KEY = process.env.STORAGE_SECRET_ACCESS_KEY;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
const STORAGE_REGION = process.env.STORAGE_REGION || 'auto';

if (!STORAGE_ENDPOINT || !STORAGE_ACCESS_KEY_ID || !STORAGE_SECRET_ACCESS_KEY || !STORAGE_BUCKET) {
    console.error('❌ Configuration manquante dans .env');
    process.exit(1);
}

const client = new S3Client({
    region: STORAGE_REGION,
    endpoint: STORAGE_ENDPOINT,
    credentials: {
        accessKeyId: STORAGE_ACCESS_KEY_ID,
        secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

async function listFiles() {
    console.log(`🔌 Connexion à R2/S3: ${STORAGE_ENDPOINT}`);
    console.log(`📦 Bucket: ${STORAGE_BUCKET}`);
    console.log('🔍 Listing files...');

    try {
        const command = new ListObjectsV2Command({
            Bucket: STORAGE_BUCKET,
            // Prefix: 'schools/' // Optionnel : filtrer par préfixe
        });

        const response = await client.send(command);

        if (!response.Contents || response.Contents.length === 0) {
            console.log('📭 Le bucket est vide ou aucun fichier trouvé avec ce préfixe.');
        } else {
            console.log(`✅ Trouvé ${response.Contents.length} fichiers :`);
            response.Contents.forEach(file => {
                console.log(` - 📄 ${file.Key} (${file.Size} bytes) - LastMod: ${file.LastModified}`);
            });
        }
    } catch (error) {
        console.error('❌ Erreur lors du listing:', error);
    }
}

listFiles();
