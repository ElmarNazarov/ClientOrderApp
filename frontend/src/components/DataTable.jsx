"use client";

import React, { useEffect, useState } from "react";

const DataTable = ({ columns, data, onRowAction }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      return prev.direction === "asc" ? { key, direction: "desc" } : null;
    });
  };

  const sortedData = [...(data || [])].sort((a, b) => {
    if (!sortConfig || !sortConfig.key) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="p-4 bg-white rounded shadow-md border border-gray-200">
      {/* Поиск и управление пагинацией */}
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto"
        />
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 border border-gray-300 cursor-pointer"
                  onClick={() => data?.length > 0 && handleSort(col.key)}
                >
                  {col.label} {sortConfig?.key === col.key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
              {onRowAction && data?.length > 0 && <th className="p-3 border border-gray-300">Действия</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 border border-gray-300">
                      {row[col.key]}
                    </td>
                  ))}
                  {onRowAction && (
                    <td className="p-3 border border-gray-300 text-center">
                      <div className="flex justify-center gap-[5px]">
                        {onRowAction(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                {columns.map((col) => (
                  <td key={col.key} className="p-3 border border-gray-300">&nbsp;</td>
                ))}
                {onRowAction && <td className="p-3 border border-gray-300">&nbsp;</td>}
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Пагинация */}

      {/* Для больших экранов */}
      <div className="mt-4 hidden lg:flex justify-between items-center text-gray-700 ">
        <span className="text-sm">
          Показано {(currentPage - 1) * rowsPerPage + 1} -{" "}
          {Math.min(currentPage * rowsPerPage, filteredData.length)} из {filteredData.length} записей
        </span>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </button>

          <button
            className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {/* По 7 */}
          {(() => {
            const visiblePages = [];
            let startPage = Math.max(1, currentPage - 3);
            let endPage = Math.min(totalPages, startPage + 6);
            
            if (endPage === totalPages) {
              startPage = Math.max(1, totalPages - 6);
            }

            for (let i = startPage; i <= endPage; i++) {
              visiblePages.push(i);
            }

            return visiblePages.map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ));
          })()}

          <button
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>

          <button
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>

      {/* Для маленьких экранов */}
      <div className="mt-4 lg:hidden flex flex-col md:flex-row justify-between items-center text-gray-700 text-sm">
        <span>
          Показано {(currentPage - 1) * rowsPerPage + 1} -{" "}
          {Math.min(currentPage * rowsPerPage, filteredData.length)} из {filteredData.length} записей
        </span>
  
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            «
          </button>
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            ‹
          </button>
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            ›
          </button>
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            »
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default DataTable;
