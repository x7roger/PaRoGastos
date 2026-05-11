import { LayoutGrid, ListTodo, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { cn } from '../lib/utils';

export const Navigation = () => {
  const { currentTab, setTab } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 h-14 flex justify-between items-center z-40 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <button 
        onClick={() => setTab('dashboard')}
        className={cn("flex flex-col items-center gap-1 transition-colors", currentTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <LayoutGrid size={22} />
        <span className="text-[10px] font-bold">Início</span>
      </button>

      <button 
        onClick={() => setTab('history')}
        className={cn("flex flex-col items-center gap-1 transition-colors", currentTab === 'history' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <ListTodo size={22} />
        <span className="text-[10px] font-bold">Histórico</span>
      </button>

      <button 
        onClick={() => setTab('settings')}
        className={cn("flex flex-col items-center gap-1 transition-colors", currentTab === 'settings' ? 'text-indigo-600' : 'text-slate-400')}
      >
        <SettingsIcon size={22} />
        <span className="text-[10px] font-bold">Ajustes</span>
      </button>
    </div>
  );
};
