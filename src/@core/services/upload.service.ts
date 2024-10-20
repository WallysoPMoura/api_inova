import { Upload } from '@aws-sdk/lib-storage'
import { s3Client } from '@core/config/cloudflare.config';

import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

class UploadService {

  public async store(folder: string, fileName: string, type: string, file: Buffer) {
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: `${process.env.CLOUDFLARE_BUCKET_NAME}`,
        Key: `${folder}/${fileName}`,
        Body: file,
        ContentType:  `image/${type}`,
      },
    })

    await uploader.done()
  }

  public async link(folder: string, fileName: string) {
    const command = new GetObjectCommand({ Bucket: process.env.CLOUDFLARE_BUCKET_NAME, Key: `${folder}/${fileName}` });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  public async destroy(folder: string, fileName: string) {
    const command = new DeleteObjectCommand({ Bucket: process.env.CLOUDFLARE_BUCKET_NAME, Key: `${folder}/${fileName}` });
    await s3Client.send(command);
  }

}

export default new UploadService();