import { INITIAL_HOUSEHOLD } from '../constants/initialData';

const STORAGE_KEY = 'familyhealth_household_v2';
const QUEUE_KEY = 'familyhealth_sync_queue_v2';

export const storage = {
  load: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.members && parsed.members.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial dataset:', e);
    }
    return INITIAL_HOUSEHOLD;
  },

  save: (household) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(household));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return false;
    }
  },

  reset: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(QUEUE_KEY);
      return INITIAL_HOUSEHOLD;
    } catch (e) {
      console.error('Failed to reset storage:', e);
      return INITIAL_HOUSEHOLD;
    }
  },

  // Mutation Queue (Section 3.2 local_sync_mutation_queue)
  getMutationQueue: () => {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  queueMutation: (mutation) => {
    try {
      const q = storage.getMutationQueue();
      const newEntry = {
        mutationId: 'mut_' + Math.random().toString(36).substr(2, 9),
        deviceTimestamp: Date.now(),
        attemptCount: 0,
        ...mutation
      };
      q.push(newEntry);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
      return newEntry;
    } catch (e) {
      console.error('Failed to append to sync queue:', e);
    }
  },

  clearMutationQueue: () => {
    localStorage.removeItem(QUEUE_KEY);
  },

  exportJSON: (household) => {
    const jsonStr = JSON.stringify(household, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `familyhealth_backup_${household.head.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && parsed.members && parsed.records) {
            resolve(parsed);
          } else {
            reject(new Error('Invalid backup file schema: missing members or records.'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }
};
