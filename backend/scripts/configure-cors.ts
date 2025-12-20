
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';
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
    console.error('Assurez-vous d\'avoir configuré: STORAGE_ENDPOINT, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_BUCKET');
    process.exit(1);
}

const client = new S3Client({
    region: STORAGE_REGION,
    endpoint: STORAGE_ENDPOINT,
    credentials: {
        accessKeyId: STORAGE_ACCESS_KEY_ID,
        secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Requis pour certains providers S3-compatible comme MinIO, parfois utile pour R2
});

const corsRules = [
    {
        AllowedOrigins: ["*"], // Permis pour dev, à restreindre en prod
        AllowedMethods: ["GET", "HEAD"], // Lecture seule pour les fichiers publics
        AllowedHeaders: ["*"],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3600
    }
];

async function configureCors() {
    console.log(`🔌 Connexion à R2/S3: ${STORAGE_ENDPOINT}`);
    console.log(`📦 Bucket: ${STORAGE_BUCKET}`);
    console.log('⚙️  Application des règles CORS...');

    try {
        const command = new PutBucketCorsCommand({
            Bucket: STORAGE_BUCKET,
            CORSConfiguration: {
                CORSRules: corsRules
            }
        });

        await client.send(command);
        console.log('✅ Règles CORS appliquées avec succès !');
        console.log('🌐 Votre bucket est maintenant accessible depuis le navigateur.');
    } catch (error) {
        console.error('❌ Erreur lors de l\'application du CORS:', error);
    }
}

configureCors();
