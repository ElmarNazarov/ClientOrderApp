"use client";

import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/auth/login");
  };

  return (
    <header className="bg-gray-100 text-gray-700 shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
      >
        Выход
      </button>
      <div className="flex flex-row items-center space-x-2 font-bold text-[20px] h-10">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <img
            src="https://picsum.photos/40" // Replace with actual user image URL
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="self-center">Тестовый Пользователь</span>
      </div>
    </header>
  );
};

export default Header;
