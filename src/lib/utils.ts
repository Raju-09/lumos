/**
 * Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, differenceInHours, differenceInMinutes, differenceInDays } from 'date-fns';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date utilities
 */
export const dateUtils = {
  /**
   * Format date to readable string
   */
  format: (date: Date | string, formatStr: string = 'PPP') => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, formatStr);
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  relative: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  },

  /**
   * Check if date is in past
   */
  isPast: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d < new Date();
  },

  /**
   * Get countdown info for a future date
   */
  getCountdown: (targetDate: Date | string) => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const now = new Date();

    if (target < now) {
      return { expired: true, text: 'Expired', urgent: false };
    }

    const days = differenceInDays(target, now);
    const hours = differenceInHours(target, now) % 24;
    const minutes = differenceInMinutes(target, now) % 60;

    let text = '';
    let urgent = false;

    if (days > 0) {
      text = `${days}d ${hours}h`;
      urgent = days === 0;
    } else if (hours > 0) {
      text = `${hours}h ${minutes}m`;
      urgent = hours < 6;
    } else {
      text = `${minutes}m`;
      urgent = true;
    }

    return { expired: false, text, urgent, days, hours, minutes };
  },
};

/**
 * Number formatting utilities
 */
export const numberUtils = {
  /**
   * Format number as Indian currency
   */
  formatCurrency: (amount: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  },

  /**
   * Format as LPA (Lakhs Per Annum)
   */
  formatLPA: (lpa: number) => {
    return `${lpa.toFixed(2)} LPA`;
  },

  /**
   * Format large numbers with K, M suffixes
   */
  formatCompact: (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  },

  /**
   * Format percentage
   */
  formatPercentage: (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Calculate percentage
   */
  calculatePercentage: (part: number, total: number) => {
    if (total === 0) return 0;
    return (part / total) * 100;
  },
};

/**
 * String utilities
 */
export const stringUtils = {
  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  /**
   * Generate initials from name
   */
  getInitials: (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  /**
   * Capitalize first letter
   */
  capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert to title case
   */
  toTitleCase: (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Slugify string
   */
  slugify: (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
};

/**
 * File utilities
 */
export const fileUtils = {
  /**
   * Format file size
   */
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get file extension
   */
  getExtension: (filename: string) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  /**
   * Validate file type
   */
  isValidFileType: (filename: string, allowedTypes: string[]) => {
    const ext = fileUtils.getExtension(filename).toLowerCase();
    return allowedTypes.includes(ext);
  },

  /**
   * Validate file size
   */
  isValidFileSize: (size: number, maxSizeMB: number) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return size <= maxBytes;
  },
};

/**
 * Array utilities
 */
export const arrayUtils = {
  /**
   * Group array by key
   */
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  },

  /**
   * Remove duplicates
   */
  unique: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  /**
   * Shuffle array
   */
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

/**
 * Validation utilities
 */
export const validationUtils = {
  /**
   * Validate email
   */
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (Indian)
   */
  isValidPhone: (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  /**
   * Validate CGPA
   */
  isValidCGPA: (cgpa: number) => {
    return cgpa >= 0 && cgpa <= 10;
  },

  /**
   * Validate URL
   */
  isValidURL: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Local storage utilities with type safety
 */
export const storageUtils = {
  /**
   * Get item from localStorage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  /**
   * Set item in localStorage
   */
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Color utilities
 */
export const colorUtils = {
  /**
   * Get status color based on application status
   */
  getStatusColor: (status: string) => {
    const colors: Record<string, string> = {
      Applied: 'blue',
      'Under Review': 'yellow',
      Shortlisted: 'purple',
      'Test Scheduled': 'orange',
      'Test Completed': 'cyan',
      'Interview Scheduled': 'indigo',
      'Interview Completed': 'teal',
      'Offer Extended': 'green',
      'Offer Accepted': 'emerald',
      'Offer Declined': 'gray',
      Rejected: 'red',
      Withdrawn: 'slate',
      'On Hold': 'amber',
    };
    return colors[status] || 'gray';
  },

  /**
   * Get CGPA color (red < 7, yellow 7-8, green > 8)
   */
  getCGPAColor: (cgpa: number) => {
    if (cgpa >= 8) return 'green';
    if (cgpa >= 7) return 'yellow';
    return 'red';
  },
};

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = ''): string {
  const random = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
