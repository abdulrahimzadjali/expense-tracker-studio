import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00bab3] to-blue-500 text-transparent bg-clip-text">
        Expense Tracker
      </h1>
    </header>
  );
};

export default Header;