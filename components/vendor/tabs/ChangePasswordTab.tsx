'use client';

import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { PortalUser, updatePortalUserPassword } from '@/lib/auth/portalUsers';

interface ChangePasswordTabProps {
  session: PortalUser;
  onPasswordChanged: (newPass: string) => void;
}

export function ChangePasswordTab({ session, onPasswordChanged }: ChangePasswordTabProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Verify current password
    if (session.password && currentPassword !== session.password) {
      setMessage({ type: 'error', text: 'Current password does not match existing records.' });
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      setIsSubmitting(false);
      return;
    }

    const updated = updatePortalUserPassword(session.id, newPassword);
    if (updated) {
      onPasswordChanged(newPassword);
      setMessage({ type: 'success', text: 'Password successfully changed! Your new password is now active.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: 'Failed to update password. Please contact Administrator.' });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Lock className="w-5 h-5 text-sky-400" />
          <span>Security & Change Password</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Update your vendor portal authentication credentials. Passwords are encrypted at rest with RBAC access control.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#1E293B]/80 border border-slate-700 shadow-xl space-y-4">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Current Password *</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">New Password *</label>
          <input
            type={showPass ? 'text' : 'password'}
            required
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Confirm New Password *</label>
          <input
            type={showPass ? 'text' : 'password'}
            required
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Account: <strong className="text-white">{session.username}</strong> ({session.assignedCode})
            <br />
            Tip: Passwords can also be reset by the Central Admin via the Admin Panel under &apos;Portal &amp; Passwords&apos;.
          </span>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 cursor-pointer disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
