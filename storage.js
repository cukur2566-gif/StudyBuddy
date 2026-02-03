// localStorage operations wrapper
class StorageManager {
    // Save data to localStorage
    static save(key, data) {
        try {
            localStorage.setItem(`studybuddy_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
            return false;
        }
    }

    // Load data from localStorage
    static load(key) {
        try {
            const data = localStorage.getItem(`studybuddy_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return null;
        }
    }

    // Remove data from localStorage
    static remove(key) {
        try {
            localStorage.removeItem(`studybuddy_${key}`);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
            return false;
        }
    }

    // Clear all StudyBuddy data
    static clearAll() {
        const keys = ['tasks', 'habits', 'favorites', 'settings'];
        keys.forEach(key => this.remove(key));
    }

    // Export all data as JSON
    static exportData() {
        const data = {
            tasks: this.load('tasks') || [],
            habits: this.load('habits') || [],
            favorites: this.load('favorites') || [],
            settings: this.load('settings') || {},
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `studybuddy_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}