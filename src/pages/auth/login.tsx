import { useEffect } from "react";
import { useLocation } from "wouter";

/** @deprecated Use /auth hub or /auth/login/youth */
export default function Login() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/auth");
  }, [setLocation]);
  return null;
}
