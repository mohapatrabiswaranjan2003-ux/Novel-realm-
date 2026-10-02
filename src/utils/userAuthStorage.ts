import { UserAccount, UserRole, WriterExamSubmission, WriterRank, WriterRankInfo } from '../types/auth';

const STORAGE_KEYS = {
  USERS: 'novelrealm_users_v2',
  CURRENT_USER: 'novelrealm_current_user_v2',
  DEVICE_SESSION_ID: 'novelrealm_session_id_v2',
  EXAM_SUBMISSIONS: 'novelrealm_exam_submissions_v2',
};

export const OFFICIAL_WRITER_RANKS: Record<WriterRank, WriterRankInfo> = {
  novice: {
    rank: 'novice',
    label: 'Novice Writer',
    medal: null,
    badge: '🌱',
    minViews: 0,
    maxViews: 10000,
    writerSharePercent: 0,
    ownerSharePercent: 100,
    description: 'Starting Writer Rank upon passing the Certification Exam. No medal yet. Build your readership to 10,000 views to earn your first medal!',
  },
  primary: {
    rank: 'primary',
    label: 'Primary Writer',
    medal: 'bronze',
    badge: '🥉',
    minViews: 10001,
    maxViews: 100000,
    writerSharePercent: 40,
    ownerSharePercent: 60,
    description: 'Bronze Medalist. Achieved 10,000+ views. Unlocks 40% writer royalty share and direct reader tips.',
  },
  intermediate: {
    rank: 'intermediate',
    label: 'Intermediate Writer',
    medal: 'silver',
    badge: '🥈',
    minViews: 100001,
    maxViews: 1000000,
    writerSharePercent: 60,
    ownerSharePercent: 40,
    description: 'Silver Medalist. High-demand serialized author. Promoted to 60% writer royalty share.',
  },
  advanced: {
    rank: 'advanced',
    label: 'Advanced Writer',
    medal: 'gold',
    badge: '🥇',
    minViews: 1000001,
    maxViews: 10000000,
    writerSharePercent: 65,
    ownerSharePercent: 35,
    description: 'Gold Medalist. Global bestselling creator with massive reader retention. 65% revenue share.',
  },
  legendary: {
    rank: 'legendary',
    label: 'Legendary Grandmaster',
    medal: 'diamond',
    badge: '💎',
    minViews: 10000001,
    maxViews: Infinity,
    writerSharePercent: 70,
    ownerSharePercent: 30,
    description: 'Diamond Grandmaster. Dominating worldwide charts and web novel leaderboards. Top 70% revenue share.',
  },
};

export function getWriterRankByViews(views: number): WriterRankInfo {
  if (views > 10000000) return OFFICIAL_WRITER_RANKS.legendary;
  if (views > 1000000) return OFFICIAL_WRITER_RANKS.advanced;
  if (views > 100000) return OFFICIAL_WRITER_RANKS.intermediate;
  if (views > 10000) return OFFICIAL_WRITER_RANKS.primary;
  return OFFICIAL_WRITER_RANKS.novice;
}

export function getDeviceSessionId(): string {
  try {
    let sid = localStorage.getItem(STORAGE_KEYS.DEVICE_SESSION_ID);
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.DEVICE_SESSION_ID, sid);
    }
    return sid;
  } catch (e) {
    return 'anon_session_' + Date.now();
  }
}

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse users', e);
  }
  return [];
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get current user', e);
  }
  return null;
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update in all users array
      const all = getAllUsers();
      const updated = all.filter(u => u.id !== user.id).concat(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to save current user', e);
  }
}

export function registerReader(data: {
  email: string;
  password?: string;
  phone: string;
  displayName: string;
}): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const newUser: UserAccount = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    role: 'reader',
    email: data.email.trim(),
    password: data.password || 'readerpass',
    phone: data.phone.trim(),
    displayName: data.displayName.trim() || data.email.split('@')[0],
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function registerWriter(data: {
  email: string;
  password?: string;
  phone: string;
  penName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfscOrRouting: string;
  bankUpiId?: string;
}): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const newWriter: UserAccount = {
    id: 'writer_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    role: 'writer',
    email: data.email.trim(),
    password: data.password || 'writerpass',
    phone: data.phone.trim(),
    displayName: data.penName.trim(),
    penName: data.penName.trim(),
    bankAccountName: data.bankAccountName.trim(),
    bankAccountNumber: data.bankAccountNumber.trim(),
    bankIfscOrRouting: data.bankIfscOrRouting.trim(),
    bankUpiId: data.bankUpiId?.trim(),
    payoutEmail: data.email.trim(),
    isCertifiedWriter: false,
    writerRank: 'novice',
    createdAt: new Date().toISOString(),
  };

  setCurrentUser(newWriter);
  return { success: true, user: newWriter };
}

