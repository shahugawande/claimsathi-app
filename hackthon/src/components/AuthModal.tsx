import React, { useState } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabaseClient';
import { X, User, Database, Check, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetDemo: () => void;
  userEmail: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetDemo,
  userEmail
}) => {
  const [tab, setTab] = useState<'profile' | 'supabase' | 'account'>('profile');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [accountMode, setAccountMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [accountBusy, setAccountBusy] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountBusy(true);
    setAccountMessage('');
    try {
      const result = accountMode === 'sign-up'
        ? await supabase.auth.signUp({ email: accountEmail, password: accountPassword })
        : await supabase.auth.signInWithPassword({ email: accountEmail, password: accountPassword });
      if (result.error) throw result.error;

      if (accountMode === 'sign-up' && !result.data.session) {
        setAccountMessage('Account bana. Email mein confirmation link check karo, phir Sign in karo.');
      } else {
        setAccountMessage('Sign in ho gaya. Data Supabase se load ho raha hai.');
        onClose();
      }
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : 'Account request fail hui.');
    } finally {
      setAccountBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Patient Profile &amp; Backend</h3>
              <p className="text-[11px] text-slate-500">Manage patient demographics and Supabase connection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl my-4 text-[10px] sm:text-xs font-semibold">
          <button
            onClick={() => setTab('profile')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient Demographics
          </button>
          <button
            onClick={() => setTab('supabase')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'supabase' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase / RLS Store</span>
          </button>
          <button
            onClick={() => setTab('account')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              tab === 'account' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Account
          </button>
        </div>

        {tab === 'profile' ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age &amp; Gender</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="flex-1 px-2 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ABHA ID (Ayushman Bharat)</label>
                <input
                  type="text"
                  value={formData.abhaId || ''}
                  onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                  placeholder="91-4821-3901-5520"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City &amp; State</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Insurer</label>
                <input
                  type="text"
                  value={formData.primaryInsurer}
                  onChange={(e) => setFormData({ ...formData, primaryInsurer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominee Name</label>
                <input
                  type="text"
                  value={formData.nomineeName}
                  onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominee Phone</label>
                <input
                  type="text"
                  value={formData.nomineePhone}
                  onChange={(e) => setFormData({ ...formData, nomineePhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  onClose();
                }}
                className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reset to Rahul Sharma Demo</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        ) : tab === 'supabase' ? (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Supabase client configured</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                App data cloud sync tabhi karega jab tum Account tab se email ke saath sign in karoge. Login ke baad Row Level Security signed-in user ke data ko protect karti hai.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {userEmail ? (
              <div className="space-y-3">
                <p className="text-slate-700">Signed in as <strong>{userEmail}</strong></p>
                <button
                  type="button"
                  onClick={async () => {
                    const { error } = await supabase.auth.signOut();
                    setAccountMessage(error ? error.message : 'Sign out ho gaya.');
                    if (!error) onClose();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <form onSubmit={handleAccountSubmit} className="space-y-3">
                <p className="text-slate-600">Email se account banao ya apne account mein sign in karo.</p>
                <label className="block font-semibold text-slate-700">
                  Email
                  <input
                    type="email"
                    required
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </label>
                <label className="block font-semibold text-slate-700">
                  Password
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </label>
                <button
                  type="submit"
                  disabled={accountBusy}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs"
                >
                  {accountBusy ? 'Please wait…' : accountMode === 'sign-up' ? 'Create account' : 'Sign in'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountMode(accountMode === 'sign-in' ? 'sign-up' : 'sign-in');
                    setAccountMessage('');
                  }}
                  className="w-full text-blue-700 font-semibold"
                >
                  {accountMode === 'sign-in' ? 'New here? Create account' : 'Already registered? Sign in'}
                </button>
              </form>
            )}
            {accountMessage && <p role="status" className="rounded-lg bg-slate-100 p-2 text-slate-700">{accountMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
