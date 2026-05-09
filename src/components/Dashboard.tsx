import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    <div className="flex flex-col space-y-6 bg-slate-50 min-h-full pb-8">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 rounded-b-3xl shadow-sm border-b border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-inner"
              style={{ backgroundColor: currentUser?.color }}
            >
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-slate-500">Olá, {currentUser?.name}</p>
            </div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-2 mb-6 border border-slate-100">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-200/50"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-base font-bold text-slate-700 font-sans tracking-tight capitalize">
            {formattedMonth}
          </h2>
          
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            disabled={!canGoNext}
            className={`p-2 rounded-full transition-colors ${!canGoNext ? 'text-slate-300' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewBy('category')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${viewBy === 'category' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
          >
            Categoria
          </button>
          <button 
            onClick={() => setViewBy('subcategory')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${viewBy === 'subcategory' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
          >
            Subcategoria
          </button>
        </div>
      </header>

      {/* KPIs Horizontal Row */}
      <div className="px-6">
        <div className="flex -mx-6 px-6 gap-4 overflow-x-auto no-scrollbar snap-x">
          <div className="snap-center shrink-0 w-48 bg-indigo-600 text-white p-5 rounded-2xl shadow-md shadow-indigo-200">
            <h3 className="text-indigo-100 text-xs font-medium mb-1 uppercase tracking-wider">Total Gasto</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="snap-center shrink-0 w-48 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Meu Gasto</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(mySpent)}</p>
          </div>

          <div className="snap-center shrink-0 w-48 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Outros</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(othersSpent)}</p>
          </div>

          <div className="snap-center shrink-0 w-48 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Líder</h3>
            <p className="text-lg font-bold text-slate-800 truncate w-full">{topCategoryName}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="px-6 space-y-6">
          {/* Bar Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-6 font-sans">
              Gastos por {viewBy === 'category' ? 'Categoria' : 'Subcategoria'}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 mb-2 font-sans">
              Composição ({viewBy === 'category' ? 'Categoria' : 'Subcategoria'})
            </h3>
            <div className="h-64 flex flex-col items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
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
                <span className="text-slate-400 text-xs">Total</span>
                <span className="text-lg font-bold text-slate-800">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {chartData.slice(0, 6).map((entry, i) => (
                 <div key={i} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                   <span className="text-xs text-slate-600 truncate">{entry.name}</span>
                   <span className="text-xs font-semibold ml-auto">{Math.round((entry.value / totalSpent) * 100)}%</span>
                 </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <p className="font-medium">Nenhum gasto registrado em {formattedMonth}</p>
        </div>
      )}
    </div>
  );
};

