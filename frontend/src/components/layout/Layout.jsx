// src/components/layout/Layout.jsx - Layout principal da aplicação
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getUserInitials, getDisplayName } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCurrentPath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/characters', label: 'Personagens', icon: '⚔️' },
    { path: '/characters/create', label: 'Criar Herói', icon: '➕' },
    // { path: '/campaigns', label: 'Campanhas', icon: '🏰' },
    // { path: '/spells', label: 'Feitiços', icon: '📜' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 via-stone-700 to-amber-900">
      {/* Header */}
      <header className="bg-stone-900/50 backdrop-blur-sm border-b-2 border-amber-600/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <h1 className="text-2xl font-bold text-amber-400 font-medieval tracking-wider">
                  ⚔️ FORGE OF HEROES
                </h1>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isCurrentPath(item.path)
                        ? 'bg-amber-600/20 text-amber-300 border border-amber-600/30'
                        : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/50'
                    }`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 hover:bg-stone-800/50 rounded-lg p-2 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 
                    flex items-center justify-center border-2 border-amber-700 shadow-lg">
                    <span className="text-amber-900 font-bold text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div className="hidden md:block text-left">
                    <p className="text-stone-100 font-semibold text-sm">
                      {getDisplayName()}
                    </p>
                    <p className="text-stone-400 text-xs">
                      Mestre Aventureiro
                    </p>
                  </div>

                  {/* Dropdown Arrow */}
                  <svg 
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-stone-100 border-2 border-stone-300 rounded-lg shadow-xl z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-200 transition-colors"
                      >
                        👤 Meu Perfil
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-200 transition-colors"
                      >
                        ⚙️ Configurações
                      </button>
                      <div className="border-t border-stone-300 my-1" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        🚪 Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-stone-700/50 pt-2 pb-3">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isCurrentPath(item.path)
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-600/30'
                      : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/50'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Layout;