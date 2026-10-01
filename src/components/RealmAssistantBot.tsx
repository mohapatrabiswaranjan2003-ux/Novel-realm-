import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  BookOpen,
  PenTool,
  ShieldCheck,
  Moon,
  Sun,
  Radio,
  Trash2,
  ChevronRight,
  CreditCard,
  Flame,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Novel } from '../types/novel';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    actionType:
      | 'open_writer_studio'
      | 'open_bookmarks'
      | 'open_stats'
      | 'open_traffic'
      | 'open_monetization'
      | 'switch_theme_dark'
      | 'switch_theme_light'
      | 'switch_theme_sepia'
      | 'copy_upi'
      | 'open_novel';
    payload?: any;
  }>;
}

interface RealmAssistantBotProps {
  currentView: 'library' | 'genres' | 'reader';
  novels: Novel[];
  onOpenWriterStudio: () => void;
  onOpenBookmarks: () => void;
  onOpenStats: () => void;
  onOpenLiveTraffic: () => void;
  onOpenMonetization: () => void;
  onSwitchTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  onSelectNovel: (novel: Novel) => void;
}

const INITIAL_GREETING: Message = {
  id: 'msg-welcome',
  sender: 'bot',
  text: "👋 Hi! I'm **RealmBot**, your AI Reading & Platform Concierge. How can I help you today? Ask me about reading passes, publishing stories, website safety, or navigating the platform!",
  timestamp: 'Just now',
  actions: [
    { label: '📖 How do free passes work?', actionType: 'open_monetization' },
    { label: '✍️ Become a Certified Writer', actionType: 'open_writer_studio' },
    { label: '🛡️ Is my data safe from hacking?', actionType: 'open_traffic' },
    { label: '🟢 Live Traffic Radar', actionType: 'open_traffic' },
  ],
};

