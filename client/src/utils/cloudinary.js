/**
 * Optimize Cloudinary URLs for faster loading and better performance
 * Uses aggressive optimization with proper Cloudinary transformation syntax
 */

/**
 * Build optimized Cloudinary URL with transformations
 * Intelligently handles URLs with or without existing transformations
 */
function buildOptimizedUrl(url, newTransformations) {
  if (!url || typeof url !== 'string') return url;
  
  // If it's not a Cloudinary URL, return as is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  try {
    // Cloudinary URL formats:
    // Format 1: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/v{version}/{public_id}.{format}
    // Format 2: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{format}
    // Format 3: https://res.cloudinary.com/{cloud}/image/upload/{transformations}/{folder}/{public_id}.{format}
    
    // Find the /upload/ segment
    const uploadMatch = url.match(/(\/upload\/)(.+)$/);
    if (!uploadMatch) {
      return url; // Invalid Cloudinary URL format
    }
    
    const uploadPrefix = uploadMatch[1]; // "/upload/"
    const afterUpload = uploadMatch[2]; // Everything after "/upload/"
    
    // Split the path after /upload/ into segments
    const segments = afterUpload.split('/');
    const firstSegment = segments[0] || '';
    
    // Check if first segment is transformations
    // Transformations typically contain patterns like: w_800, c_limit, q_auto, f_auto, fl_progressive
    const isTransformations = firstSegment.includes('_') && 
      (firstSegment.includes('w_') || firstSegment.includes('h_') || 
       firstSegment.includes('c_') || firstSegment.includes('q_') || 
       firstSegment.includes('f_') || firstSegment.includes('fl_') ||
       firstSegment.includes('g_') || firstSegment.includes('dpr_'));
    
    // Check if first segment is a version (starts with 'v' followed by digits)
    const isVersion = /^v\d+$/.test(firstSegment);
    
    let optimizedPath;
    
    if (isTransformations) {
      // Replace existing transformations with new optimized ones
      optimizedPath = newTransformations + '/' + segments.slice(1).join('/');
    } else if (isVersion) {
      // Version found without transformations, insert transformations before version
      optimizedPath = newTransformations + '/' + afterUpload;
    } else {
      // No transformations or version detected, insert transformations
      // This handles cases where the path goes directly to folder/public_id
      optimizedPath = newTransformations + '/' + afterUpload;
    }
    
    // Rebuild the full URL
    const baseUrl = url.substring(0, url.indexOf(uploadPrefix) + uploadPrefix.length);
    return baseUrl + optimizedPath;
    
  } catch (error) {
    console.warn('Failed to optimize Cloudinary URL, using original:', error);
    return url;
  }
}

/**
 * Get optimized image URL for posts
 * Uses aggressive compression and format optimization
 * Defaults to 800px width for faster loading
 */
export function getOptimizedPostImageUrl(url, options = {}) {
  if (!url) return url;
  
  const {
    width = 800,            // Reduced from 1200 to 800 for faster loading
    quality = 'auto:good',  // Good quality with auto optimization
    format = 'auto',        // Auto format (WebP/AVIF when supported)
    crop = 'limit',         // Limit crop to maintain aspect ratio
  } = options;
  
  // Build transformation string with aggressive optimizations
  // Order matters: width, crop, quality, format, flags
  const transformations = [
    `w_${width}`,           // Max width (800px default for faster loading)
    `c_${crop}`,            // Crop mode
    `q_${quality}`,         // Quality (auto:good balances quality/size)
    `f_${format}`,          // Format (auto = WebP/AVIF when browser supports)
    'fl_progressive',       // Progressive loading for JPEGs
  ].join(',');
  
  return buildOptimizedUrl(url, transformations);
}

/**
 * Get optimized image URL for avatars
 * Small, square, optimized for circular display
 */
export function getOptimizedAvatarUrl(url, options = {}) {
  if (!url) return url;
  
  const {
    width = 200,
    height = 200,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
  } = options;
  
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,            // Fill crop for square
    `q_${quality}`,
    `f_${format}`,
    'fl_progressive',
    'g_face',               // Auto-focus on faces
  ].join(',');
  
  return buildOptimizedUrl(url, transformations);
}

/**
 * Get responsive image srcset for posts
 * Provides multiple sizes for different screen densities
 */
export function getPostImageSrcSet(url) {
  if (!url) return '';
  
  const sizes = [400, 800, 1200, 1600];
  const srcset = sizes.map(size => {
    const optimizedUrl = getOptimizedPostImageUrl(url, { width: size });
    return `${optimizedUrl} ${size}w`;
  }).join(', ');
  
  return srcset;
}

/**
 * Optimize any Cloudinary URL with custom transformations
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url) return url;
  
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
  } = options;
  
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push('fl_progressive');
  
  return buildOptimizedUrl(url, transformations.join(','));
}
