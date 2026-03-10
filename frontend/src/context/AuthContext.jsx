import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/auth/me", { withCredentials: true });
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUser(); }, []);

    const loginWithGitHub = () => { window.location.href = "/auth/github"; };
    const loginWithGoogle = () => { window.location.href = "/auth/google"; };
    const logout = () => { window.location.href = "/auth/logout"; };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGitHub, loginWithGoogle, logout, refetch: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export default AuthContext;
