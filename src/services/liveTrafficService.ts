import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface ActiveReaderSession {
  sessionId: string;
  lastActive: number;
  device: 'mobile' | 'desktop';
  novelId?: number;
  chapterId?: number;
  novelTitle?: string;
  country?: string;
}

export interface LiveTrafficData {
  totalActiveReaders: number;
  mobileCount: number;
  desktopCount: number;
  topReadingNovels: { title: string; readerCount: number }[];
  lastUpdated: number;
}

// Generate or retrieve persistent tab session ID
function getSessionId(): string {
  let id = sessionStorage.getItem('nr_reader_session_id');
  if (!id) {
    id = 'reader_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('nr_reader_session_id', id);
  }
  return id;
}

const isMobileDevice = (): boolean => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

let heartbeatInterval: NodeJS.Timeout | null = null;
let currentNovelContext: { novelId?: number; chapterId?: number; novelTitle?: string } = {};

/**
 * Updates the user's active reading location
 */
export async function updateReaderCurrentNovel(novelId?: number, chapterId?: number, novelTitle?: string) {
  currentNovelContext = { novelId, chapterId, novelTitle };
  try {
    const sessionId = getSessionId();
    const docRef = doc(db, 'live_readers', sessionId);
    await setDoc(docRef, {
      sessionId,
      device: isMobileDevice() ? 'mobile' : 'desktop',
      novelId: novelId || null,
      chapterId: chapterId || null,
      novelTitle: novelTitle || 'Browsing Library',
      lastActiveMs: Date.now(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    // Non-blocking for offline/adblockers
    console.debug('Live traffic update heartbeat deferred:', err);
  }
}

/**
 * Initialize genuine real-time traffic monitoring
 */
export function startLiveTrafficMonitoring(onTrafficChange: (data: LiveTrafficData) => void): () => void {
  const sessionId = getSessionId();
  const sessionDocRef = doc(db, 'live_readers', sessionId);

  // Send initial registration with mobile battery/RAM protection
  const sendHeartbeat = async () => {
    // Zero CPU/battery impact: Pause immediately if phone screen is locked or browser is minimized
    if (typeof document !== 'undefined' && document.hidden) return;
    try {
      await setDoc(sessionDocRef, {
        sessionId,
        device: isMobileDevice() ? 'mobile' : 'desktop',
        novelId: currentNovelContext.novelId || null,
        chapterId: currentNovelContext.chapterId || null,
        novelTitle: currentNovelContext.novelTitle || 'Browsing Library',
        lastActiveMs: Date.now(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch {
      // Ignore network hiccup
    }
  };

  sendHeartbeat();
  // Pulse heartbeat every 20 seconds
  heartbeatInterval = setInterval(sendHeartbeat, 20000);

  // Resume heartbeat immediately when user unlocks phone or switches back to tab
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      sendHeartbeat();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Clean up on tab close
  const handleUnload = () => {
    try {
      deleteDoc(sessionDocRef).catch(() => {});
    } catch {}
  };
  window.addEventListener('beforeunload', handleUnload);

  // Subscribe to real-time live readers collection
  const liveReadersCol = collection(db, 'live_readers');
  const unsubscribeSnapshot = onSnapshot(
    liveReadersCol,
    (snapshot) => {
      const now = Date.now();
      const cutoffTime = now - 60000; // Active within the last 60 seconds

      let mobile = 0;
      let desktop = 0;
      const novelsMap: Record<string, number> = {};
      let activeCount = 0;

      snapshot.docs.forEach((d) => {
        const data = d.data();
        const lastActive = data.lastActiveMs || 0;
        // Count only sessions active within 60 seconds
        if (lastActive >= cutoffTime) {
          activeCount++;
          if (data.device === 'mobile') mobile++;
          else desktop++;

          const title = data.novelTitle || 'Browsing Library';
          if (title !== 'Browsing Library') {
            novelsMap[title] = (novelsMap[title] || 0) + 1;
          }
        }
      });

      // Always at least 1 (the current user themselves!)
      const totalActive = Math.max(1, activeCount);
      if (activeCount === 0) {
        if (isMobileDevice()) mobile = 1;
        else desktop = 1;
      }

      const topReadingNovels = Object.entries(novelsMap)
        .map(([title, readerCount]) => ({ title, readerCount }))
        .sort((a, b) => b.readerCount - a.readerCount)
        .slice(0, 5);

      onTrafficChange({
        totalActiveReaders: totalActive,
        mobileCount: Math.max(isMobileDevice() ? 1 : 0, mobile),
        desktopCount: Math.max(!isMobileDevice() ? 1 : 0, desktop),
        topReadingNovels,
        lastUpdated: Date.now(),
      });
    },
    (error) => {
      console.warn('Real-time live traffic fallback active:', error);
      // Fallback: at least report 1 active user (self)
      onTrafficChange({
        totalActiveReaders: 1,
        mobileCount: isMobileDevice() ? 1 : 0,
        desktopCount: !isMobileDevice() ? 1 : 0,
        topReadingNovels: [],
        lastUpdated: Date.now(),
      });
    }
  );

  return () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleUnload);
    unsubscribeSnapshot();
    handleUnload();
  };
}
