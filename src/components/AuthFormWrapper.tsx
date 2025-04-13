
import { ReactNode } from 'react';
import CardSpotlight from './CardSpotlight';

interface AuthFormWrapperProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthFormWrapper = ({ title, subtitle, children }: AuthFormWrapperProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <CardSpotlight className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </CardSpotlight>
    </div>
  );
};

export default AuthFormWrapper;
