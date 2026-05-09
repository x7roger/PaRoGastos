import { LayoutGrid, ListTodo, Settings as SettingsIcon, Plus } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const Navigation = () => {
  const { currentTab, setTab, setIsAddExpenseOpen, isAddExpenseOpen } = useAppContext();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 pb-safe">
      <button 
        onClick={() => setTab('dashboard')}
        className={cn("flex flex-col items-center gap-1 transition-colors", currentTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <LayoutGrid size={24} />
        <span className="text-[10px] font-medium">Início</span>
      </button>

      <button 
        onClick={() => setTab('history')}
        className={cn("flex flex-col items-center gap-1 transition-colors", currentTab === 'history' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <ListTodo size={24} />
        <span className="text-[10px] font-medium">Histórico</span>
      </button>

      <div className="relative -top-6">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAddExpenseOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex justify-center items-center text-white shadow-lg shadow-indigo-200 border-4 border-slate-50"
        >
          <Plus size={28} />
        </motion.button>
      </div>

      <button 
        onClick={() => setTab('settings')}
        className={cn("flex flex-col items-center gap-1 transition-colors", currentTab === 'settings' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <SettingsIcon size={24} />
        <span className="text-[10px] font-medium">Ajustes</span>
      </button>
    </div>
  );
};
