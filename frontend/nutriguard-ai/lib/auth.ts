// lib/auth.ts
export const setAuthToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

export const setUserId = (id: number) => {
  localStorage.setItem("user_id", id.toString());
};

export const getUserId = () => {
  return parseInt(localStorage.getItem("user_id") || "0");
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
};
