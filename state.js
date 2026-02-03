// Application State Management
class AppState {
    constructor() {
        this.tasks = this.loadState('tasks') || [];
        this.habits = this.loadState('habits') || [];
        this.favorites = this.loadState('favorites') || [];
        this.settings = this.loadState('settings') || { theme: 'light' };
        this.editingTaskId = null;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentSort = 'dueDate';
        this.resourceCategory = 'all';
        this.searchQuery = '';
        this.resources = [];
    }

    // Load state from localStorage
    loadState(key) {
        try {
            const data = localStorage.getItem(`studybuddy_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return null;
        }
    }

    // Save state to localStorage
    saveState(key, data) {
        try {
            localStorage.setItem(`studybuddy_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }

    // Update methods
    updateTasks(tasks) {
        this.tasks = tasks;
        this.saveState('tasks', tasks);
    }

    updateHabits(habits) {
        this.habits = habits;
        this.saveState('habits', habits);
    }

    updateFavorites(favorites) {
        this.favorites = favorites;
        this.saveState('favorites', favorites);
    }

    updateSettings(settings) {
        this.settings = settings;
        this.saveState('settings', settings);
    }

    // Task methods
    addTask(task) {
        const newTask = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            completed: false,
            ...task
        };
        this.tasks.push(newTask);
        this.updateTasks(this.tasks);
        return newTask;
    }

    updateTask(id, updates) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updates };
            this.updateTasks(this.tasks);
            return true;
        }
        return false;
    }

    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.updateTasks(this.tasks);
            return true;
        }
        return false;
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        // Apply filter
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(task => task.category === this.currentCategory);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (this.currentSort === 'dueDate') {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (this.currentSort === 'priority') {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (this.currentSort === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        return filtered;
    }

    // Habit methods
    addHabit(habit) {
        const weekStart = this.getWeekStartDate();
        const newHabit = {
            id: Date.now(),
            name: habit.name,
            goal: parseInt(habit.goal),
            progress: Array(7).fill(false),
            weekStart: weekStart,
            createdAt: new Date().toISOString()
        };
        this.habits.push(newHabit);
        this.updateHabits(this.habits);
        return newHabit;
    }

    updateHabit(id, updates) {
        const index = this.habits.findIndex(habit => habit.id === id);
        if (index !== -1) {
            this.habits[index] = { ...this.habits[index], ...updates };
            this.updateHabits(this.habits);
            return true;
        }
        return false;
    }

    deleteHabit(id) {
        const index = this.habits.findIndex(habit => habit.id === id);
        if (index !== -1) {
            this.habits.splice(index, 1);
            this.updateHabits(this.habits);
            return true;
        }
        return false;
    }

    toggleHabitDay(habitId, dayIndex) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return false;

        // Check if we need to reset for new week
        const currentWeekStart = this.getWeekStartDate();
        if (habit.weekStart !== currentWeekStart) {
            habit.progress = Array(7).fill(false);
            habit.weekStart = currentWeekStart;
        }

        habit.progress[dayIndex] = !habit.progress[dayIndex];
        return this.updateHabit(habitId, {
            progress: habit.progress,
            weekStart: habit.weekStart
        });
    }

    getWeekStartDate() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
        const diff = dayOfWeek === 0 ? -6 : 1; // Start week on Monday
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek - diff));
        return monday.toISOString().split('T')[0];
    }

    // Favorites methods
    toggleFavorite(id) {
        const index = this.favorites.indexOf(id);
        if (index === -1) {
            this.favorites.push(id);
        } else {
            this.favorites.splice(index, 1);
        }
        this.updateFavorites(this.favorites);
        return index === -1; // Returns true if added, false if removed
    }

    isFavorite(id) {
        return this.favorites.includes(id);
    }

    // Settings methods
    setTheme(theme) {
        this.settings.theme = theme;
        this.updateSettings(this.settings);
        return theme;
    }

    // Reset all data
    resetAllData() {
        this.tasks = [];
        this.habits = [];
        this.favorites = [];
        this.settings = { theme: 'light' };
        
        // Clear localStorage
        localStorage.removeItem('studybuddy_tasks');
        localStorage.removeItem('studybuddy_habits');
        localStorage.removeItem('studybuddy_favorites');
        localStorage.removeItem('studybuddy_settings');
        
        // Reset UI state
        this.editingTaskId = null;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentSort = 'dueDate';
        this.resourceCategory = 'all';
        this.searchQuery = '';
    }

    // Dashboard statistics
    getDashboardStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        // Habit progress
        let habitsProgress = 0;
        if (this.habits.length > 0) {
            const totalGoals = this.habits.reduce((sum, habit) => sum + habit.goal, 0);
            const completedDays = this.habits.reduce((sum, habit) => 
                sum + habit.progress.filter(Boolean).length, 0);
            habitsProgress = Math.round((completedDays / totalGoals) * 100);
        }
        
        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            habitsProgress,
            favoritesCount: this.favorites.length
        };
    }
}

// Initialize global state
const appState = new AppState();