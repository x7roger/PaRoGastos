import { useState, useMemo, useEffect, useRef, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { X, Check, Loader2 } from 'lucide-react';
import { useAppContext } from '../lib/context';

export const AddExpense = () => {
  const { categories, currentUser, users, subcategories, addExpense, saveSubcategory, setIsAddExpenseOpen } = useAppContext();
  
  const [amountRaw, setAmountRaw] = useState<number>(0);
  const [amountDisplay, setAmountDisplay] = useState('R$ 0,00');
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payerId, setPayerId] = useState(currentUser?.id || '');
  const [isSaving, setIsSaving] = useState(false);

  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the amount input on mount
    amountRef.current?.focus();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // get only digits
    if (value === '') value = '0';
    
    const numericValue = parseInt(value, 10) / 100;
    setAmountRaw(numericValue);
    
    // Format to BRL 
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue);
    setAmountDisplay(formatted);
  };

  // Filter subcategory suggestions from Firestore based on selected category and text input
  const subcategorySuggestions = useMemo(() => {
    if (!selectedCatId) return [];
    
    const catSubcategories = subcategories
      .filter(s => s.categoria === selectedCatId)
      .map(s => s.nome);
    
    const uniqueSubs = Array.from(new Set(catSubcategories));
    
    if (subcategory.trim()) {
      const lower = subcategory.toLowerCase();
      return uniqueSubs.filter(s => s.toLowerCase().includes(lower)).slice(0, 8);
    }
    
    return uniqueSubs.slice(0, 8);
  }, [selectedCatId, subcategories, subcategory]);

  const handleSave = async () => {
    if (amountRaw <= 0) return alert('Opa! Você esqueceu de informar o valor do gasto.');
    if (!selectedCatId) return alert('Por favor, selecione uma categoria para organizar seus gastos.');
    if (!subcategory.trim()) return alert('Informe uma subcategoria (ex: Almoço, Gasolina...) para facilitar sua análise.');
    if (!payerId) return alert('Quem pagou este gasto? Selecione um perfil.');

    setIsSaving(true);

    const cat = categories.find(c => c.id === selectedCatId)!;

    try {
      await addExpense({
        amount: amountRaw,
        categoryId: cat.id,
        categoryName: cat.name,
        categoryColor: cat.color,
        categoryIcon: cat.icon,
        subcategory: subcategory.trim(),
        description: description.trim(),
        date,
        paidById: payerId
      });

      await saveSubcategory(subcategory.trim(), selectedCatId);

      setIsAddExpenseOpen(false);
    } catch {
      alert('Não foi possível salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="bg-slate-50 h-full w-full flex flex-col z-50 fixed inset-0 overflow-hidden"
    >
      <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
        <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2">
          <X size={24} />
        </button>
        <span className="font-semibold text-slate-800">Novo Gasto</span>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-32">
        {/* 1. VALOR */}
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Qual foi o valor?</p>
          <div className="relative inline-block w-full">
            <input 
               ref={amountRef}
               type="tel" 
               inputMode="numeric"
               value={amountDisplay}
               onChange={handleAmountChange}
               className="w-full text-5xl font-bold font-sans text-center text-slate-800 bg-transparent border-none focus:ring-0 outline-none p-0 z-10 relative opacity-0 absolute inset-0 cursor-text h-full"
            />
            {/* Visual display overlaid behind transparent input to look nice */}
            <div className={`w-full text-5xl font-bold font-sans text-center pointer-events-none transition-colors ${amountRaw > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
               {amountDisplay}
            </div>
          </div>
        </div>

        {/* 2. CATEGORIA */}
        {amountRaw > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Em qual categoria?</p>
             <div className="grid grid-cols-3 gap-3">
               {categories.map(c => (
                 <button
                   key={c.id}
                   onClick={() => { setSelectedCatId(c.id); setSubcategory(''); }}
                   className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-h-[80px] ${selectedCatId === c.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white'}`}
                 >
                   <span className="text-3xl mb-1">{c.icon}</span>
                   <span className="text-sm font-semibold text-slate-700 truncate w-full text-center">{c.name}</span>
                 </button>
               ))}
             </div>
          </motion.div>
        )}

        {/* 3. SUBCATEGORIA */}
        {selectedCatId && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Qual é a subcategoria?</p>
             <input
               type="text"
               value={subcategory}
               onChange={e => setSubcategory(e.target.value)}
               onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
               autoComplete="off"
               placeholder="Ex: Combustível, Lavagem..."
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 mb-3"
             />
             {subcategorySuggestions.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {subcategorySuggestions.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSubcategory(sub)}
                      className="bg-slate-200/50 text-slate-600 text-sm px-5 py-3 min-h-[44px] rounded-full hover:bg-slate-200 transition-colors"
                    >
                     {sub}
                   </button>
                 ))}
               </div>
             )}
          </motion.div>
        )}

        {/* 4, 5, 6. OUTROS DETALHES */}
        {subcategory.trim() && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Quem Pagou?</p>
              <div className="flex gap-3">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setPayerId(u.id)}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 border-2 transition-all ${payerId === u.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: u.color }} />
                    <span className="font-medium text-slate-700">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
               <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Data</p>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 h-12 text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
               </div>
               <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Descrição <span className="lowercase text-xs font-normal">(opcional)</span></p>
                  <input
                     type="text"
                     value={description}
                     onChange={e => setDescription(e.target.value)}
                     onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                     autoComplete="off"
                     placeholder="Observação..."
                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 h-12 text-sm text-slate-800 font-medium focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
               </div>
            </div>

          </motion.div>
        )}

      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-12 shrink-0">
        <button
          onClick={handleSave}
          disabled={isSaving || amountRaw <= 0 || !selectedCatId || !subcategory.trim() || !payerId}
          className="w-full min-h-[44px] rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all hover:bg-indigo-700 active:scale-95"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
          {isSaving ? 'Salvando...' : 'Salvar Gasto'}
        </button>
      </div>
    </motion.div>
  );
};

