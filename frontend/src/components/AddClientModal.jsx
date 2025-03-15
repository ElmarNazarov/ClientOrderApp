"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const AddClientModal = ({ isOpen, onClose, onAddClient }) => {
  const [name, setName] = useState("");
  const [telegramGroupId, setTelegramGroupId] = useState("");
  const [balance, setBalance] = useState("");
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");

  const handleNumericChange = (setter) => (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setter(value);
  };

  const resetForm = () => {
    setName("");
    setTelegramGroupId("");
    setBalance("");
    setRegion("");
    setPhone("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !telegramGroupId || !balance) {
      toast.error("Заполните все обязательные поля!");
      return;
    }

    onAddClient({
      name,
      telegram_group_id: telegramGroupId,
      initial_balance: balance,
      region,
      phone,
    });

    toast.success("Клиент успешно добавлен!");

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Добавить клиента</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Название */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Название *
            </label>
          </div>

          {/* ID группы Telegram */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="telegramGroupId"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={telegramGroupId}
              onChange={handleNumericChange(setTelegramGroupId)}
              required
            />
            <label
              htmlFor="telegramGroupId"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              ID группы Telegram *
            </label>
          </div>

          {/* Входящий баланс */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="balance"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={balance}
              onChange={handleNumericChange(setBalance)}
              required
            />
            <label
              htmlFor="balance"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Входящий баланс *
            </label>
          </div>

          {/* Регион */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="region"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <label
              htmlFor="region"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Регион
            </label>
          </div>

          {/* Телефон */}
          <div className="relative z-0 w-full group">
            <input
              type="text"
              id="phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label
              htmlFor="phone"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Телефон
            </label>
          </div>

          {/* Кнопки управления */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400 transition"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
