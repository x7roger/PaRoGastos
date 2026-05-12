import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { formatCurrency } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Expense } from '../types';

export const History = () => {
  const { expenses, users, deleteExpense, isOnline, currentUser } = useAppContext();
  const [filterUser, setFilterUser] = useState<string | null>(null);

  const filteredExpenses = filterUser 
    ? expenses.filter(e => e.paidById === filterUser)
    : expenses;

  // Group by date (e.g., '15 de Agosto')
  const grouped = filteredExpenses.reduce<Record<string, typeof expenses>>((acc, e) => {
    const d = new Date(e.date + 'T00:00:00');
    const dateKey = format(d, "dd 'de' MMMM", { locale: ptBR });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(e);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-8">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Histórico</h2>
          <div className="flex items-center gap-2">
            {!isOnline && <span className="text-[10px] font-medium text-rose-500">Offline</span>}
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse-slow' : 'bg-rose-500'}`} />
          </div>
        </div>
        
        {/* User Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setFilterUser(null)}
            className={`px-4 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!filterUser ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
          >
            Todos
          </button>
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => setFilterUser(u.id)}
              className={`px-4 min-h-[44px] rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${filterUser === u.id ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600'}`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: u.color }} />
              {u.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {Object.entries(grouped).length === 0 ? (
          <div className="text-center py-12 text-slate-400">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <p>Nenhum gasto encontrado.</p>
          </div>
        ) : (
          (Object.entries(grouped) as [string, Expense[]][]).map(([dateLabel, dayExpenses]) => (
            <div key={dateLabel} className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
                {dateLabel}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                <AnimatePresence>
                  {dayExpenses.map(e => {
                    const payer = users.find(u => u.id === e.paidById);
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        key={e.id} 
                        className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group"
                      >
                        {/* Icon */}
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                          style={{ backgroundColor: `${e.categoryColor}20`, color: e.categoryColor }}
                        >
                          {e.categoryIcon}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{e.subcategory}</p>
                          <p className="text-xs text-slate-500 truncate">{e.categoryName} {e.description ? `• ${e.description}` : ''}</p>
                        </div>
                        
                        {/* Amount & Actions */}
                        <div className="text-right flex items-center gap-3 shrink-0">
                          <div>
                            <p className="font-bold text-slate-800">{formatCurrency(e.amount)}</p>
                            <p className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-0.5 font-medium">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payer?.color }} />
                              {payer?.name}
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              if (window.confirm('Excluir este gasto?')) {
                                deleteExpense(e.id);
                              }
                            }}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-rose-500 bg-rose-50 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

