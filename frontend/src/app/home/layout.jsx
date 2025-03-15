"use client";

import React from "react";
import { UserProvider } from "@/context/UserContext"; // Import UserProvider
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function HomeLayout({ children }) {
  return (
    <UserProvider>
      <ProtectedRoute>
        <div className="flex flex-col md:flex-row h-full md:h-screen min-h-0 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
              {children}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </UserProvider>
  );
}
