
import React from 'react';
import Header from './components/Header';
import PlantIdentifier from './components/PlantIdentifier';

const App: React.FC = () => {
  return (
    <div className="bg-green-50 min-h-screen font-sans text-gray-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl">
          <PlantIdentifier />
        </div>
      </main>
    </div>
  );
};

export default App;
