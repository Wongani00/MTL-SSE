// const API_BASE = import.meta.env.VITE_API_URL;

// // original fetch
// const originalFetch = window.fetch;

// // Override fetch globally
// window.fetch = function (url, options = {}) {
//   // If URL starts with "/api" or "/auth", replace it with full backend URL
//   if (typeof url === "string" && (url.startsWith("/api") || url.startsWith("/auth"))) {
//     url = API_BASE + url;
//   }

//   return originalFetch(url, options);
// };


// Hard-coded API base URL
const API_BASE = "https://mtlsse-api.onrender.com".replace(/\/$/, "");

// original fetch
const originalFetch = window.fetch;

// Override fetch globally
window.fetch = function (url, options = {}) {
  if (typeof url === "string" && (url.startsWith("/api") || url.startsWith("/auth"))) {
    url = API_BASE + url; // Safe concatenation
  }

  return originalFetch(url, options);
};
