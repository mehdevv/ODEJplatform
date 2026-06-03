import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCurrentUser,
  useLogin,
  useRegister,
  useRegisterClub,
  useLogout,
  getPostLoginPath,
} from "@/lib/api";
import type { User, LoginInput, RegisterInput, RegisterClubInput } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<string>;
  register: (data: RegisterInput) => Promise<string>;
  registerClub: (data: RegisterClubInput) => Promise<string>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("odej_token") : null,
  );
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useGetCurrentUser({
    query: {
      enabled: !!token,
      retry: false,
    },
  });

  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("odej_token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const registerClubMutation = useRegisterClub();
  const logoutMutation = useLogout();

  const login = async (data: LoginInput) => {
    const res = await loginMutation.mutateAsync({ data });
    localStorage.setItem("odej_token", res.token);
    setToken(res.token);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    await refetch();
    return getPostLoginPath(res.user);
  };

  const register = async (data: RegisterInput) => {
    const res = await registerMutation.mutateAsync({ data });
    localStorage.setItem("odej_token", res.token);
    setToken(res.token);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    await refetch();
    return getPostLoginPath(res.user);
  };

  const registerClub = async (data: RegisterClubInput) => {
    const res = await registerClubMutation.mutateAsync({ data });
    localStorage.setItem("odej_token", res.token);
    setToken(res.token);
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    await refetch();
    return getPostLoginPath(res.user);
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      localStorage.removeItem("odej_token");
      setToken(null);
      queryClient.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        login,
        register,
        registerClub,
        logout,
        refreshUser: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { getPostLoginPath };
