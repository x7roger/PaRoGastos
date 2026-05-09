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

const AppContent = () => {
  const { currentUser, currentTab, isAddExpenseOpen } = useAppContext();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 relative overflow-hidden shadow-2xl sm:border sm:border-slate-200">
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {currentTab === "dashboard" && <Dashboard />}
        {currentTab === "history" && <History />}
        {currentTab === "settings" && <Settings />}
      </main>

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
