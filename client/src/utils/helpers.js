

// // Truncate text with ellipsis
// export const truncateText = (text, maxLength = 100) => {
//   if (!text || typeof text !== 'string') return '';
  
//   if (text.length <= maxLength) return text;
  
//   return text.substring(0, maxLength).trim() + '...';
// };

// // Capitalize first letter
// export const capitalize = (text) => {
//   if (!text || typeof text !== 'string') return '';
  
//   return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
// };

// // Convert to title case
// export const toTitleCase = (text) => {
//   if (!text || typeof text !== 'string') return '';
  
//   return text
//     .toLowerCase()
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// // Generate random string
// export const generateRandomString = (length = 8) => {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
  
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
  
//   return result;
// };

// // Generate UUID v4
// export const generateUUID = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0;
//     const v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

// // Deep clone object
// export const deepClone = (obj) => {
//   if (obj === null || typeof obj !== 'object') return obj;
//   if (obj instanceof Date) return new Date(obj.getTime());
//   if (obj instanceof Array) return obj.map(item => deepClone(item));
//   if (typeof obj === 'object') {
//     const cloned = {};
//     Object.keys(obj).forEach(key => {
//       cloned[key] = deepClone(obj[key]);
//     });
//     return cloned;
//   }
// };

// // Check if object is empty
// export const isEmpty = (obj) => {
//   if (obj === null || obj === undefined) return true;
//   if (Array.isArray(obj)) return obj.length === 0;
//   if (typeof obj === 'object') return Object.keys(obj).length === 0;
//   if (typeof obj === 'string') return obj.trim().length === 0;
//   return false;
// };

// // Debounce function
// export const debounce = (func, wait) => {
//   let timeout;
  
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
    
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// };

// // Throttle function
// export const throttle = (func, limit) => {
//   let inThrottle;
  
//   return function executedFunction(...args) {
//     if (!inThrottle) {
//       func.apply(this, args);
//       inThrottle = true;
//       setTimeout(() => inThrottle = false, limit);
//     }
//   };
// };

// // Get file extension
// export const getFileExtension = (filename) => {
//   if (!filename || typeof filename !== 'string') return '';
  
//   return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
// };

// // Format file size
// export const formatFileSize = (bytes) => {
//   if (bytes === 0) return '0 Bytes';
  
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };



// // Sleep function for async/await
// export const sleep = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// };

// // Get browser info
// export const getBrowserInfo = () => {
//   const { userAgent } = navigator;
  
//   let browser = 'Unknown';
//   let version = 'Unknown';
  
//   if (userAgent.includes('Chrome')) {
//     browser = 'Chrome';
//     version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
//   } else if (userAgent.includes('Firefox')) {
//     browser = 'Firefox';
//     version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
//   } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
//     browser = 'Safari';
//     version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
//   } else if (userAgent.includes('Edge')) {
//     browser = 'Edge';
//     version = userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || 'Unknown';
//   }
  
//   return { browser, version };
// };