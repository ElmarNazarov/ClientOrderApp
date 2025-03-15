"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Главная", path: "/home" },
    { name: "Заказы", path: "/home/orders" },
    { name: "Магазины", path: "/home/clients" },
    { name: "Логистика", path: "/home/#" },
    { name: "Бухгалтерия", path: "/home/#" },
    { name: "Заборы", path: "/home/#" },
    { name: "Отправки", path: "/home/#" },
    { name: "Товары", path: "/home/#" },
    { name: "Аналитика", path: "/home/#" },
    { name: "Поставщики", path: "/home/#" },
    { name: "Снятия", path: "/home/#" },
    { name: "Закупка", path: "/home/#" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col space-y-5 h-screen p-5">
      <div className="w-full px-10 flex items-center justify-center overflow-hidden">
          <img
            src="https://picsum.photos/200"
            alt="User"
            className="w-full h-full object-cover"
          />
      </div>
      <div className="w-full h-1 rounded bg-gray-200"></div>
      <div>
        <ul className="space-y-2 text-lg">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-6 py-2 rounded ${
                  pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
