"use client";

import { getUserInfo } from "@/lib/apiFunctions/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.access_token) {
          try {
            const userData = await getUserInfo(parsedUser.access_token);
            setUser(userData);
          } catch (error) {
            console.error("Не удалось выполнить проверку подлинности пользователя:", error);
            localStorage.removeItem("userInfo");
            router.push("/auth/login");
          }
        } else {
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login");
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Загрузка...</h2>
      </div>
    );
  }

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
