"use client";

import { useState, useEffect } from "react";
import AddClientModal from "@/components/AddClientModal";
import EditClientModal from "@/components/EditClientModal";
import DataTable from "@/components/DataTable";
import { getClients, createClient, updateClient } from "@/lib/apiFunctions/clients";
import { FaCog } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Ошибка выборки клиентов:", error);
      toast.error("Ошибка загрузки списка клиентов!");
    }
  };

  const handleAddClient = async (clientData) => {
    try {
      await createClient(clientData);
      setIsAddModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Ошибка добавления клиента:", error);
      toast.error("Ошибка при добавлении клиента!");
    }
  };

  const handleEditClient = async (updatedData) => {
    try {
      await updateClient(selectedClient.id, updatedData);
      setIsEditModalOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Ошибка обновления клиента:", error);
      toast.error("Ошибка при обновлении информации о клиенте!");
    }
  };

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 sm:flex-nowrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Клиенты</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 w-full sm:w-auto bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Добавить клиента
        </button>
      </div>

      {/* Таблица клиентов */}
      <DataTable
        columns={[
          { key: "name", label: "Название" },
          { key: "created_at", label: "Дата создания" },
        ]}
        data={filteredClients}
        onRowAction={(client) => (
          <FaCog
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => handleEditClick(client)}
          />
        )}
      />

      {/* Модальное окно добавления клиента */}
      <AddClientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddClient={handleAddClient} />

      {/* Модальное окно редактирования клиента */}
      {selectedClient && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          client={selectedClient}
          onEditClient={handleEditClient}
        />
      )}
    </div>
  );
}
