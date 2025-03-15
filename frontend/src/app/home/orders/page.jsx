"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import AddOrderModal from "@/components/AddOrderModal";
import EditOrderModal from "@/components/EditOrderModal";
import { getOrders, createOrder, updateOrder } from "@/lib/apiFunctions/orders";
import { getClients } from "@/lib/apiFunctions/clients";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusTranslations = {
    not_collected: "Не забран",
    ready_for_pickup: "Готов к выдаче",
    shipped: "Доставлено"
  };
  const statusTranslationsReverse = {
    "Не забран": "not_collected",
    "Готов к выдаче": "ready_for_pickup",
    "Доставлено": "shipped"
  };
  
  const fetchOrders = async () => {
    try {
      const [ordersData, clientsData] = await Promise.all([
        getOrders(),
        getClients()
      ]);
  
      // Создание словаря клиентов для быстрого поиска
      const clientMap = {};
      clientsData.forEach(client => {
        clientMap[client.id] = client.name;
      });
  
      // Трансформация заказов: добавление имени клиента и переведенного статуса
      const transformedOrders = ordersData.map(order => ({
        ...order,
        client_name: clientMap[order.client_id] || "Неизвестный клиент",
        status: order.status,
        status_translated: statusTranslations[order.status] || order.status,
        total_amount: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        first_product_name: order.items.length > 0 ? order.items[0].product_name : "—",
        total_quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
      }));
  
      setOrders(transformedOrders);
    } catch (error) {
      console.error("Ошибка выборки заказов:", error);
      toast.error("Ошибка при загрузке заказов");
    }
  };
  

  const handleAddOrder = async (orderData) => {
    try {
      console.log(orderData)
      await createOrder(orderData);
      setIsAddModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Ошибка добавления заказа:", error);
      toast.error("Ошибка при добавлении заказа!");
    }
  };

  const handleEditOrder = async (updatedData) => {
    try {
      if (!selectedOrder) {
        console.error("Ошибка: Нет выбранного заказа");
        toast.error("Ошибка: Нет выбранного заказа");
        return;
      }
    
      const existingItem = selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items[0] : {};
  
      // Convert translated status to backend status
      const updatedStatus = statusTranslationsReverse[updatedData.status] || updatedData.status; // Fix here
  
      
      const fullUpdatedOrder = {
        client_id: updatedData.client_id ?? selectedOrder.client_id,
        status: updatedStatus,
        items: [
          {
            supplier: updatedData.supplier ?? existingItem.supplier ?? "",
            client_id: updatedData.client_id ?? selectedOrder.client_id,
            product_name: updatedData.product_name ?? existingItem.product_name ?? "",
            country: updatedData.country ?? existingItem.country ?? "",
            quantity: updatedData.quantity !== undefined ? updatedData.quantity : existingItem.quantity || 0,
            price: updatedData.price !== undefined ? updatedData.price : existingItem.price || 0,
          },
        ],
      };
  
      await updateOrder(selectedOrder.id, fullUpdatedOrder);
      setIsEditModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error("Ошибка обновления заказа:", error.response?.data || error.message);
      toast.error("Ошибка обновления заказа!");
    }
  };
  
  
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const filteredOrders = orders.filter((order) =>
    (order.client?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 sm:flex-nowrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Заказы</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 w-full sm:w-auto bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Новый заказ
        </button>
      </div>

      {/* Таблица заказов */}
      <DataTable
        columns={[
          { key: "order_number", label: "№ заказа" },
          { key: "order_date", label: "Дата" },
          { key: "status_translated", label: "Статус" },
          { key: "client_name", label: "Клиент" },
          { key: "items_count", label: "Кол-во" },
          { key: "total_amount", label: "Сумма" },
        ]}
        data={filteredOrders}
        onRowAction={(order) => (
          <FaEdit
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => handleEditClick(order)}
          />
        )}
      />

      {/* Модальное окно добавления заказа */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrder={handleAddOrder}
      />

      {/* Модальное окно редактирования заказа */}
      {selectedOrder && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          order={selectedOrder}
          onEditOrder={handleEditOrder}
        />
      )}
    </div>
  );
}
