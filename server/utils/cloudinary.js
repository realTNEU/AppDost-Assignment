import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (cloudName && apiKey && apiSecret) {
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  } catch (error) {
    console.error('❌ Error configuring Cloudinary:', error.message);
    throw error;
  }
} else {
  const missing = [];
  if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
  throw new Error(`Cloudinary configuration is required. Please set ${missing.join(', ')} in your .env file`);
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'publicfeed',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { 
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
          flags: 'progressive',
        }
      ],
      resource_type: 'auto',
    };
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'publicfeed/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { 
          width: 400, 
          height: 400, 
          crop: 'fill',
          quality: 'auto:best',
          fetch_format: 'auto',
          flags: 'progressive',
          gravity: 'face',
        }
      ],
      resource_type: 'auto',
    };
  },
});

export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;
  
  if (!url.includes('res.cloudinary.com')) return url;
  
  try {
    const { width, height, quality = 'auto', format = 'auto' } = options;
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return url;
    
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);
    transformations.push('dpr_auto');
    transformations.push('c_limit');
    
    pathParts.splice(uploadIndex + 1, 0, transformations.join(','));
    
    urlObj.pathname = pathParts.join('/');
    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadAvatar = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

export default cloudinary;
