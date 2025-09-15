import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setAuthChecked(true);
  }, []);

  return { loggedIn, authChecked };
};
