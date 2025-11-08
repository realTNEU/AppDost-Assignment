function buildOptimizedUrl(url, newTransformations) {
  if (!url || typeof url !== 'string') return url;
  
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  try {
    const uploadMatch = url.match(/(\/upload\/)(.+)$/);
    if (!uploadMatch) {
      return url;
    }
    
    const uploadPrefix = uploadMatch[1];
    const afterUpload = uploadMatch[2];
    
    const segments = afterUpload.split('/');
    const firstSegment = segments[0] || '';
    
    const isTransformations = firstSegment.includes('_') && 
      (firstSegment.includes('w_') || firstSegment.includes('h_') || 
       firstSegment.includes('c_') || firstSegment.includes('q_') || 
       firstSegment.includes('f_') || firstSegment.includes('fl_') ||
       firstSegment.includes('g_') || firstSegment.includes('dpr_'));
    
    const isVersion = /^v\d+$/.test(firstSegment);
    
    let optimizedPath;
    
    if (isTransformations) {
      optimizedPath = newTransformations + '/' + segments.slice(1).join('/');
    } else if (isVersion) {
      optimizedPath = newTransformations + '/' + afterUpload;
    } else {
      optimizedPath = newTransformations + '/' + afterUpload;
    }
    
    const baseUrl = url.substring(0, url.indexOf(uploadPrefix) + uploadPrefix.length);
    return baseUrl + optimizedPath;
    
  } catch (error) {
    console.warn('Failed to optimize Cloudinary URL, using original:', error);
    return url;
  }
}

export function getOptimizedPostImageUrl(url, options = {}) {
  if (!url) return url;
  
  const {
    width = 800,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
  } = options;
  
  const transformations = [
    `w_${width}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    'fl_progressive',
  ].join(',');
  
  return buildOptimizedUrl(url, transformations);
}

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
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
    'fl_progressive',
    'g_face',
  ].join(',');
  
  return buildOptimizedUrl(url, transformations);
}

export function getPostImageSrcSet(url) {
  if (!url) return '';
  
  const sizes = [400, 800, 1200, 1600];
  const srcset = sizes.map(size => {
    const optimizedUrl = getOptimizedPostImageUrl(url, { width: size });
    return `${optimizedUrl} ${size}w`;
  }).join(', ');
  
  return srcset;
}

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
