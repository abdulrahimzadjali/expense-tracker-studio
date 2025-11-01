
import React, { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Category } from '../types';

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'user_id'>[] = [
    { name: 'Food', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6', color: 'cyan' },
    { name: 'Transport', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', color: 'blue' },
    { name: 'Bills', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'red' },
    { name: 'Entertainment', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'purple' },
    { name: 'Health', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'green' },
    { name: 'Shopping', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'orange' },
    { name: 'Other', icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z', color: 'slate' },
];

const AuthPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
            setError(error.message);
        } else if (user) {
            // Insert default categories for the new user
            const categoriesToInsert = DEFAULT_CATEGORIES.map(cat => ({ ...cat, user_id: user.id }));
            const { error: insertError } = await supabase.from('categories').insert(categoriesToInsert);
            if (insertError) {
                setError(`Account created, but failed to add default categories: ${insertError.message}`);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md">
                <header className="py-6 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00bab3] to-blue-500 text-transparent bg-clip-text">
                        Expense Tracker
                    </h1>
                    <p className="text-slate-400 mt-2">Sign in or create an account to continue</p>
                </header>
                <main className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
                    <form className="space-y-6">
                        {error && <p className="text-red-400 text-center text-sm" role="alert">{error}</p>}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                            <input
                                id="email"
                                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                            <input
                                id="password"
                                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button
                                onClick={handleLogin}
                                className="w-full bg-[#00bab3] hover:bg-[#00a39e] text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-slate-600"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                             <button
                                onClick={handleSignUp}
                                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-slate-600"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AuthPage;
