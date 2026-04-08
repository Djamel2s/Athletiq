import { apiFetch } from '~/utils/apiFetch';

const DB_NAME = 'athletiq_offline';
const DB_VERSION = 1;
const STORE_NAME = 'queue';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllFromStore(): Promise<any[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addToStore(item: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.add(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteFromStore(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function clearStore(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export const useOfflineStorage = () => {
  const isOnline = ref(true);
  const isSyncing = ref(false);
  const pendingCount = ref(0);

  if (process.client) {
    isOnline.value = navigator.onLine;
    window.addEventListener('online', () => {
      isOnline.value = true;
      syncQueue();
    });
    window.addEventListener('offline', () => {
      isOnline.value = false;
    });

    // Load pending count on init
    getAllFromStore()
      .then((items) => {
        pendingCount.value = items.length;
      })
      .catch((error) => {
        console.warn('Failed to load offline queue size:', error);
      });
  }

  const addToQueue = async (action: {
    type: string;
    endpoint: string;
    method: string;
    body: any;
  }) => {
    if (!process.client) return;
    try {
      await addToStore({ ...action, timestamp: Date.now() });
      pendingCount.value++;
    } catch {
      // Fallback to localStorage if IndexedDB fails
      try {
        const queue = JSON.parse(localStorage.getItem('athletiq_offline_fallback') || '[]');
        queue.push({ ...action, timestamp: Date.now() });
        localStorage.setItem('athletiq_offline_fallback', JSON.stringify(queue));
        pendingCount.value++;
      } catch (error) {
        console.warn('Failed to persist offline fallback queue:', error);
      }
    }
  };

  const syncQueue = async () => {
    if (!process.client || isSyncing.value) return;
    isSyncing.value = true;

    try {
      // Sync IndexedDB queue
      const items = await getAllFromStore();
      let synced = 0;
      for (const item of items) {
        try {
          await apiFetch(item.endpoint, {
            method: item.method,
            body: item.body,
          });
          await deleteFromStore(item.id);
          synced++;
        } catch {
          // Keep in queue for next sync
        }
      }

      // Sync localStorage fallback
      try {
        const fallback = JSON.parse(localStorage.getItem('athletiq_offline_fallback') || '[]');
        const failed: any[] = [];
        for (const item of fallback) {
          try {
            await apiFetch(item.endpoint, { method: item.method, body: item.body });
            synced++;
          } catch {
            failed.push(item);
          }
        }
        localStorage.setItem('athletiq_offline_fallback', JSON.stringify(failed));
      } catch (error) {
        console.warn('Failed to sync local fallback queue:', error);
      }

      // Update pending count
      const remaining = await getAllFromStore();
      const fallbackRemaining = JSON.parse(
        localStorage.getItem('athletiq_offline_fallback') || '[]'
      );
      pendingCount.value = remaining.length + fallbackRemaining.length;

      if (synced > 0 && pendingCount.value === 0) {
        const toast = useToast();
        toast.success('Donnees synchronisees !');
      }
    } catch (error) {
      console.warn('Failed to synchronize offline queue:', error);
    }

    isSyncing.value = false;
  };

  const clearQueue = async () => {
    if (!process.client) return;
    try {
      await clearStore();
      localStorage.setItem('athletiq_offline_fallback', '[]');
      pendingCount.value = 0;
    } catch (error) {
      console.warn('Failed to clear offline queue:', error);
    }
  };

  const getQueueSize = async (): Promise<number> => {
    if (!process.client) return 0;
    try {
      const items = await getAllFromStore();
      const fallback = JSON.parse(localStorage.getItem('athletiq_offline_fallback') || '[]');
      return items.length + fallback.length;
    } catch {
      return 0;
    }
  };

  return { isOnline, isSyncing, pendingCount, addToQueue, syncQueue, clearQueue, getQueueSize };
};
