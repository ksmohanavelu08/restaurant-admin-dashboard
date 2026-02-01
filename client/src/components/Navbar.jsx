import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, LayoutDashboard, Menu as MenuIcon, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/menu', label: 'Menu Management', icon: MenuIcon },
    { path: '/orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Eatoes Admin</span>
          </div>

          <div className="flex space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
