import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter((p) => p);
    const breadcrumbs: { label: string; path: string }[] = [{ label: 'Accueil', path: '/' }];

    paths.forEach((path, index) => {
      const fullPath = '/' + paths.slice(0, index + 1).join('/');
      let label = path;

      // Map paths to labels
      if (path === 'dashboard') label = 'Dashboard';
      else if (path === 'todos') label = 'Mes Tâches';
      else if (path === 'login') label = 'Connexion';
      else if (path === 'register') label = 'Inscription';
      else if (path === 'profile') label = 'Profil';

      breadcrumbs.push({ label: label.charAt(0).toUpperCase() + label.slice(1), path: fullPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <svg
                  className="h-5 w-5 text-gray-400 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-500 font-medium">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

