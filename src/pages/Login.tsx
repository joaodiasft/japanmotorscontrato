import React from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  BRAND_INSTAGRAM_HANDLE,
  BRAND_INSTAGRAM_URL,
  BRAND_LOGO_URL,
  BRAND_NAME,
  BRAND_TAGLINE,
} from '../config/brand';

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState('admin@japanmotors.com.br');
  const [password, setPassword] = React.useState('admin123');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <img
              src={BRAND_LOGO_URL}
              alt={BRAND_NAME}
              className="h-24 w-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{BRAND_NAME}</h1>
            <p className="text-gray-500 mt-2">{BRAND_TAGLINE}</p>
            <p className="text-sm text-gray-400 mt-1">Sistema de gestão de contratos</p>
            <a
              href={BRAND_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-neutral-900 mt-3 inline-block"
            >
              Instagram @{BRAND_INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-neutral-700 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@japanmotors.com.br"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-neutral-800 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Senha de Acesso</label>
                <button type="button" className="text-xs font-bold text-gray-500 hover:text-neutral-900 uppercase tracking-widest">Esqueceu?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-neutral-700 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-neutral-800 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-neutral-800 hover:shadow-lg hover:shadow-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-sm text-gray-400">
              Acesso restrito a colaboradores autorizados.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            © 2026 Japan Motors • v2.6.0
          </p>
        </div>
      </div>
    </div>
  );
}
