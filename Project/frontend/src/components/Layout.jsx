import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom'; // 1. Import Link
import useAuth from '../hooks/useAuth';
import CurrencySelector from './CurrencySelector';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();


  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = 'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105';
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25`;
    }
    return `${baseClasses} text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400`;
  };

  const handleClick = (e) => {
   navigate("/");
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-teal-200 dark:border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Enhanced Bento Logo */}
              <div
                onClick={handleClick}
                className="group cursor-pointer transition-all duration-500 hover:scale-110"
                title="Go to home"
              >
                <div className="relative">
                  <span className="font-black text-3xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
                    Bento
                  </span>
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className={getNavLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/transactions" className={getNavLinkClass}>
                    Transactions
                  </NavLink>
                  <NavLink to="/receipts" className={getNavLinkClass}>
                    Receipts
                  </NavLink>
                  <NavLink to="/settings" className={getNavLinkClass}>
                    Settings
                  </NavLink>
                  <NavLink to="/budgets" className={getNavLinkClass}>
                    Budgets
                  </NavLink>
                  <NavLink
                    to="/recurring-transactions"
                    className={getNavLinkClass}
                  >
                    Recurring Transactions
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <ThemeToggle />
              <CurrencySelector />
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
