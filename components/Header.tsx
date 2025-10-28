
import React from 'react';
import { LeafIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        <LeafIcon className="h-8 w-8 text-green-600 mr-3" />
        <h1 className="text-2xl font-bold text-green-800 tracking-tight">
          Flora AI <span className="font-normal text-gray-600">| Gardening Assistant</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
