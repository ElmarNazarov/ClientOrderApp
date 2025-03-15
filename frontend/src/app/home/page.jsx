"use client";
import { useUser } from "@/context/UserContext";

export default function HomePage() {
  const user = useUser().user;

  if (!user) {
    // До того как информация о пользователе пришла
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <h3 className="text-lg sm:text-2xl text-center font-bold">
          Загрузка пользовательских данных...
        </h3>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <h1 className="text-lg sm:text-2xl text-center font-bold">
        Добро пожаловать, {user.email}!
      </h1>
    </div>
  );
}