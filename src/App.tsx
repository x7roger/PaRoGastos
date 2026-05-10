/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useAppContext } from "./lib/context";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { History } from "./components/History";
import { Settings } from "./components/Settings";
import { AddExpense } from "./components/AddExpense";
import { Navigation } from "./components/Navigation";
import { Plus } from "lucide-react";
import { motion } from "motion/react";

const AppContent = () => {
  const { currentUser, currentTab, isAddExpenseOpen } = useAppContext();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden sm:border sm:border-slate-200">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {currentTab === "dashboard" && <Dashboard />}
        {currentTab === "history" && <History />}
        {currentTab === "settings" && <Settings />}
      </main>

      {/* FAB - Fixed Bottom Right */}
      {currentTab === "dashboard" && (
        <motion.button 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAddExpenseOpen(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 rounded-2xl flex justify-center items-center text-white shadow-xl shadow-indigo-200 z-40 border-2 border-white/20"
        >
          <Plus size={28} />
        </motion.button>
      )}

      <Navigation />

      {isAddExpenseOpen && (
        <div className="absolute inset-0 z-50">
          <AddExpense />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
