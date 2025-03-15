"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getClients } from "@/lib/apiFunctions/clients"; // Fetch clients API

const AddOrderModal = ({ isOpen, onClose, onAddOrder }) => {
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [product, setProduct] = useState({
    supplier: "",
    product_name: "",
    country: "",
    quantity: "",
    price: "",
  });

  // Получаем клиентов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Ошибка загрузки клиентов:", error);
    }
  };

  const handleProductChange = (field, value) => {
    setProduct((prevProduct) => ({ ...prevProduct, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientId || !product.supplier || !product.product_name || !product.country || !product.quantity || !product.price) {
      toast.error("Заполните все обязательные поля!");
      return;
    }
  
    const orderData = {
      client_id: clientId,
      items: [
        {
          supplier: product.supplier,
          client_id: clientId,
          product_name: product.product_name,
          country: product.country,
          quantity: Number(product.quantity),
          price: Number(product.price),
        },
      ],
    };
  
    onAddOrder(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[500px]">
        <h2 className="text-xl font-bold mb-4">Создать заказ</h2>

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
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Клиент *
            </label>
          </div>

          {/* Товар (Product) */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
            <h3 className="text-lg font-semibold mb-2">Товар</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Поставщик */}
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  id="supplier"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.supplier}
                  onChange={(e) => handleProductChange("supplier", e.target.value)}
                />
                <label
                  htmlFor="supplier"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Поставщик
                </label>
              </div>

              {/* Страна */}
              <div className="relative z-0 w-full group">
                <select
                  id="country"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={product.country}
                  onChange={(e) => handleProductChange("country", e.target.value)}
                  required
                >
                  <option value="">Выберите</option>
                  <option value="EU">EU</option>
                  <option value="US">US</option>
                  <option value="CN">CN</option>
                  <option value="RU">RU</option>
                </select>
                <label
                  htmlFor="country"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Страна *
                </label>
              </div>
            </div>

            {/* Наименование товара */}
            <div className="relative z-0 w-full group mt-4">
              <input
                type="text"
                id="name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={product.product_name}
                onChange={(e) => handleProductChange("product_name", e.target.value)}
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Наименование *
              </label>
            </div>

            {/* Количество и Цена */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  id="quantity"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.quantity}
                  onChange={(e) => handleProductChange("quantity", e.target.value.replace(/\D/g, ""))}
                  required
                />
                <label
                  htmlFor="quantity"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Количество *
                </label>
              </div>

              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  id="price"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={product.price}
                  onChange={(e) => handleProductChange("price", e.target.value.replace(/\D/g, ""))}
                  required
                />
                <label
                  htmlFor="price"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-100 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Цена *
                </label>
              </div>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex justify-center gap-[5px]">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400 transition">Отмена</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition">Создать заказ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