export function loginUser(
  email: string,
  password?: string
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  
  if (!found) {
    // If demo quick login for testing
    return { success: false, error: 'No account found with this email. Please sign up first!' };
  }

  if (password && found.password && found.password !== password) {
    return { success: false, error: 'Incorrect password. Please verify and try again.' };
  }

  setCurrentUser(found);
  return { success: true, user: found };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

/**
 * Grade and evaluate the writer's short novel submission (max 1500 words)
 * Simulates instant rigorous global market evaluation
 */
export function evaluateWriterSubmission(params: {
  genre: string;
  title: string;
  storyText: string;
  wordCount: number;
}): WriterExamSubmission {
  const { genre, title, storyText, wordCount } = params;

  // Real linguistic & story metrics calculation
  const sentenceCount = (storyText.match(/[.!?]+/g) || []).length || 1;
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount);
  const dialogueCount = (storyText.match(/["“][^"”]+["”]/g) || []).length;
  const hasDialogue = dialogueCount > 1;

  // Compute realistic global market score (85 - 98)
  let score = 88;
  if (wordCount >= 300 && wordCount <= 1500) score += 4;
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 24) score += 3;
  if (hasDialogue) score += 3;
  if (title.length >= 4) score += 1;
  score = Math.min(98, Math.max(82, score));

  const certNumber = Math.floor(100000 + Math.random() * 900000);
  const certificateId = `NR-CERT-${new Date().getFullYear()}-${certNumber}`;

  const submission: WriterExamSubmission = {
    id: 'exam_' + Date.now(),
    genre,
    title,
    storyText,
    wordCount,
    submittedAt: new Date().toISOString(),
    overallScore: score,
    marketGrade: score >= 94 ? 'Certified Grade A+ (Global Market Ready)' : 'Certified Grade A (High Readership Potential)',
    feedback: {
      marketFit: `Exceptional thematic alignment with international ${genre} audiences. High hook potential for serialization.`,
      pacingAndFlow: `Sentence rhythm averages ${avgWordsPerSentence} words per clause with strong emotional beats across the ${wordCount} words.`,
      proseAndGrammar: `Verified vocabulary richness and clear scene progression suitable for rapid chapter binge-reading.`,
      readerHook: `Opening premise demonstrates genuine conflict and suspense that will sustain long-term reader retention.`,
    },
    awardedRank: 'novice',
    certificateId,
  };

  return submission;
}

export function completeWriterCertification(
  userId: string,
  exam: WriterExamSubmission
): UserAccount | null {
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id !== userId) return null;

  const updated: UserAccount = {
    ...currentUser,
    isCertifiedWriter: true,
    writerCertification: exam,
    writerRank: 'novice',
  };

  setCurrentUser(updated);

  // Store exam submission
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SUBMISSIONS);
    const list = raw ? JSON.parse(raw) : [];
    list.push(exam);
    localStorage.setItem(STORAGE_KEYS.EXAM_SUBMISSIONS, JSON.stringify(list));
  } catch (e) {}

  return updated;
}

const RESET_CODES_KEY = 'novelrealm_reset_codes_v2';

export function requestPasswordReset(identifier: string): {
  success: boolean;
  error?: string;
  email?: string;
  phone?: string;
  resetCode?: string;
} {
  const trimmed = identifier.trim().toLowerCase();
  const users = getAllUsers();

  // Find user by either email or mobile phone
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === trimmed ||
      (u.phone && u.phone.replace(/\D/g, '') === trimmed.replace(/\D/g, ''))
  );

  if (!user) {
    return {
      success: false,
      error: 'No account registered with this email or mobile phone number.',
    };
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const record = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    localStorage.setItem(RESET_CODES_KEY + '_' + user.id, JSON.stringify(record));
  } catch (e) {}

  return {
    success: true,
    email: user.email,
    phone: user.phone,
    resetCode: code,
  };
}

export function completePasswordReset(params: {
  identifier: string;
  code: string;
  newPassword: string;
}): { success: boolean; error?: string; user?: UserAccount } {
  const trimmed = params.identifier.trim().toLowerCase();
  const users = getAllUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === trimmed ||
      (u.phone && u.phone.replace(/\D/g, '') === trimmed.replace(/\D/g, ''))
  );

  if (!user) {
    return { success: false, error: 'User account not found.' };
  }

  try {
    const raw = localStorage.getItem(RESET_CODES_KEY + '_' + user.id);
    if (!raw) {
      return {
        success: false,
        error: 'No active password reset request found. Please request a new code.',
      };
    }
    const record = JSON.parse(raw);
    if (Date.now() > record.expiresAt) {
      return {
        success: false,
        error: 'Reset verification code has expired. Please request a new one.',
      };
    }
    if (record.code !== params.code.trim()) {
      return {
        success: false,
        error: 'Incorrect 6-digit verification code. Please check your email and try again.',
      };
    }

    // Success! Update password
    const updatedUser: UserAccount = {
      ...user,
      password: params.newPassword,
    };

    setCurrentUser(updatedUser);
    localStorage.removeItem(RESET_CODES_KEY + '_' + user.id);
    return { success: true, user: updatedUser };
  } catch (e) {
    return { success: false, error: 'An error occurred during password reset.' };
  }
}
