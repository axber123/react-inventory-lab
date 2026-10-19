import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { login as loginRequest } from "@/api/authApi";
import type { AuthUser, LoginInput } from "@/types";

type AuthContextValue = {
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem("user");
    if (!saved) return null;

    try {
      return JSON.parse(saved) as AuthUser;
    } catch {
      sessionStorage.removeItem("user");
      return null;
    }
  });

  async function login(input: LoginInput) {
    const response = await loginRequest(input);
    setUser(response.user);
    sessionStorage.setItem("user", JSON.stringify(response.user));
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem("user");
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth 必须在 <AuthProvider> 内部使用");
  }

  return context;
}
