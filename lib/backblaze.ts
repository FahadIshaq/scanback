import AWS from 'aws-sdk';
import { BACKBLAZE_CONFIG } from './config';

// Configure AWS SDK for Backblaze B2
const s3 = new AWS.S3({
  endpoint: BACKBLAZE_CONFIG.ENDPOINT,
  accessKeyId: BACKBLAZE_CONFIG.KEY_ID,
  secretAccessKey: BACKBLAZE_CONFIG.APP_KEY,
  region: 'us-west-002',
  s3ForcePathStyle: true
});

export class BackblazeService {
  private static instance: BackblazeService;
  private bucketName: string;

  constructor() {
    this.bucketName = BACKBLAZE_CONFIG.BUCKET_NAME;
  }

  static getInstance(): BackblazeService {
    if (!BackblazeService.instance) {
      BackblazeService.instance = new BackblazeService();
    }
    return BackblazeService.instance;
  }

  async uploadImage(file: File, folder: string = 'pet-images'): Promise<string> {
    try {
      // Convert File to Buffer
      const buffer = await file.arrayBuffer();
      const bufferData = Buffer.from(buffer);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

      // Upload parameters
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: bufferData,
        ContentType: file.type,
        ACL: 'public-read' // Make the image publicly accessible
      };

      // Upload to Backblaze B2
      const result = await s3.upload(uploadParams).promise();
      
      return result.Location; // Return the public URL
    } catch (error) {
      console.error('Error uploading to Backblaze B2:', error);
      throw new Error('Failed to upload image');
    }
  }

  async uploadBase64Image(base64Data: string, folder: string = 'pet-images'): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64String, 'base64');

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${folder}/${timestamp}-${randomString}.jpg`;

      // Upload parameters
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      };

      // Upload to Backblaze B2
      const result = await s3.upload(uploadParams).promise();
      
      return result.Location; // Return the public URL
    } catch (error) {
      console.error('Error uploading to Backblaze B2:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract key from URL
      const url = new URL(imageUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      const deleteParams = {
        Bucket: this.bucketName,
        Key: key
      };

      await s3.deleteObject(deleteParams).promise();
      return true;
    } catch (error) {
      console.error('Error deleting from Backblaze B2:', error);
      return false;
    }
  }
}

export const backblazeService = BackblazeService.getInstance();
