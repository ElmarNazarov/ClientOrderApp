"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getClients } from "@/lib/apiFunctions/clients"; // Fetch clients API

const EditOrderModal = ({ isOpen, onClose, order, onEditOrder }) => {
  const [clientId, setClientId] = useState(order?.client_id || "");
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState(order?.status || "не собран");
  const [products, setProducts] = useState(order?.products || []);

  // Получаем клиентов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchClients();
      setClientId(order?.client_id || "");
      setProducts(order?.products || []);
      setStatus(order?.status || "не собран");
    }
  }, [isOpen, order]);

  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Ошибка загрузки клиентов:", error);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleSubmit = (e) => {

    console.log("Status before sending:", status);
    e.preventDefault();
    if (!clientId || products.some((p) => !p.name || !p.country || !p.quantity || !p.price)) {
      toast.error("Заполните все обязательные поля!");
      return;
    }

    onEditOrder({ client_id: clientId, status, products });
    toast.success("Заказ успешно обновлен!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Редактировать заказ</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Клиент (Dropdown) */}
          <div className="relative z-0 w-full group">
            <select
              id="client"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">Выберите клиента</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="client"
              className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
            >
              Клиент *
            </label>
          </div>

          {/* Статус (Dropdown) */}
          <div className="relative z-0 w-full group">
            <select
              id="status"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="not_collected">Не собран</option>
              <option value="ready_for_pickup">Готов к выдаче</option>
              <option value="shipped">Отправлен</option>
            </select>
            <label
              htmlFor="status"
              className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
            >
              Статус *
            </label>
          </div>

          {/* Продукты */}
          {products.map((product, index) => (
            <div key={index} className="grid grid-cols-5 gap-2">
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  id={`supplier_${index}`}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.supplier}
                  onChange={(e) => handleProductChange(index, "supplier", e.target.value)}
                />
                <label
                  htmlFor={`supplier_${index}`}
                  className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                >
                  Поставщик
                </label>
              </div>

              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  id={`name_${index}`}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.name}
                  onChange={(e) => handleProductChange(index, "name", e.target.value)}
                  required
                />
                <label
                  htmlFor={`name_${index}`}
                  className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                >
                  Наименование *
                </label>
              </div>

              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  id={`quantity_${index}`}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value.replace(/\D/g, ""))}
                  required
                />
                <label
                  htmlFor={`quantity_${index}`}
                  className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 -z-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                >
                  Кол-во *
                </label>
              </div>
            </div>
          ))}

          {/* Кнопки управления */}
          <div className="flex justify-center gap-[5px]">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400 transition">Отмена</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
