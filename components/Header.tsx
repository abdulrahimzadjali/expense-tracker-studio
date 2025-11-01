
import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface HeaderProps {
  session: Session;
}

const Header: React.FC<HeaderProps> = ({ session }) => {

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  }

  return (
    <header className="py-6 text-center relative">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00bab3] to-blue-500 text-transparent bg-clip-text">
        Expense Tracker
      </h1>
      {session && (
         <button 
            onClick={handleSignOut} 
            className="absolute top-1/2 right-0 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-sm"
            aria-label="Sign Out"
          >
            Sign Out
          </button>
      )}
    </header>
  );
};

export default Header;
