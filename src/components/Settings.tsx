import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, LogOut, Tags, Users } from 'lucide-react';
import { useAppContext } from '../lib/context';

export const Settings = () => {
  const { categories, users, addCategory, deleteCategory, addUser, deleteUser, logout } = useAppContext();

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📌');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserColor, setNewUserColor] = useState('#10b981');

  const colorOptions = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addCategory({ name: newCatName.trim(), icon: newCatIcon, color: newCatColor });
    setNewCatName('');
    setIsCatModalOpen(false);
  };

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    addUser({ name: newUserName.trim(), color: newUserColor });
    setNewUserName('');
    setIsUserModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-8">
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm border-b border-slate-200 sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Ajustes</h2>
        <button 
          onClick={logout} 
          className="flex items-center gap-2 px-4 min-h-[44px] bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          <LogOut size={16} />
          <span>Trocar usuário</span>
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Categories */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Tags size={18} />
              Categorias
            </h3>
            <button 
              onClick={() => setIsCatModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 min-h-[44px] rounded-full flex items-center gap-1"
            >
              <Plus size={14} /> Nova
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
             <AnimatePresence>
              {categories.map(c => (
                <motion.div key={c.id} layout exit={{ opacity: 0, height: 0 }} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                      {c.icon}
                    </div>
                    <span className="font-medium text-slate-700">{c.name}</span>
                  </div>
                  <button 
                    onClick={() => { if(window.confirm('Excluir categoria? Gastos antigos não serão apagados.')) deleteCategory(c.id) }} 
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-rose-500 bg-rose-50 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
             </AnimatePresence>
          </div>
        </section>

        {/* Users */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Users size={18} />
              Usuários
            </h3>
            <button 
               onClick={() => setIsUserModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 min-h-[44px] rounded-full flex items-center gap-1"
            >
              <Plus size={14} /> Novo
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
             <AnimatePresence>
              {users.map(u => (
                <motion.div key={u.id} layout exit={{ opacity: 0, height: 0 }} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ backgroundColor: u.color }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">{u.name}</span>
                  </div>
                  <button 
                    onClick={() => { if(window.confirm('Excluir usuário? Ele não poderá mais fazer login.')) deleteUser(u.id) }} 
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-rose-500 bg-rose-50 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
             </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Nova Categoria</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Ícone (Emoji)</label>
                  <input type="text" maxLength={2} value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} className="w-16 text-center text-2xl bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Nome</label>
                  <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Cor</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(c => (
                       <button key={c} onClick={() => setNewCatColor(c)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${newCatColor === c ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsCatModalOpen(false)} className="flex-1 py-3 rounded-xl font-medium text-slate-600 bg-slate-100">Cancelar</button>
                <button onClick={handleAddCategory} className="flex-1 py-3 rounded-xl font-medium text-white bg-indigo-600 shadow-lg shadow-indigo-200">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isUserModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Novo Usuário</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Nome Autorizado</label>
                  <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-600" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-2">Cor de Perfil</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(c => (
                       <button key={c} onClick={() => setNewUserColor(c)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${newUserColor === c ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsUserModalOpen(false)} className="flex-1 py-3 rounded-xl font-medium text-slate-600 bg-slate-100">Cancelar</button>
                <button onClick={handleAddUser} className="flex-1 py-3 rounded-xl font-medium text-white bg-indigo-600 shadow-lg shadow-indigo-200">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

