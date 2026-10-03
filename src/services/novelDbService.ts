import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import { Novel, Chapter } from '../types/novel';
import { INITIAL_NOVELS } from '../data/novelsData';

const NOVELS_COLLECTION = 'novels';

/**
 * Fetch all novels from Firebase Firestore.
 * Automatically seeds the cloud database with INITIAL_NOVELS if empty.
 */
export async function getNovelsFromFirestore(): Promise<Novel[]> {
  try {
    const novelsCol = collection(db, NOVELS_COLLECTION);
    const snapshot = await Promise.race([
      getDocs(novelsCol),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore connection timeout')), 3500)
      ),
    ]);

    if (snapshot.empty) {
      // Seed Firestore with initial novels in background
      seedInitialNovelsToFirestore(INITIAL_NOVELS).catch((err) =>
        console.warn('Initial seeding in background:', err)
      );
      return INITIAL_NOVELS;
    }

    const novels: Novel[] = [];
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      // Load chapters subcollection for this novel
      const chaptersCol = collection(db, `${NOVELS_COLLECTION}/${docSnap.id}/chapters`);
      const chaptersSnap = await getDocs(query(chaptersCol, orderBy('chapterNumber', 'asc')));
      
      const chapters: Chapter[] = chaptersSnap.docs.map((cDoc) => ({
        id: Number(cDoc.id) || Number(cDoc.data().id) || 1,
        novelId: Number(docSnap.id),
        chapterNumber: cDoc.data().chapterNumber || 1,
        title: cDoc.data().title || `Chapter ${cDoc.data().chapterNumber}`,
        content: cDoc.data().content || '',
        wordCount: cDoc.data().wordCount || 1000,
        estimatedReadMinutes: cDoc.data().estimatedReadMinutes || 5,
        releaseDate: cDoc.data().releaseDate || '2026',
        authorNote: cDoc.data().authorNote,
      }));

      novels.push({
        id: Number(docSnap.id),
        title: data.title || '',
        author: data.author || '',
        genre: data.genre || 'Fantasy',
        tags: data.tags || [],
        status: data.status || 'Ongoing',
        rating: data.rating || 4.8,
        ratingCount: data.ratingCount || 100,
        totalViews: data.totalViews || '10K',
        viewCount: data.viewCount || 10000,
        synopsis: data.synopsis || '',
        publishedYear: data.publishedYear || 2026,
        coverImage: data.coverImage,
        fallbackGradient: data.fallbackGradient || 'from-indigo-900 to-purple-900',
        featured: data.featured || false,
        chapters: chapters.length > 0 ? chapters : (INITIAL_NOVELS.find(n => n.id === Number(docSnap.id))?.chapters || []),
        authorUpi: data.authorUpi,
        authorEmail: data.authorEmail,
      });
    }

    // Merge any INITIAL_NOVELS not yet in Firestore
    const existingIds = new Set(novels.map(n => n.id));
    const missingInitial = INITIAL_NOVELS.filter(n => !existingIds.has(n.id));
    if (missingInitial.length > 0) {
      seedInitialNovelsToFirestore(missingInitial).catch(err => console.warn('Syncing new novels:', err));
      novels.push(...missingInitial);
    }

    return novels.length > 0 ? novels : INITIAL_NOVELS;
  } catch (error) {
    console.debug('Using local novels catalog (offline-first mode active).');
    return INITIAL_NOVELS;
  }
}

/**
 * Seed initial catalog to Firestore
 */
export async function seedInitialNovelsToFirestore(novels: Novel[]) {
  try {
    for (const novel of novels) {
      const novelDocRef = doc(db, NOVELS_COLLECTION, String(novel.id));
      await setDoc(novelDocRef, {
        title: novel.title,
        author: novel.author,
        genre: novel.genre,
        tags: novel.tags,
        status: novel.status,
        rating: novel.rating,
        ratingCount: novel.ratingCount,
        totalViews: novel.totalViews,
        viewCount: novel.viewCount,
        synopsis: novel.synopsis,
        publishedYear: novel.publishedYear,
        fallbackGradient: novel.fallbackGradient,
        featured: novel.featured || false,
        chaptersCount: novel.chapters.length,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Save initial chapters
      for (const chapter of novel.chapters.slice(0, 10)) {
        const chapterRef = doc(db, `${NOVELS_COLLECTION}/${novel.id}/chapters`, String(chapter.id));
        await setDoc(chapterRef, {
          id: chapter.id,
          novelId: novel.id,
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          content: chapter.content,
          wordCount: chapter.wordCount,
          estimatedReadMinutes: chapter.estimatedReadMinutes,
          releaseDate: chapter.releaseDate,
          authorNote: chapter.authorNote || null,
        }, { merge: true });
      }
    }
  } catch (err: any) {
    if (err?.code !== 'permission-denied' && !err?.message?.includes('permission')) {
      console.warn('Seeding note:', err);
    }
  }
}

/**
 * Save user reading bookmark to Firestore cloud
 */
export async function saveUserCloudBookmark(userId: string, novelId: number, chapterNumber: number) {
  try {
    // Only attempt Firestore cloud backup if Firebase Auth session is active
    if (!auth.currentUser) {
      return;
    }
    const targetUid = auth.currentUser.uid;
    const progressRef = doc(db, `users/${targetUid}/progress/${novelId}`);
    await setDoc(progressRef, {
      novelId,
      lastChapter: chapterNumber,
      updatedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    }, { merge: true });
  } catch (error: any) {
    if (error?.code !== 'permission-denied' && !error?.message?.includes('permission')) {
      console.warn('Cloud bookmark sync notice:', error);
    }
  }
}

/**
 * Get user reading bookmark from Firestore cloud
 */
export async function getUserCloudBookmark(userId: string, novelId: number): Promise<number | null> {
  try {
    if (!auth.currentUser) return null;
    const targetUid = auth.currentUser.uid;
    const progressRef = doc(db, `users/${targetUid}/progress/${novelId}`);
    const snap = await getDoc(progressRef);
    if (snap.exists()) {
      return snap.data()?.lastChapter || null;
    }
    return null;
  } catch {
    return null;
  }
}
