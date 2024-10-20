import { S3Client } from '@aws-sdk/client-s3'
import multer from "fastify-multer";

export const upload = multer({ storage: multer.memoryStorage() })

export const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
    },
});