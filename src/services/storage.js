import { INITIAL_HOUSEHOLD } from '../constants/initialData';

const STORAGE_KEY = 'seihealth_household_v1';

export const storage = {
  load: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
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
      return INITIAL_HOUSEHOLD;
    } catch (e) {
      console.error('Failed to reset storage:', e);
      return INITIAL_HOUSEHOLD;
    }
  },

  exportJSON: (household) => {
    const jsonStr = JSON.stringify(household, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seihealth_backup_${household.head.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
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
