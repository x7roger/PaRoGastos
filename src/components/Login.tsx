import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import { useAppContext } from '../lib/context';

export const Login = () => {
  const { users, login } = useAppContext();

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

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-xs space-y-4"
        >
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest text-center mb-6">
            Quem é você?
          </p>

          <div className="grid grid-cols-2 gap-4">
            {users.map((user, i) => (
              <motion.button
                key={user.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                onClick={() => login(user)}
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

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full mt-6 py-4 rounded-xl text-indigo-600 font-medium flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            <span>Novo Usuário</span>
          </motion.button>

        </motion.div>
      </div>
    </div>
  );
};
