import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: ROUTES.DASHBOARD, label: 'Tableau de bord' },
    { path: ROUTES.TODOS, label: 'Mes Tâches' },
    { path: ROUTES.PROFILE, label: 'Profil' },
  ];

  return (
    <nav className="bg-gray-100 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                px-3 py-4 text-sm font-medium border-b-2 transition-colors
                ${
                  location.pathname === item.path
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

