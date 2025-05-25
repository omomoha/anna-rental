import { useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth(role?: string) {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else if (role) {
        const userRole = localStorage.getItem("userRole");
        if (userRole !== role) {
          router.replace("/auth/login");
        }
      }
    });
    return () => unsubscribe();
  }, [router, role]);
} 