export const RealmAssistantBot: React.FC<RealmAssistantBotProps> = ({
  currentView,
  novels,
  onOpenWriterStudio,
  onOpenBookmarks,
  onOpenStats,
  onOpenLiveTraffic,
  onOpenMonetization,
  onSwitchTheme,
  onSelectNovel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('8114947965@ptsbi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleActionClick = (action: NonNullable<Message['actions']>[number]) => {
    switch (action.actionType) {
      case 'open_writer_studio':
        onOpenWriterStudio();
        setIsOpen(false);
        break;
      case 'open_bookmarks':
        onOpenBookmarks();
        setIsOpen(false);
        break;
      case 'open_stats':
        onOpenStats();
        setIsOpen(false);
        break;
      case 'open_traffic':
        onOpenLiveTraffic();
        setIsOpen(false);
        break;
      case 'open_monetization':
        onOpenMonetization();
        setIsOpen(false);
        break;
      case 'switch_theme_dark':
        onSwitchTheme('dark');
        addBotMessage('🌙 Switched to Dark Mode! Easy on the eyes for night reading.');
        break;
      case 'switch_theme_light':
        onSwitchTheme('light');
        addBotMessage('☀️ Switched to Clean Light Mode!');
        break;
      case 'switch_theme_sepia':
        onSwitchTheme('sepia');
        addBotMessage('📜 Switched to Cozy Sepia Mode! Mimics classic book paper.');
        break;
      case 'copy_upi':
        handleCopyUpi();
        break;
      case 'open_novel':
        if (action.payload) {
          onSelectNovel(action.payload);
          setIsOpen(false);
        }
        break;
    }
  };

  const addBotMessage = (
    text: string,
    actions?: Message['actions']
  ) => {
    const newMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Process intelligent assistant answer
    setTimeout(() => {
      respondToQuery(query.toLowerCase());
    }, 350);
  };

  const respondToQuery = (q: string) => {
    // 1. Pass / Monetization / Lock Questions
    if (
      q.includes('lock') ||
      q.includes('pass') ||
      q.includes('free') ||
      q.includes('chapter 31') ||
      q.includes('pay') ||
      q.includes('cost') ||
      q.includes('price')
    ) {
      addBotMessage(
        "📚 **How Reading & Passes Work:**\n\n" +
          "• **Chapters 1 to 30 are 100% FREE** for all novels!\n" +
          "• If a novel reaches 10,000 views, later chapters (31+) require an unlock.\n" +
          "• **Daily Free Pass:** Every reader receives 1 free pass daily (refreshes at midnight) to unlock any premium chapter for 24 hours!\n" +
          "• **$2 VIP Pass:** Permanently unlocks all current and future chapters of that novel forever.",
        [
          { label: 'View Monetization Policy 📄', actionType: 'open_monetization' },
          { label: 'Tip via UPI 💳', actionType: 'copy_upi' },
        ]
      );
      return;
    }

    // 2. Writer / Author / Exam / Royalties Questions
    if (
      q.includes('writer') ||
      q.includes('author') ||
      q.includes('publish') ||
      q.includes('exam') ||
      q.includes('earn') ||
      q.includes('royalt') ||
      q.includes('70%') ||
      q.includes('write')
    ) {
      addBotMessage(
        "✍️ **Writer Certification & Royalties:**\n\n" +
          "• **70% Revenue Share:** Certified authors earn 70% of VIP pass revenue and 100% of reader UPI tips!\n" +
          "• **Quality Exam:** To prevent AI spam and maintain high standards, authors submit a 1,500-word original writing sample.\n" +
          "• Once certified, your author badge turns gold and you get full access to the Writer Studio!",
        [
          { label: 'Open Writer Studio ✍️', actionType: 'open_writer_studio' },
          { label: 'Monetization Policy 📜', actionType: 'open_monetization' },
        ]
      );
      return;
    }

    // 2b. View Earnings & Traffic Monetization
    if (
      q.includes('per view') ||
      q.includes('view count') ||
      q.includes('traffic money') ||
      q.includes('how do i get paid') ||
      q.includes('threshold') ||
      q.includes('payout')
    ) {
      addBotMessage(
        "💡 **How View & Traffic Earnings Work:**\n\n" +
          "• **Verified Impressions (CPM):** Earnings are generated from *real human readers seeing ads on your novel*, NOT from simply reloading the page counter!\n" +
          "• **Each Novel Earns For Itself:** You earn 70% of the ad income and VIP chapter sales generated on YOUR stories.\n" +
          "• **Net-30 Settlement:** Payouts are issued within 15 days after ad networks (Monetag/Google) settle cleared funds.\n" +
          "• **Minimum Threshold:** ₹1,000 ($25 USD) to ensure smooth disbursement.\n" +
          "• **Direct Tips:** 100% of reader UPI tips go straight to your registered UPI ID!",
        [
          { label: 'Open Writer Studio ✍️', actionType: 'open_writer_studio' },
          { label: 'Monetization Policy 📄', actionType: 'open_monetization' },
        ]
      );
      return;
    }

    // 3. Security / Firewall / Hack / Safe Questions
    if (
      q.includes('safe') ||
      q.includes('hack') ||
      q.includes('firewall') ||
      q.includes('secur') ||
      q.includes('protect') ||
      q.includes('privacy')
    ) {
      addBotMessage(
        "🛡️ **Website Safety & Firewall Status: 100% SECURE**\n\n" +
          "• **Database Firewall:** Google Cloud Firestore rules reject any unauthorized data tampering or deletion.\n" +
          "• **Network Edge WAF:** Protected by global edge firewalls with automated DDoS and bot mitigation.\n" +
          "• **UPI Privacy Shield:** Author mobile digits are securely masked (`81******65@ptsbi`) to prevent phone scraping.\n" +
          "• **Anti-XSS:** Public comments and user inputs are strictly sanitized against script injection.",
        [
          { label: 'Check Live Traffic Radar 🟢', actionType: 'open_traffic' },
        ]
      );
      return;
    }

    // 4. UPI / Payment / Tipping Questions
    if (
      q.includes('upi') ||
      q.includes('tip') ||
      q.includes('donate') ||
      q.includes('money') ||
      q.includes('gpay') ||
      q.includes('phonepe') ||
      q.includes('paytm')
    ) {
      addBotMessage(
        "💳 **Direct UPI Tipping & VIP Unlocks:**\n\n" +
          "You can support authors or unlock novels with **0% transaction fees** via Indian UPI (GPay, PhonePe, Paytm, BHIM):\n\n" +
          "👉 **UPI ID:** `81******65@ptsbi` *(Phone number masked for privacy)*\n\n" +
          "Click the button below to copy the full valid UPI string to your clipboard!",
        [
          { label: '📋 Copy Full UPI ID', actionType: 'copy_upi' },
        ]
      );
      return;
    }

    // 5. Theme / Dark Mode / Display Questions
    if (
      q.includes('theme') ||
      q.includes('dark') ||
      q.includes('light') ||
      q.includes('sepia') ||
      q.includes('night') ||
      q.includes('color')
    ) {
      addBotMessage(
        "🎨 **Reading Theme Controller:**\n\n" +
          "You can toggle your reading atmosphere instantly! Which theme do you prefer?",
        [
          { label: '🌙 Dark Mode', actionType: 'switch_theme_dark' },
          { label: '📜 Cozy Sepia', actionType: 'switch_theme_sepia' },
          { label: '☀️ Clean Light', actionType: 'switch_theme_light' },
        ]
      );
      return;
    }

    // 6. Live Traffic / Readers Questions
    if (
      q.includes('traffic') ||
      q.includes('live') ||
      q.includes('active') ||
      q.includes('online') ||
      q.includes('reader count')
    ) {
      addBotMessage(
        "🟢 **Live Reader Traffic Radar:**\n\n" +
          "Our platform uses real-time Google Firebase presence to track actual readers online right now—100% genuine with zero fake numbers!",
        [
          { label: 'Open Live Traffic Radar 📡', actionType: 'open_traffic' },
        ]
      );
      return;
    }

    // 7. Book Recommendations by Genre or Keywords
    const lower = q;
    let matchedNovel: Novel | undefined;
    if (lower.includes('xianxia') || lower.includes('cultivat') || lower.includes('dao') || lower.includes('immortal')) {
      matchedNovel = novels.find((n) => n.genre.toLowerCase().includes('xianxia') || n.title.includes('Dao') || n.title.includes('Immortal'));
    } else if (lower.includes('litrpg') || lower.includes('game') || lower.includes('tower') || lower.includes('level') || lower.includes('mana')) {
      matchedNovel = novels.find((n) => n.genre.toLowerCase().includes('litrpg') || n.title.includes('Climber') || n.title.includes('Apocalypse'));
    } else if (lower.includes('cyber') || lower.includes('sci-fi') || lower.includes('robot') || lower.includes('future') || lower.includes('space')) {
      matchedNovel = novels.find((n) => n.genre.toLowerCase().includes('cyber') || n.genre.toLowerCase().includes('sci-fi') || n.title.includes('Silicon'));
    } else if (lower.includes('romance') || lower.includes('love') || lower.includes('duke') || lower.includes('witch')) {
      matchedNovel = novels.find((n) => n.genre.toLowerCase().includes('romance') || n.title.includes('Raven') || n.title.includes('Knight'));
    } else if (lower.includes('horror') || lower.includes('mystery') || lower.includes('detective') || lower.includes('noir')) {
      matchedNovel = novels.find((n) => n.genre.toLowerCase().includes('mystery') || n.genre.toLowerCase().includes('horror') || n.title.includes('Bloodhound'));
    }

    if (matchedNovel) {
      addBotMessage(
        `✨ **Recommended For You:**\n\n` +
          `📖 **${matchedNovel.title}** by *${matchedNovel.author}*\n` +
          `🏷️ Genre: ${matchedNovel.genre} • ${matchedNovel.chapters.length} Chapters\n\n` +
          `*${matchedNovel.synopsis.slice(0, 160)}...*`,
        [
          {
            label: `Read ${matchedNovel.title.slice(0, 20)}... ➔`,
            actionType: 'open_novel',
            payload: matchedNovel,
          },
        ]
      );
      return;
    }

    // 8. Bookmarks & Reading Stats
    if (q.includes('bookmark') || q.includes('history') || q.includes('save') || q.includes('stat')) {
      addBotMessage(
        "📑 **Your Library Tools:**\n\n" +
          "You can access your saved bookmarks and reading streaks anytime!",
        [
          { label: 'View Bookmarks 🔖', actionType: 'open_bookmarks' },
          { label: 'View Reading Stats 📊', actionType: 'open_stats' },
        ]
      );
      return;
    }

    // 9. Default Fallback
    addBotMessage(
      `🤖 I found relevant information about that! Here are quick shortcuts you can explore right now:`,
      [
        { label: '📖 Free Passes & VIP Unlocks', actionType: 'open_monetization' },
        { label: '✍️ Submit Story / Writer Studio', actionType: 'open_writer_studio' },
        { label: '🌙 Change Theme', actionType: 'switch_theme_dark' },
        { label: '🟢 Live Traffic Radar', actionType: 'open_traffic' },
      ]
    );
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white font-medium shadow-xl hover:shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-400/30 group"
            title="Ask RealmBot AI Assistant"
            aria-label="Open AI Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-amber-600 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-amber-600 rounded-full" />
            </div>
            <span className="text-sm font-semibold tracking-wide hidden sm:inline">Realm AI Assistant</span>
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
          </button>
        </div>
      )}

      {/* Main Bot Dialog / Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 ease-out ${
            isMinimized
              ? 'bottom-5 right-5 w-72 h-14'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[82vh]'
          }`}
        >
          <div className="flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-zinc-900 border-b border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display-title font-bold text-sm text-[var(--text-primary)]">RealmBot</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                      AI Guide
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Always Online • 100% Free</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label="Minimize or Expand Chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMessages([INITIAL_GREETING])}
                  className="p-1.5 hover:text-[var(--text-primary)] hover:bg-white/5 rounded-lg transition-colors"
                  title="Clear Chat History"
                  aria-label="Clear chat history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Close Assistant"
                  aria-label="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body & Chat Area (When not minimized) */}
            {!isMinimized && (
              <>
                {/* Messages List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin text-xs sm:text-sm">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-amber-600 text-white rounded-tr-none'
                            : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-none'
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {msg.text.split('**').map((part, idx) =>
                            idx % 2 === 1 ? (
                              <strong key={idx} className="font-semibold text-amber-400">
                                {part}
                              </strong>
                            ) : (
                              part
                            )
                          )}
                        </div>

                        {/* Interactive Action Chips */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(act)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30 transition-all hover:scale-102 active:scale-98"
                              >
                                <span>{act.label}</span>
                                <ChevronRight className="w-3 h-3 opacity-70" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-3 py-2 bg-[var(--bg-card)]/40 border-t border-[var(--border-subtle)] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
                  <button
                    onClick={() => respondToQuery('how do free passes work')}
                    className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] hover:bg-amber-500/15 text-[var(--text-secondary)] hover:text-amber-400 border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
                  >
                    📖 Reading Passes
                  </button>
                  <button
                    onClick={() => respondToQuery('how do i become a writer')}
                    className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] hover:bg-amber-500/15 text-[var(--text-secondary)] hover:text-amber-400 border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
                  >
                    ✍️ Writer 70% Cut
                  </button>
                  <button
                    onClick={() => respondToQuery('how do view count earnings work')}
                    className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] hover:bg-amber-500/15 text-[var(--text-secondary)] hover:text-amber-400 border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
                  >
                    💰 View Earnings
                  </button>
                  <button
                    onClick={() => respondToQuery('is website safe from hacking')}
                    className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] hover:bg-amber-500/15 text-[var(--text-secondary)] hover:text-amber-400 border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
                  >
                    🛡️ Security Shield
                  </button>
                  <button
                    onClick={() => respondToQuery('upi payments and tipping')}
                    className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] hover:bg-amber-500/15 text-[var(--text-secondary)] hover:text-amber-400 border border-[var(--border-subtle)] whitespace-nowrap transition-colors"
                  >
                    💳 UPI Tipping
                  </button>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask RealmBot anything..."
                    className="flex-1 px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all shadow-md"
                    title="Send Message"
                    aria-label="Send message to bot"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
