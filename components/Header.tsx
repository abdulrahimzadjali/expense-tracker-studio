
import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface HeaderProps {
  session: Session;
  onInstall: () => void;
  showInstallButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ session, onInstall, showInstallButton }) => {

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  }

  return (
    <header className="py-6 text-center relative">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00bab3] to-blue-500 text-transparent bg-clip-text">
        Expense Tracker
      </h1>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center gap-4">
        {showInstallButton && (
           <button
            onClick={onInstall}
            className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1"
            aria-label="Install application"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Install</span>
          </button>
        )}
        {session && (
         <button 
            onClick={handleSignOut} 
            className="text-slate-400 hover:text-white transition-colors text-sm"
            aria-label="Sign Out"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
