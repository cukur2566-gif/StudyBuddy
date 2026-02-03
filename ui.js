// DOM Manipulation and UI Functions
class UI {
    constructor() {
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateDashboard();
        this.renderTasks();
        this.renderHabits();
        this.loadResources();
        this.applyTheme();
    }

    cacheDOM() {
        // Navigation
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.getElementById('hamburger');
        this.mobileNav = document.getElementById('mobileNav');
        
        // Sections
        this.sections = document.querySelectorAll('.section');
        
        // Dashboard elements
        this.pendingTasksEl = document.getElementById('pendingTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.habitsProgressEl = document.getElementById('habitsProgress');
        this.favoritesCountEl = document.getElementById('favoritesCount');
        this.dashboardTasksEl = document.getElementById('dashboardTasks');
        this.habitsChartEl = document.getElementById('habitsChart');
        
        // Quick action buttons
        this.quickAddTaskBtn = document.getElementById('quickAddTask');
        this.quickAddHabitBtn = document.getElementById('quickAddHabit');
        this.quickViewResourcesBtn = document.getElementById('quickViewResources');
        
        // Task elements
        this.taskForm = document.getElementById('taskForm');
        this.taskTitle = document.getElementById('taskTitle');
        this.taskCategory = document.getElementById('taskCategory');
        this.taskDueDate = document.getElementById('taskDueDate');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskDescription = document.getElementById('taskDescription');
        this.taskSubmitBtn = document.getElementById('taskSubmitBtn');
        this.taskCancelBtn = document.getElementById('taskCancelBtn');
        this.tasksListEl = document.getElementById('tasksList');
        
        // Task controls
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sortTasks');
        this.categoryFilter = document.getElementById('filterCategory');
        
        // Habit elements
        this.habitForm = document.getElementById('habitForm');
        this.habitName = document.getElementById('habitName');
        this.habitGoal = document.getElementById('habitGoal');
        this.habitsGridEl = document.getElementById('habitsGrid');
        
        // Habit summary
        this.totalHabitsEl = document.getElementById('totalHabits');
        this.achievedGoalsEl = document.getElementById('achievedGoals');
        this.successRateEl = document.getElementById('successRate');
        
        // Resource elements
        this.resourceSearch = document.getElementById('resourceSearch');
        this.resourceCategory = document.getElementById('resourceCategory');
        this.resourcesGridEl = document.getElementById('resourcesGrid');
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.retryLoadBtn = document.getElementById('retryLoad');
        
        // Settings elements
        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.exportDataBtn = document.getElementById('exportData');
        this.resetDataBtn = document.getElementById('resetData');
        
        // Modal
        this.modal = document.getElementById('confirmationModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.modalConfirm = document.getElementById('modalConfirm');
        this.modalCancel = document.getElementById('modalCancel');
    }

    bindEvents() {
        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        this.hamburger.addEventListener('click', () => this.toggleMobileNav());
        
        // Quick actions
        this.quickAddTaskBtn.addEventListener('click', () => this.showSection('tasks'));
        this.quickAddHabitBtn.addEventListener('click', () => this.showSection('habits'));
        this.quickViewResourcesBtn.addEventListener('click', () => this.showSection('resources'));
        
        // Task form
        this.taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        this.taskCancelBtn.addEventListener('click', () => this.cancelTaskEdit());
        
        // Task controls
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTaskFilter(e));
        });
        this.sortSelect.addEventListener('change', () => this.handleTaskSort());
        this.categoryFilter.addEventListener('change', () => this.handleTaskCategoryFilter());
        
        // Habit form
        this.habitForm.addEventListener('submit', (e) => this.handleHabitSubmit(e));
        
        // Resource controls
        this.resourceSearch.addEventListener('input', () => this.filterResources());
        this.resourceCategory.addEventListener('change', () => this.filterResources());
        this.retryLoadBtn.addEventListener('click', () => this.loadResources());
        
