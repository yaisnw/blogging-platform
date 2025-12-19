import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

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
  
    const user = useSelector((state: RootState) => state.auth.user);
    const token = localStorage.getItem("token");

    const hasValidToken = token && !isTokenExpired(token);
    const hasUserData = user && user.id !== 0;

    const loggedIn = !!(hasValidToken && hasUserData);
    
    // authChecked is true once we've at least checked the token
    const authChecked = true; 

    return { loggedIn, authChecked };
};