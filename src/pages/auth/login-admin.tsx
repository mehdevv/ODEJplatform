import { useEffect } from "react";
import { useLocation } from "wouter";

/** Redirect legacy admin login URL to the dedicated portal */
export default function LoginAdmin() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/portal");
  }, [setLocation]);
  return null;
}
