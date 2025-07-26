import { useAppDispatch } from "@/hooks";
import { setTokenData } from "@/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface MyToken {
    id: number;
    username: string;
    email: string;
    exp?: number;
    iat?: number;
}


export const useJwtAuth = () => {
    const dispatch = useAppDispatch();
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<MyToken | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<MyToken>(token);
                dispatch(setTokenData({
                    id: decoded.id,
                    username: decoded.username,
                    email: decoded.email
                }));
                setUser(decoded);
                setLoggedIn(true);
            } catch (err) {
                console.error("Failed to decode token:", err);
                setLoggedIn(false);
                setUser(null);
            }
        } else {
            setLoggedIn(false);
            setUser(null);
        }
        setAuthChecked(true)
    }, [dispatch])
    return { loggedIn, user, authChecked }
}