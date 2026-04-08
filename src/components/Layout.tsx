import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  BRAND_INSTAGRAM_HANDLE,
  BRAND_INSTAGRAM_URL,
  BRAND_LOGO_URL,
  BRAND_NAME,
  BRAND_TAGLINE,
} from '../config/brand';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Car, label: 'Estoque', path: '/estoque' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: FileText, label: 'Contratos', path: '/contratos' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <aside
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col print:hidden',
          isSidebarOpen ? 'w-64' : 'w-20',
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img
                src={BRAND_LOGO_URL}
                alt={BRAND_NAME}
                className="h-10 w-auto object-contain shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="font-bold text-lg tracking-tight text-neutral-900 block truncate">{BRAND_NAME}</span>
                <span className="text-xs text-gray-500 truncate block">{BRAND_TAGLINE}</span>
              </div>
            </Link>
          ) : (
            <Link to="/" className="mx-auto block">
              <img
                src={BRAND_LOGO_URL}
                alt=""
                className="h-9 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-all group',
                  isActive
                    ? 'bg-gray-100 text-neutral-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-neutral-900',
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-neutral-700' : 'text-gray-400 group-hover:text-neutral-800',
                  )}
                />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="px-4 pb-2">
            <a
              href={BRAND_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-neutral-900 block py-2"
            >
              Instagram @{BRAND_INSTAGRAM_HANDLE}
            </a>
          </div>
        )}

        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-4 p-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-neutral-900 transition-all w-full group',
              !isSidebarOpen && 'justify-center',
            )}
          >
            <LogOut className="w-5 h-5 group-hover:text-neutral-700" />
            {isSidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 print:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-gray-500" /> : <Menu className="w-5 h-5 text-gray-500" />}
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/contratos')}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Novo Contrato</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
              <img
                src={BRAND_LOGO_URL}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
