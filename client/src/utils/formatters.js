
// Format date to relative time
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

// Format date to readable string
export const formatFullDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Calculate reading time from text
export const calculateReadingTime = (text) => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Format reading time
export const formatReadingTime = (minutes) => {
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Format number with commas
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format rating to display
export const formatRating = (rating) => {
  return Number(rating).toFixed(1);
};

// Generate star rating display
export const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
};

// Format percentage
export const formatPercentage = (value, total) => {
  if (total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
};

// Slugify text for URLs
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Parse error message from API
export const parseErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Get random color for avatars
export const getRandomColor = () => {
  const colors = [
    '#21808D', // teal
    '#E68161', // orange
    '#5E5240', // brown
    '#626C71', // slate
    '#134252', // dark slate
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default {
  formatDate,
  formatFullDate,
  truncateText,
  calculateReadingTime,
  formatReadingTime,
  getInitials,
  formatNumber,
  formatRating,
  getStarRating,
  formatPercentage,
  slugify,
  parseErrorMessage,
  formatFileSize,
  isValidEmail,
  getRandomColor
};
