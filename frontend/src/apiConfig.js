/**
 * Centralized API configuration for the AI PDF Reader application.
 * This handles the base URL for both development and production environments.
 */

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || 
  "https://ai-pdf-reader-4.onrender.com";

export default API_BASE_URL;
