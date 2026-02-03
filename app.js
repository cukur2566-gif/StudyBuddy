// Main Application Entry Point
document.addEventListener('DOMContentLoaded', function() {
    // Check if UI is already initialized
    if (!window.appUI) {
        console.error('UI not initialized. Make sure ui.js is loaded.');
        return;
    }
    
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = formattedDate;
    
    // Initialize with dashboard
    const initialHash = window.location.hash.substring(1);
    if (!initialHash || !['dashboard', 'tasks', 'habits', 'resources', 'settings'].includes(initialHash)) {
        window.location.hash = 'dashboard';
    }
    
    // Add CSS for task priority colors
    const style = document.createElement('style');
    style.textContent = `
        .priority-low { background-color: #d1fae5; color: #065f46; }
        .priority-medium { background-color: #fef3c7; color: #92400e; }
        .priority-high { background-color: #fee2e2; color: #991b1b; }
        
        .category-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            background-color: var(--light-gray);
            color: var(--text-primary);
        }
        
        .overdue {
            color: var(--danger-color);
            font-weight: 500;
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .badge-warning {
            background-color: var(--warning-color);
            color: white;
        }
        
        .dashboard-task {
            margin-bottom: 0.75rem;
            padding: 1rem;
        }
        
        .dashboard-task:last-child {
            margin-bottom: 0;
        }
        
        .habit-progress-item {
            margin-bottom: 1rem;
        }
        
        .habit-progress-item:last-child {
            margin-bottom: 0;
        }
        
        .text-success {
            color: var(--success-color);
        }
        
        .btn-sm {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
    `;
    document.head.appendChild(style);
    
    console.log('StudyBuddy SPA initialized successfully!');
});