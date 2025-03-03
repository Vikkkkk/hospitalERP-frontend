export const storeToken = (token: string) => {
    localStorage.setItem("auth_token", token);
  };
  
  export const getToken = () => {
    return localStorage.getItem("auth_token");
  };
  
  export const logout = () => {
    localStorage.removeItem("auth_token");
  };
  