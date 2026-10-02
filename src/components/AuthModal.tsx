import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  Landmark,
  Sparkles,
  Feather,
  BookOpen,
  AlertCircle,
  CheckCircle,
  KeyRound,
  ArrowLeft,
  Check,
} from 'lucide-react';
import {
  loginUser,
  registerReader,
  registerWriter,
  requestPasswordReset,
  completePasswordReset,
} from '../utils/userAuthStorage';
import { UserAccount } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  defaultMode?: 'login' | 'reader-signup' | 'writer-signup' | 'forgot-password';
  onOpenWriterExam?: () => void;
  isBarrier?: boolean; // If true, mandatory login gate (cannot close until authenticated)
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
  onOpenWriterExam,
  isBarrier = false,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'reader-signup' | 'writer-signup' | 'forgot-password'>(defaultMode);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [penName, setPenName] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfscOrRouting, setBankIfscOrRouting] = useState('');
  const [bankUpiId, setBankUpiId] = useState('');

  // Forgot password fields
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSentInfo, setResetSentInfo] = useState<{ email?: string; phone?: string; sampleCode?: string } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!resetIdentifier.trim()) {
      setError('Please enter your registered email address or mobile phone number.');
      return;
    }

    setLoading(true);
    const res = requestPasswordReset(resetIdentifier.trim());
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to locate account. Please verify your details.');
      return;
    }

    setResetSentInfo({
      email: res.email,
      phone: res.phone,
      sampleCode: res.resetCode,
    });
    setResetCode(res.resetCode || '');
    setResetStep(2);
    setSuccessMsg(`Verification code generated and sent to ${res.email}!`);
  };

  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!resetCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    const res = completePasswordReset({
      identifier: resetIdentifier,
      code: resetCode,
      newPassword,
    });
    setLoading(false);

    if (!res.success || !res.user) {
      setError(res.error || 'Failed to reset password. Please try again.');
      return;
    }

    setSuccessMsg('Password successfully updated! Signing you in...');
    setTimeout(() => {
      onSuccess(res.user!);
      onClose();
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email || !password) {
          setError('Please provide both email and password.');
          setLoading(false);
          return;
        }

        const res = loginUser(email, password);
        if (!res.success || !res.user) {
          setError(res.error || 'Login failed. Please check credentials or sign up.');
          setLoading(false);
          return;
        }

        setLoading(false);
        onSuccess(res.user);
        onClose();

        if (res.user.role === 'writer' && !res.user.isCertifiedWriter && onOpenWriterExam) {
          onOpenWriterExam();
        }
      } else if (activeTab === 'reader-signup') {
        if (!email || !password || !phone) {
          setError('Please fill in email, password, and mobile phone number.');
          setLoading(false);
          return;
        }

        const res = registerReader({
          email,
          password,
          phone,
          displayName: displayName || email.split('@')[0],
        });

        if (!res.success || !res.user) {
          setError(res.error || 'Failed to create reader account.');
          setLoading(false);
          return;
        }

        setLoading(false);
        onSuccess(res.user);
        onClose();
      } else if (activeTab === 'writer-signup') {
        if (!email || !password || !phone || !penName || !bankAccountName || !bankAccountNumber || !bankIfscOrRouting) {
          setError('Please complete all required fields including your verified payout credentials.');
          setLoading(false);
          return;
        }

        const res = registerWriter({
          email,
          password,
          phone,
          penName,
          bankAccountName,
          bankAccountNumber,
          bankIfscOrRouting,
          bankUpiId: bankUpiId || email,
        });

        if (!res.success || !res.user) {
          setError(res.error || 'Failed to create writer account.');
          setLoading(false);
          return;
        }

        setLoading(false);
        onSuccess(res.user);
        onClose();

        if (onOpenWriterExam) {
          onOpenWriterExam();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-clean-sans ${
        isBarrier ? 'bg-black/15' : 'bg-black/75 backdrop-blur-sm'
      }`}
    >
      <div
        className="w-full max-w-lg bg-[var(--bg-surface)]/98 backdrop-blur-xl border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-label="User Account Authentication"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-md border border-blue-500/30 shrink-0">
              <img src="/app-icon.jpg" alt="NovelRealm App Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display-title text-base font-bold flex items-center gap-1.5">
                <span>NovelRealm Universe</span>
                {isBarrier && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-semibold border border-blue-500/30">
                    Sign In Required
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {isBarrier
                  ? 'Sign in or register to unlock 5,000+ novels, speech & reading library'
                  : 'Manage your reading bookshelf, bookmarks, or writer studio'}
              </p>
            </div>
          </div>

          {!isBarrier && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Selection */}
        {activeTab !== 'forgot-password' && (
          <div className="flex border-b border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] text-xs font-semibold shrink-0">
            <button
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('reader-signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'reader-signup'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reader Sign Up</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('writer-signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === 'writer-signup'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Writer Sign Up</span>
            </button>
          </div>
        )}

        {/* Forgot Password Header */}
        {activeTab === 'forgot-password' && (
          <div className="px-5 py-3 border-b border-[var(--border-subtle)] bg-blue-500/5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="font-semibold text-[var(--text-secondary)]">
              Account Recovery
            </span>
          </div>
        )}

        {/* Form Body */}
        {activeTab === 'forgot-password' ? (
          <div className="p-5 space-y-4 overflow-y-auto text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-start gap-2.5 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                    <KeyRound className="w-4 h-4" />
                    <span>Reset Your Password</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    Enter your registered <strong>Email Address</strong> or <strong>Mobile Phone Number</strong>. We will send a secure 6-digit recovery code to verify your identity.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Registered Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      required
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. reader@example.com or +91 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Sending Recovery Code...' : 'Send Verification Code →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteReset} className="space-y-4">
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verification Code Sent!</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Sent to: <strong>{resetSentInfo?.email}</strong> / <strong>{resetSentInfo?.phone}</strong>
                  </p>
                  {resetSentInfo?.sampleCode && (
                    <div className="pt-1 flex items-center justify-between text-[11px] bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        Verification Code: {resetSentInfo.sampleCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => setResetCode(resetSentInfo.sampleCode || '')}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        Autofill
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-center font-mono font-bold tracking-widest text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'writer-signup' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Writer Privilege & Certification Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  To protect our readers, every writer must link their email & bank details and complete a <strong>short 1,500-word certification exam</strong> to grade and certify their storytelling skills before publishing.
                </p>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Email Address {activeTab === 'writer-signup' && <span className="text-amber-500">(Linked with Bank Account)</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password field with Forgot Password button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Password
                </label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot-password');
                      setResetStep(1);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Reader Sign Up Specific Fields */}
            {activeTab === 'reader-signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                    Display Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. AstralReader"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Writer Sign Up Specific Fields */}
            {activeTab === 'writer-signup' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Author Pen Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                      <input
                        type="text"
                        required
                        value={penName}
                        onChange={(e) => setPenName(e.target.value)}
                        placeholder="e.g. Master Tang"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <Landmark className="w-4 h-4 text-emerald-500" />
                    <span>Bank & UPI Payout Credentials</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="Full Name as on Bank Passbook"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="e.g. 10023456789"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                        IFSC Code / Routing Number
                      </label>
                      <input
                        type="text"
                        required
                        value={bankIfscOrRouting}
                        onChange={(e) => setBankIfscOrRouting(e.target.value)}
                        placeholder="e.g. SBIN0001234"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      UPI ID (GPay / PhonePe / Paytm)
                    </label>
                    <input
                      type="text"
                      value={bankUpiId}
                      onChange={(e) => setBankUpiId(e.target.value)}
                      placeholder="e.g. yourname@okaxis or yournumber@ptsbi"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs shadow-md transition-all active:scale-95 text-white ${
                activeTab === 'writer-signup'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading
                ? 'Processing...'
                : activeTab === 'login'
                ? 'Sign In to Account'
                : activeTab === 'reader-signup'
                ? 'Create Free Reader Account'
                : 'Register as Writer & Start Exam'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
