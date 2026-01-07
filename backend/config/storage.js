import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Client as AppwriteClient, Storage as AppwriteStorage, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let storage;
let bucket;
let appwriteClient;
let appwriteStorage;
let appwriteBucketId;
let appwriteProjectId;

// Initialize Appwrite Storage if configured
if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_BUCKET_ID) {
  try {
    appwriteClient = new AppwriteClient()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    appwriteStorage = new AppwriteStorage(appwriteClient);
    appwriteBucketId = process.env.APPWRITE_BUCKET_ID;
    appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
    console.log('✓ Appwrite Storage initialized');
  } catch (error) {
    console.warn('⚠ Failed to initialize Appwrite Storage:', error.message);
    console.warn('⚠ Falling back to other storage options');
  }
}

// Initialize Google Cloud Storage if configured
if (process.env.GCP_PROJECT_ID && process.env.GCS_BUCKET_NAME) {
  try {
    storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      // Credentials will be loaded from environment variables or service account key file
      // GOOGLE_APPLICATION_CREDENTIALS or default credentials
    });
    bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
    console.log('✓ Google Cloud Storage initialized');
  } catch (error) {
    console.warn('⚠ Failed to initialize Google Cloud Storage:', error.message);
    console.warn('⚠ Falling back to local file storage');
  }
}

/**
 * Upload file to storage (GCS in production, local in development)
 * @param {Buffer|Stream} file - File buffer or stream
 * @param {string} filename - Destination filename
 * @param {string} mimetype - File MIME type
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadFile(file, filename, mimetype) {
  // Prefer Appwrite if configured
  if (appwriteStorage && appwriteBucketId) {
    try {
      const buffer = Buffer.isBuffer(file) ? file : await streamToBuffer(file);
      const createdFile = await appwriteStorage.createFile(
        appwriteBucketId,
        ID.unique(),
        InputFile.fromBuffer(buffer, filename),
        {
          contentType: mimetype,
        }
      );

      const baseEndpoint = process.env.APPWRITE_ENDPOINT.replace(/\/+$/, '');
      const url = `${baseEndpoint}/storage/buckets/${appwriteBucketId}/files/${createdFile.$id}/view?project=${appwriteProjectId}`;

      return {
        url,
        path: createdFile.$id,
      };
    } catch (error) {
      console.warn('⚠ Appwrite upload failed, falling back to next storage option:', error.message);
    }
  }

  if (bucket && process.env.NODE_ENV === 'production') {
    // Upload to Google Cloud Storage
    const blob = bucket.file(filename);
    const stream = blob.createWriteStream({
      metadata: {
        contentType: mimetype,
      },
      public: true, // Make files publicly accessible (adjust based on your needs)
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', async () => {
        // Make file public
        await blob.makePublic();
        
        const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        resolve({
          url,
          path: filename,
        });
      });

      if (Buffer.isBuffer(file)) {
        stream.end(file);
      } else {
        file.pipe(stream);
      }
    });
  } else {
    // Local file storage (development)
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filepath = path.join(uploadsDir, filename);
    
    if (Buffer.isBuffer(file)) {
      fs.writeFileSync(filepath, file);
    } else {
      // If it's a stream, write it to disk
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    }

    // Return URL (in production, this should be your API URL)
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    const url = `${baseUrl}/uploads/${filename}`;
    
    return {
      url,
      path: filepath,
    };
  }
}

/**
 * Delete file from storage
 * @param {string} filepath - File path or filename
 * @returns {Promise<void>}
 */
export async function deleteFile(filepath) {
  if (appwriteStorage && appwriteBucketId) {
    try {
      await appwriteStorage.deleteFile(appwriteBucketId, filepath);
      return;
    } catch (error) {
      console.warn('⚠ Appwrite delete failed, attempting fallback:', error.message);
    }
  }

  if (bucket && process.env.NODE_ENV === 'production') {
    // Delete from Google Cloud Storage
    const blob = bucket.file(filepath);
    await blob.delete();
  } else {
    // Delete from local storage
    const uploadsDir = path.join(__dirname, '../uploads');
    const fullPath = path.join(uploadsDir, path.basename(filepath));
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

/**
 * Generate signed URL for private file access (if needed)
 * @param {string} filename - File filename
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>}
 */
export async function getSignedUrl(filename, expiresIn = 3600) {
  if (appwriteStorage && appwriteBucketId) {
    const baseEndpoint = process.env.APPWRITE_ENDPOINT.replace(/\/+$/, '');
    return `${baseEndpoint}/storage/buckets/${appwriteBucketId}/files/${filename}/view?project=${appwriteProjectId}`;
  }

  if (bucket && process.env.NODE_ENV === 'production') {
    const blob = bucket.file(filename);
    const [url] = await blob.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });
    return url;
  } else {
    // Local file - return public URL
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    return `${baseUrl}/uploads/${filename}`;
  }
}

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