        // Settings
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleThemeChange(e));
        });
        this.exportDataBtn.addEventListener('click', () => StorageManager.exportData());
        this.resetDataBtn.addEventListener('click', () => this.showResetConfirmation());
        
        // Modal
        this.modalCancel.addEventListener('click', () => this.hideModal());
        
        // Listen for hash changes (for browser back/forward)
        window.addEventListener('hashchange', () => this.handleHashChange());
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        
        const link = e.currentTarget;
        const sectionId = link.getAttribute('data-section');
        
        this.showSection(sectionId);
        this.updateActiveNav(link);
        
        // Close mobile nav if open
        if (this.mobileNav.classList.contains('active')) {
            this.toggleMobileNav();
        }
    }

    showSection(sectionId) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update URL hash
        window.location.hash = sectionId;
    }

    updateActiveNav(activeLink) {
        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    toggleMobileNav() {
        this.mobileNav.classList.toggle('active');
        const icon = this.hamburger.querySelector('i');
        if (this.mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        const link = document.querySelector(`.nav-link[data-section="${hash}"]`);
        
        if (link) {
            this.showSection(hash);
            this.updateActiveNav(link);
        }
    }

    // Dashboard
    updateDashboard() {
        const stats = appState.getDashboardStats();
        
        // Update stats
        this.pendingTasksEl.textContent = stats.pendingTasks;
        this.completedTasksEl.textContent = stats.completedTasks;
        this.habitsProgressEl.textContent = `${stats.habitsProgress}%`;
        this.favoritesCountEl.textContent = stats.favoritesCount;
        
        // Update upcoming tasks
        this.renderDashboardTasks();
        
        // Update habits chart
        this.renderHabitsChart();
    }

    renderDashboardTasks() {
        const upcomingTasks = appState.tasks
            .filter(task => !task.completed)
            .sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            })
            .slice(0, 5); // Show only 5 tasks
        
        if (upcomingTasks.length === 0) {
            this.dashboardTasksEl.innerHTML = '<p class="empty-state">No upcoming tasks</p>';
            return;
        }
        
        const tasksHTML = upcomingTasks.map(task => `
            <div class="task-item dashboard-task">
                <div class="task-info">
                    <h4>${this.escapeHTML(task.title)}</h4>
                    <div class="task-meta">
                        ${task.dueDate ? `<span><i class="fas fa-calendar"></i> ${this.formatDate(task.dueDate)}</span>` : ''}
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                    </div>
                </div>
                <button class="complete-btn" data-id="${task.id}" title="Mark as complete">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `).join('');
        
        this.dashboardTasksEl.innerHTML = tasksHTML;
        
        // Add event listeners to complete buttons
        this.dashboardTasksEl.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.toggleTaskComplete(taskId);
            });
        });
    }

    renderHabitsChart() {
        if (appState.habits.length === 0) {
            this.habitsChartEl.innerHTML = '<p class="empty-state">No habits tracked yet</p>';
            return;
        }
        
        const habitsHTML = appState.habits.map(habit => {
            const completedDays = habit.progress.filter(Boolean).length;
            const progressPercent = Math.round((completedDays / habit.goal) * 100);
            
            return `
                <div class="habit-progress-item">
                    <div class="habit-name">${this.escapeHTML(habit.name)}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>${completedDays}/${habit.goal} days</span>
                        <span>${progressPercent}%</span>
                    </div>
                </div>
            `;
        }).join('');
        
        this.habitsChartEl.innerHTML = habitsHTML;
    }

    // Tasks
    handleTaskSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateTaskForm()) {
            return;
        }
        
        const taskData = {
            title: this.taskTitle.value.trim(),
            category: this.taskCategory.value,
            dueDate: this.taskDueDate.value || null,
            priority: this.taskPriority.value,
            description: this.taskDescription.value.trim()
        };
        
        if (appState.editingTaskId) {
            // Update existing task
            const success = appState.updateTask(appState.editingTaskId, taskData);
            if (success) {
                this.showNotification('Task updated successfully!', 'success');
            }
            appState.editingTaskId = null;
            this.taskSubmitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
            this.taskCancelBtn.style.display = 'none';
        } else {
            // Add new task
            appState.addTask(taskData);
            this.showNotification('Task added successfully!', 'success');
        }
        
        // Reset form
        this.taskForm.reset();
        
        // Update UI
        this.renderTasks();
        this.updateDashboard();
    }

    validateTaskForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
        
        // Validate title
        if (!this.taskTitle.value.trim()) {
            document.getElementById('titleError').textContent = 'Title is required';
            document.getElementById('titleError').style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }

    cancelTaskEdit() {
        appState.editingTaskId = null;
        this.taskForm.reset();
        this.taskSubmitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Task';
        this.taskCancelBtn.style.display = 'none';
        
        // Clear errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    renderTasks() {
        const tasks = appState.getFilteredTasks();
        
        if (tasks.length === 0) {
            this.tasksListEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tasks found. ${appState.currentFilter !== 'all' ? 'Try changing the filter.' : 'Add your first task above!'}</p>
                </div>
            `;
            return;
        }
        
        const tasksHTML = tasks.map(task => {
            const priorityClass = `priority-${task.priority}`;
            const dueDateText = task.dueDate ? this.formatDate(task.dueDate) : 'No due date';
            const dueDateClass = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed ? 'overdue' : '';
            
            return `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="task-info">
                        <h4>
                            ${task.completed ? '<i class="fas fa-check-circle text-success"></i>' : ''}
                            ${this.escapeHTML(task.title)}
                        </h4>
                        ${task.description ? `<p class="task-description">${this.escapeHTML(task.description)}</p>` : ''}
                        <div class="task-meta">
                            <span class="category-badge">${task.category}</span>
                            <span class="${dueDateClass}"><i class="fas fa-calendar"></i> ${dueDateText}</span>
                            <span class="priority-badge ${priorityClass}">${task.priority}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="complete-btn" data-id="${task.id}" title="${task.completed ? 'Mark as active' : 'Mark as complete'}">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="edit-btn" data-id="${task.id}" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${task.id}" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        this.tasksListEl.innerHTML = tasksHTML;
        
        // Add event listeners using event delegation
        this.tasksListEl.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            
            const taskId = parseInt(target.getAttribute('data-id'));
            
            if (target.classList.contains('complete-btn')) {
                this.toggleTaskComplete(taskId);
            } else if (target.classList.contains('edit-btn')) {
                this.editTask(taskId);
            } else if (target.classList.contains('delete-btn')) {
                this.deleteTask(taskId);
            }
        });
    }

    toggleTaskComplete(taskId) {
        const task = appState.getTask(taskId);
        if (task) {
            const success = appState.updateTask(taskId, { completed: !task.completed });
            if (success) {
                this.renderTasks();
                this.updateDashboard();
                this.showNotification(`Task marked as ${!task.completed ? 'complete' : 'active'}!`, 'success');
            }
        }
    }

    editTask(taskId) {
        const task = appState.getTask(taskId);
        if (!task) return;
        
        appState.editingTaskId = taskId;
        
        // Fill form with task data
        this.taskTitle.value = task.title;
        this.taskCategory.value = task.category;
        this.taskDueDate.value = task.dueDate || '';
        this.taskPriority.value = task.priority;
        this.taskDescription.value = task.description || '';
        
        // Update button text
        this.taskSubmitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        this.taskCancelBtn.style.display = 'inline-flex';
        
        // Scroll to form
        this.taskForm.scrollIntoView({ behavior: 'smooth' });
    }

    deleteTask(taskId) {
        this.showConfirmationModal(
            'Delete Task',
            'Are you sure you want to delete this task? This action cannot be undone.',
            () => {
                const success = appState.deleteTask(taskId);
                if (success) {
                    this.renderTasks();
                    this.updateDashboard();
                    this.showNotification('Task deleted successfully!', 'success');
                }
            }
        );
    }

    handleTaskFilter(e) {
        const filter = e.currentTarget.getAttribute('data-filter');
        
        // Update active filter button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });
        
        // Update state and render
        appState.currentFilter = filter;
        this.renderTasks();
    }

    handleTaskSort() {
        appState.currentSort = this.sortSelect.value;
        this.renderTasks();
    }

    handleTaskCategoryFilter() {
        appState.currentCategory = this.categoryFilter.value;
        this.renderTasks();
    }

    // Habits
    handleHabitSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateHabitForm()) {
            return;
        }
        
        const habitData = {
            name: this.habitName.value.trim(),
            goal: this.habitGoal.value
        };
        
        appState.addHabit(habitData);
        this.showNotification('Habit added successfully!', 'success');
        
        // Reset form
        this.habitForm.reset();
        
        // Update UI
        this.renderHabits();
        this.updateDashboard();
    }

    validateHabitForm() {
        let isValid = true;
        
        // Clear previous errors
        document.getElementById('habitNameError').style.display = 'none';
        
        // Validate name
        if (!this.habitName.value.trim()) {
            document.getElementById('habitNameError').textContent = 'Habit name is required';
            document.getElementById('habitNameError').style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }

    renderHabits() {
        const habits = appState.habits;
        
        if (habits.length === 0) {
            this.habitsGridEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-bar"></i>
                    <p>No habits yet. Start building your first habit!</p>
                </div>
            `;
            this.updateHabitSummary();
            return;
        }
        
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const currentWeekStart = appState.getWeekStartDate();
        
        const habitsHTML = habits.map(habit => {
            // Check if we need to reset for new week
            const needsReset = habit.weekStart !== currentWeekStart;
            const progress = needsReset ? Array(7).fill(false) : habit.progress;
            
            const completedDays = progress.filter(Boolean).length;
            const progressPercent = Math.round((completedDays / habit.goal) * 100);
            
            const dayCells = days.map((day, index) => {
                const isCompleted = progress[index];
                return `
                    <div class="day-cell ${isCompleted ? 'completed' : ''}" 
                         data-habit-id="${habit.id}" 
                         data-day-index="${index}"
                         title="${day} - ${isCompleted ? 'Completed' : 'Not completed'}">
                        <span class="day-label">${day}</span>
                        ${isCompleted ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                `;
            }).join('');
            
            return `
                <div class="habit-card">
                    <div class="habit-header">
                        <div>
                            <div class="habit-name">${this.escapeHTML(habit.name)}</div>
                            <div class="habit-goal">
                                <i class="fas fa-bullseye"></i>
                                Goal: ${completedDays}/${habit.goal} days this week
                                ${needsReset ? '<span class="badge badge-warning">New Week!</span>' : ''}
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger delete-habit-btn" data-id="${habit.id}" title="Delete habit">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    
                    <div class="week-grid">
                        ${dayCells}
                    </div>
                    
                    <div class="habit-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="progress-text">
                            <span>${progressPercent}% complete</span>
                            <span>${completedDays}/${habit.goal} days</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.habitsGridEl.innerHTML = habitsHTML;
        
        // Add event listeners for day cells
        this.habitsGridEl.addEventListener('click', (e) => {
            const dayCell = e.target.closest('.day-cell');
            if (dayCell) {
                const habitId = parseInt(dayCell.getAttribute('data-habit-id'));
                const dayIndex = parseInt(dayCell.getAttribute('data-day-index'));
                this.toggleHabitDay(habitId, dayIndex);
            }
            
            // Handle delete button
            const deleteBtn = e.target.closest('.delete-habit-btn');
            if (deleteBtn) {
                const habitId = parseInt(deleteBtn.getAttribute('data-id'));
                this.deleteHabit(habitId);
            }
        });
        
        this.updateHabitSummary();
    }

    toggleHabitDay(habitId, dayIndex) {
        const success = appState.toggleHabitDay(habitId, dayIndex);
        if (success) {
            this.renderHabits();
            this.updateDashboard();
        }
    }

    deleteHabit(habitId) {
        this.showConfirmationModal(
            'Delete Habit',
            'Are you sure you want to delete this habit? All progress will be lost.',
            () => {
                const success = appState.deleteHabit(habitId);
                if (success) {
                    this.renderHabits();
                    this.updateDashboard();
                    this.showNotification('Habit deleted successfully!', 'success');
                }
            }
        );
    }

    updateHabitSummary() {
        const habits = appState.habits;
        const totalHabits = habits.length;
        
        if (totalHabits === 0) {
            this.totalHabitsEl.textContent = '0';
            this.achievedGoalsEl.textContent = '0';
            this.successRateEl.textContent = '0%';
            return;
        }
        
        const totalGoals = habits.reduce((sum, habit) => sum + habit.goal, 0);
        const completedDays = habits.reduce((sum, habit) => 
            sum + habit.progress.filter(Boolean).length, 0);
        
        const achievedGoals = habits.filter(habit => {
            const completed = habit.progress.filter(Boolean).length;
            return completed >= habit.goal;
        }).length;
        
        const successRate = Math.round((achievedGoals / totalHabits) * 100);
        
        this.totalHabitsEl.textContent = totalHabits;
        this.achievedGoalsEl.textContent = `${achievedGoals}/${totalHabits}`;
        this.successRateEl.textContent = `${successRate}%`;
    }

    // Resources
    async loadResources() {
        this.showLoadingState();
        
        try {
            const response = await fetch('./resources.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const resources = await response.json();
            appState.resources = resources;
            this.renderResources();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Error loading resources:', error);
            this.showErrorState();
        }
    }

    showLoadingState() {
        this.loadingState.style.display = 'block';
        this.errorState.style.display = 'none';
        this.resourcesGridEl.style.display = 'none';
    }

    hideLoadingState() {
        this.loadingState.style.display = 'none';
        this.resourcesGridEl.style.display = 'grid';
    }

    showErrorState() {
        this.loadingState.style.display = 'none';
        this.errorState.style.display = 'block';
        this.resourcesGridEl.style.display = 'none';
    }

    renderResources() {
        if (!appState.resources || appState.resources.length === 0) {
            this.resourcesGridEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <p>No resources available. Check back later!</p>
                </div>
            `;
            return;
        }
        
        let filteredResources = [...appState.resources];
        
        // Apply category filter
        if (appState.resourceCategory !== 'all') {
            filteredResources = filteredResources.filter(
                resource => resource.category === appState.resourceCategory
            );
        }
        
        // Apply search filter
        if (appState.searchQuery) {
            const query = appState.searchQuery.toLowerCase();
            filteredResources = filteredResources.filter(resource =>
                resource.title.toLowerCase().includes(query) ||
                resource.description.toLowerCase().includes(query) ||
                resource.category.toLowerCase().includes(query)
            );
        }
        
        if (filteredResources.length === 0) {
            this.resourcesGridEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No resources found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        const resourcesHTML = filteredResources.map(resource => {
            const isFavorite = appState.isFavorite(resource.id);
            
            return `
                <div class="resource-card">
                    <div class="resource-header">
                        <div>
                            <h4 class="resource-title">${this.escapeHTML(resource.title)}</h4>
                            <span class="resource-category">${resource.category}</span>
                        </div>
                        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" 
                                data-id="${resource.id}"
                                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                            <i class="fas ${isFavorite ? 'fa-star' : 'fa-star'}"></i>
                        </button>
                    </div>
                    
                    <p class="resource-description">${this.escapeHTML(resource.description)}</p>
                    
                    <a href="${resource.link}" class="resource-link" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Resource
                    </a>
                </div>
            `;
        }).join('');
        
        this.resourcesGridEl.innerHTML = resourcesHTML;
        
        // Add event listeners for favorite buttons
        this.resourcesGridEl.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                const resourceId = parseInt(favoriteBtn.getAttribute('data-id'));
                this.toggleFavorite(resourceId, favoriteBtn);
            }
        });
    }

    filterResources() {
        appState.searchQuery = this.resourceSearch.value.trim();
        appState.resourceCategory = this.resourceCategory.value;
        this.renderResources();
    }

    toggleFavorite(resourceId, button) {
        const added = appState.toggleFavorite(resourceId);
        
        // Update button appearance
        const icon = button.querySelector('i');
        if (added) {
            button.classList.add('favorited');
            icon.classList.remove('fa-star');
            icon.classList.add('fa-star');
            button.setAttribute('title', 'Remove from favorites');
        } else {
            button.classList.remove('favorited');
            button.setAttribute('title', 'Add to favorites');
        }
        
        // Update dashboard
        this.updateDashboard();
        
        // Show notification
        this.showNotification(
            added ? 'Added to favorites!' : 'Removed from favorites!',
            'success'
        );
    }

    // Settings
    handleThemeChange(e) {
        const theme = e.currentTarget.getAttribute('data-theme');
        
        // Update active theme button
        this.themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            }
        });
        
        // Apply theme
        this.applyTheme(theme);
    }

    applyTheme(theme = null) {
        if (!theme) {
            theme = appState.settings.theme;
        }
        
        // Update app state
        appState.setTheme(theme);
        
        // Update DOM
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }

    showResetConfirmation() {
        this.showConfirmationModal(
            'Reset All Data',
            'Are you sure you want to reset all data? This will delete all tasks, habits, favorites, and settings. This action cannot be undone!',
            () => {
                appState.resetAllData();
                this.init(); // Reinitialize the UI
                this.showNotification('All data has been reset!', 'success');
            }
        );
    }

    // Modal
    showConfirmationModal(title, message, onConfirm) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modal.classList.add('active');
        
        // Remove previous event listeners
        const newConfirmBtn = this.modalConfirm.cloneNode(true);
        this.modalConfirm.parentNode.replaceChild(newConfirmBtn, this.modalConfirm);
        this.modalConfirm = newConfirmBtn;
        
        // Add new event listener
        this.modalConfirm.addEventListener('click', () => {
            onConfirm();
            this.hideModal();
        });
    }

    hideModal() {
        this.modal.classList.remove('active');
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add styles for notification
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    background: var(--bg-card);
                    color: var(--text-primary);
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 3000;
                    transform: translateX(150%);
                    transition: transform 0.3s ease;
                    max-width: 350px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-success {
                    border-left: 4px solid var(--success-color);
                }
                .notification-info {
                    border-left: 4px solid var(--primary-color);
                }
                .notification i {
                    font-size: 1.25rem;
                }
                .notification-success i {
                    color: var(--success-color);
                }
                .notification-info i {
                    color: var(--primary-color);
                }
            `;
            document.head.appendChild(style);
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Check if it's today
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        // Check if it's tomorrow
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }
        
        // Format as relative date if within a week
        const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 7) {
            return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
        }
        
        // Otherwise format as date
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appUI = new UI();
});