import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/home"); // Перенаправляет пользователей на домашнюю страницу
}
