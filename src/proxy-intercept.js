// Store the original fetch
const originalFetch = window.fetch;

// Override fetch globally
window.fetch = async function(resource, options = {}) {
  let url = resource;
  
  // Only modify relative URLs (starting with /api or /auth)
  if (typeof resource === 'string' && (resource.startsWith('/api') || resource.startsWith('/auth'))) {
    if (import.meta.env.PROD) {
      // In production: prepend backend URL
      url = `https://mtlsse-api.onrender.com${resource}`;
    }
    // In development: keep as is (Vite proxy will handle it)
  }
  
  // Add credentials for all requests
  const modifiedOptions = {
    ...options,
    credentials: 'include', // Important for Flask sessions
  };
  
  return originalFetch(url, modifiedOptions);
};

// Also override for Request objects
const originalRequest = Request;
window.Request = class CustomRequest extends originalRequest {
  constructor(input, init) {
    let modifiedInput = input;
    
    if (typeof input === 'string' && (input.startsWith('/api') || input.startsWith('/auth'))) {
      if (import.meta.env.PROD) {
        modifiedInput = `https://mtlsse-api.onrender.com${input}`;
      }
    }
    
    super(modifiedInput, { ...init, credentials: 'include' });
  }
};
