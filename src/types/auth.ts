export type UserRole = 'reader' | 'writer';

export type WriterRank = 'novice' | 'primary' | 'intermediate' | 'advanced' | 'legendary';

export type WriterMedal = null | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface WriterRankInfo {
  rank: WriterRank;
  label: string;
  medal: WriterMedal;
  badge: string;
  minViews: number;
  maxViews: number;
  writerSharePercent: number;
  ownerSharePercent: number;
  description: string;
}

export interface WriterExamSubmission {
  id: string;
  genre: string;
  title: string;
  storyText: string;
  wordCount: number;
  submittedAt: string;
  overallScore: number; // 0 - 100
  marketGrade: string; // e.g. "Certified Global Contender A+"
  feedback: {
    marketFit: string;
    pacingAndFlow: string;
    proseAndGrammar: string;
    readerHook: string;
  };
  awardedRank: 'novice';
  certificateId: string;
}

export interface UserAccount {
  id: string;
  role: UserRole;
  email: string;
  password?: string;
  phone: string;
  displayName: string;
  createdAt: string;

  // Writer Specific Fields
  penName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfscOrRouting?: string;
  bankUpiId?: string; // UPI ID or Bank Transfer
  payoutEmail?: string;
  isCertifiedWriter?: boolean;
  writerCertification?: WriterExamSubmission;
  writerRank?: WriterRank;
}
