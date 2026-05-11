import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { formatCurrency } from '../lib/utils';
import { User } from '../types';

export const Dashboard = () => {
  const { expenses, currentUser, users } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewBy, setViewBy] = useState<'category' | 'subcategory'>('category');

  // Filter expenses by current month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
    });
  }, [expenses, currentMonth]);

  // KPIs
  const totalSpent = useMemo(() => monthlyExpenses.reduce((acc, e) => acc + e.amount, 0), [monthlyExpenses]);
  const mySpent = useMemo(() => monthlyExpenses.filter(e => e.paidById === currentUser?.id).reduce((acc, e) => acc + e.amount, 0), [monthlyExpenses, currentUser]);
  const othersSpent = totalSpent - mySpent;

  // Chart Data: Category or Subcategory
  const chartData = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    
    monthlyExpenses.forEach(e => {
      const key = viewBy === 'category' ? e.categoryId : e.subcategory;
      const name = viewBy === 'category' ? e.categoryName : e.subcategory;
      const color = viewBy === 'category' ? e.categoryColor : '#6366f1'; // fallback color for sub

      if (!map.has(key)) {
        map.set(key, { name, value: 0, color });
      }
      map.get(key)!.value += e.amount;
    });

    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [monthlyExpenses, viewBy]);

  const topCategoryName = chartData.length > 0 ? chartData[0].name : '-';

  // Month Navigation Logic
  const canGoNext = useMemo(() => {
    const today = new Date();
    const isBeforeCurrentMonth = 
      currentMonth.getFullYear() < today.getFullYear() || 
      (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() < today.getMonth());
    
    if (isBeforeCurrentMonth) return true;

    const nextMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return expenses.some(e => {
      const d = new Date(e.date);
      return d >= nextMonthStart;
    });
  }, [currentMonth, expenses]);

  // Format month
  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentMonth);
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
          <p className="font-medium text-slate-800">{payload[0].payload.name}</p>
          <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-full pb-24">
      {/* Header - Compact 56px */}
      <header className="bg-white px-4 h-14 flex items-center justify-between shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner"
            style={{ backgroundColor: currentUser?.color }}
          >
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-bold text-slate-800 truncate max-w-[100px]">{currentUser?.name}</span>
        </div>
        
        <div className="text-sm font-bold text-slate-500 uppercase tracking-tight">
          {formattedMonth}
        </div>

      </header>

      {/* Filters & Month Selector - Single line */}
      <div className="bg-white px-4 py-2 flex items-center justify-between gap-4 border-b border-slate-100 sticky top-14 z-20">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="p-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            disabled={!canGoNext}
            className={`p-1.5 transition-colors ${!canGoNext ? 'text-slate-300' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg flex-1 max-w-[180px]">
          <button 
            onClick={() => setViewBy('category')}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${viewBy === 'category' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Categorias
          </button>
          <button 
            onClick={() => setViewBy('subcategory')}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${viewBy === 'subcategory' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Subs
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 p-4">
        {/* KPI Cards - Horizontal scroll 80px */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 h-20 items-center">
          <div className="snap-center shrink-0 w-36 h-full bg-indigo-600 text-white p-3 rounded-xl shadow-sm flex flex-col justify-center">
            <h3 className="text-indigo-100 text-[10px] font-medium uppercase tracking-wider mb-0.5">Total</h3>
            <p className="text-base font-bold truncate">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="snap-center shrink-0 w-36 h-full bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-0.5">Meu Gasto</h3>
            <p className="text-base font-bold text-slate-800 truncate">{formatCurrency(mySpent)}</p>
          </div>

          <div className="snap-center shrink-0 w-36 h-full bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-0.5">Outros</h3>
            <p className="text-base font-bold text-slate-800 truncate">{formatCurrency(othersSpent)}</p>
          </div>

          <div className="snap-center shrink-0 w-36 h-full bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <h3 className="text-slate-400 text-[10px] font-medium uppercase tracking-wider mb-0.5">Líder</h3>
            <p className="text-base font-bold text-slate-800 truncate">{topCategoryName}</p>
          </div>
        </div>

        {/* Charts Section */}
        {chartData.length > 0 ? (
          <>
            {/* Bar Chart - Priority, max 250px */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-4 font-sans">
            Gastos por {viewBy === 'category' ? 'Categoria' : 'Subcategoria'}
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 80, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    content={(props: any) => {
                      const { x, y, width, value } = props;
                      return (
                        <text 
                          x={x + width + 6} 
                          y={y + 12} 
                          fill="#475569" 
                          fontSize={10} 
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          {formatCurrency(value)}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Compact */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-xs font-bold text-slate-800 mb-2 font-sans">
            Composição ({viewBy === 'category' ? 'Categoria' : 'Subcategoria'})
          </h3>
          <div className="h-48 flex flex-col items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center flex-col">
              <span className="text-slate-400 text-[10px]">Total</span>
              <span className="text-base font-bold text-slate-800">{formatCurrency(totalSpent)}</span>
            </div>
          </div>
            
          {/* Custom Legend - Below chart */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
            {chartData.slice(0, 6).map((entry, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                 <span className="text-[11px] text-slate-600 truncate">{entry.name}</span>
                 <span className="text-[11px] font-bold text-slate-800 ml-auto">{Math.round((entry.value / totalSpent) * 100)}%</span>
               </div>
            ))}
          </div>
        </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <p className="font-medium">Nenhum gasto registrado em {formattedMonth}</p>
        </div>
      )}
    </div>
    </div>
  );
};

