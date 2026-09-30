import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User, Landmark, Sparkles, Feather, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { loginUser, registerReader, registerWriter } from '../utils/userAuthStorage';
import { UserAccount } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  defaultMode?: 'login' | 'reader-signup' | 'writer-signup';
  onOpenWriterExam?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
  onOpenWriterExam,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'reader-signup' | 'writer-signup'>(defaultMode);
  
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

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
          setError(res.error || 'Login failed. Please check credentials.');
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
          setError('Please fill in email, password, and phone number.');
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
        if (!email || !password || !phone || !penName) {
          setError('Please fill in email, password, phone, and your author pen name.');
          setLoading(false);
          return;
        }

        if (!bankAccountNumber && !bankUpiId) {
          setError('Please link your Bank Account Number or UPI ID to receive royalty payments.');
          setLoading(false);
          return;
        }

        const res = registerWriter({
          email,
          password,
          phone,
          penName,
          bankAccountName: bankAccountName || penName,
          bankAccountNumber: bankAccountNumber || 'UPI-Linked',
          bankIfscOrRouting: bankIfscOrRouting || 'UPI',
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

        // Immediately guide the new writer to the Certification Exam
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in font-clean-sans">
      <div
        className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-label="User Account Login and Registration"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md font-bold">
              NR
            </div>
            <div>
              <h3 className="font-display-title text-base font-bold">NovelRealm Account</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Sign in or register as a Reader or Writer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--border-subtle)] bg-black/[0.01] dark:bg-white/[0.01] text-xs font-semibold shrink-0">
          <button
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('reader-signup'); setError(null); }}
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
            onClick={() => { setActiveTab('writer-signup'); setError(null); }}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'writer-signup'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Writer Sign Up</span>
          </button>
        </div>

        {/* Form Body */}
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

          {/* Common Email field */}
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

          {/* Common Password field */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
              Password
            </label>
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
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210 or your country code"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  Reader Display Name / Nickname
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Reader"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Writer Sign Up Specific Fields */}
          {activeTab === 'writer-signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                  Writer Pen Name / Privilege Name
                </label>
                <div className="relative">
                  <Feather className="absolute left-3 top-2.5 w-4 h-4 text-amber-500" />
                  <input
                    type="text"
                    required
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    placeholder="e.g. Lord Shadow, Elysia Frost"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[var(--text-primary)]">
                  <Landmark className="w-3.5 h-3.5 text-blue-500" />
                  <span>Bank & Royalty Payout Linkage</span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Required to deposit your monthly 40% - 70% writer royalties and reader coffee tips.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-0.5">
                      Bank UPI ID (India Instant Payout)
                    </label>
                    <input
                      type="text"
                      value={bankUpiId}
                      onChange={(e) => setBankUpiId(e.target.value)}
                      placeholder="e.g. yourname@ptsbi"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-0.5">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="Full Legal Name"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-0.5">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="e.g. 50100412345678"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-0.5">
                      IFSC / Swift / Routing
                    </label>
                    <input
                      type="text"
                      value={bankIfscOrRouting}
                      onChange={(e) => setBankIfscOrRouting(e.target.value)}
                      placeholder="e.g. SBIN0001234"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-main)] text-[var(--text-primary)] text-xs"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl font-bold text-white transition-all shadow-md ${
                activeTab === 'writer-signup'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                'Processing...'
              ) : activeTab === 'login' ? (
                'Sign In to NovelRealm'
              ) : activeTab === 'reader-signup' ? (
                'Create Reader Account'
              ) : (
                'Create Writer Account & Start Exam'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between shrink-0 text-[11px] text-[var(--text-secondary)]">
          <span>100% Secure · Real verified readers & authors</span>
          {activeTab === 'login' ? (
            <button
              onClick={() => setActiveTab('reader-signup')}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Need an account? Register
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
