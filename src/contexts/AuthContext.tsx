import React, { useState, useContext, useEffect } from "react";
import { createContext } from "react";
import { signInRequest, recoverUserInfo } from "../services/auth";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";
import { api } from "../services/api";

interface SignInData {
  email: string;
  password: string;
}

interface UserProps {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextProps {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (p: SignInData) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<UserProps | null>(null);
  const isAuthenticated = !!user;

  const signIn = async ({ email, password }: SignInData) => {
    const { token, user } = await signInRequest({ email, password });

    setCookie(undefined, "@nextauth:token", token, {
      maxAge: 60 * 60 * 1,
    });

    api.defaults.headers["Authorization"] = `Bearer ${token}`;

    setUser(user);

    Router.push("/dashboard");
  };

  const signOut = () => {
    destroyCookie(undefined, "@nextauth:token");
    Router.push("/");
  };

  const loadUserInfo = async () => {
    const { user: userData } = await recoverUserInfo();
    setUser(userData);
  };

  useEffect(() => {
    const { "@nextauth:token": token } = parseCookies();

    if (token) {
      loadUserInfo();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
