const TOKEN_KEY = "authToken"; // 🔐 Consistent key naming

/**
 * 🏷 Store JWT Token in localStorage
 */
export const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 🔑 Retrieve JWT Token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * ❌ Logout & Remove Token
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login"; // Redirect to login page
};

/**
 * ✅ Check if Token Exists & is Valid
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Returns `true` if token exists
};