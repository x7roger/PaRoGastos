import { LayoutGrid, ListTodo, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { cn } from '../lib/utils';

export const Navigation = () => {
  const { currentTab, setTab } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-14 flex justify-between items-stretch z-40 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <button 
        onClick={() => setTab('dashboard')}
        className={cn("flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px]", currentTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <LayoutGrid size={24} />
        <span className="text-[10px] font-bold">Início</span>
      </button>

      <button 
        onClick={() => setTab('history')}
        className={cn("flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px]", currentTab === 'history' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <ListTodo size={24} />
        <span className="text-[10px] font-bold">Histórico</span>
      </button>

      <button 
        onClick={() => setTab('settings')}
        className={cn("flex-1 flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px]", currentTab === 'settings' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <SettingsIcon size={24} />
        <span className="text-[10px] font-bold">Ajustes</span>
      </button>
    </div>
  );
};
