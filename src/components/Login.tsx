import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { User } from '../types';

export const Login = () => {
  const { users, login } = useAppContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedUser.email) return;

    setIsLoading(true);
    setError('');

    try {
      console.log("Tentando login com:", selectedUser.email, password);
      await login(selectedUser.email, password);
    } catch (err: any) {
      console.error("Firebase Auth Error Full Object:", err);
      setError('Senha incorreta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email === 'roger@roger.com' || u.email === 'paty@paty.com'
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 overflow-hidden sm:border sm:border-slate-200">
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 text-slate-800"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
            <span className="text-3xl font-bold text-white">PR</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">PaRo Gastos</h1>
          <p className="text-slate-500">Controle financeiro compartilhado</p>
        </motion.div>

        <div className="w-full max-w-xs overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedUser ? (
              <motion.div 
                key="user-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest text-center">
                  Quem é você?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {filteredUsers.map((user, i) => (
                    <motion.button
                      key={user.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedUser(user)}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center gap-4 transition-all hover:shadow-md"
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-inner"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-700">{user.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="password-entry"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => {
                    setSelectedUser(null);
                    setPassword('');
                    setError('');
                  }}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm font-medium">Voltar</span>
                </button>

                <div className="text-center space-y-4">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white shadow-md"
                    style={{ backgroundColor: selectedUser.color }}
                  >
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Olá, {selectedUser.name}!</h2>
                  <p className="text-sm text-slate-500">Digite sua senha para entrar</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <input
                      autoFocus
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-center text-lg tracking-[0.5em]"
                    />
                    {error && (
                      <p className="text-xs text-red-500 text-center font-medium">{error}</p>
                    )}
                  </div>

                  <button
                    disabled={isLoading || !password}
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
