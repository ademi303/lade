document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const todoList = document.getElementById('todo-list');

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.completed, task.reminderDate);
        });
    };

    // Save tasks to localStorage
    const saveTasks = () => {
        const tasks = [];
        todoList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed'),
                reminderDate: li.reminderDate || null
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to the DOM
    const addTaskToDOM = (taskText, completed = false, reminderDate = null) => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        if (completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <span class="alert-icon" title="Set Reminder">!</span>
            <button class="toggle-btn">${completed ? 'Mark as Undone' : 'Mark as Done'}</button>
            <button class="delete-btn">Delete</button>
        `;

        const toggleBtn = li.querySelector('.toggle-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const alertIcon = li.querySelector('.alert-icon');

        toggleBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
            toggleBtn.textContent = li.classList.contains('completed') ? 'Mark as Undone' : 'Mark as Done';
            alertIcon.style.display = li.classList.contains('completed') ? 'none' : 'inline';
            saveTasks();
        });

        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(li);
            clearTimeout(li.reminderTimeout);
            saveTasks();
        });

        alertIcon.addEventListener('click', () => {
            const reminderDateInput = prompt("Enter reminder date and time (YYYY-MM-DDTHH:MM):");
            if (reminderDateInput) {
                const reminderTime = new Date(reminderDateInput);
                if (reminderTime > new Date()) {
                    const timeUntilReminder = reminderTime - new Date();
                    const reminderTimeout = setTimeout(() => {
                        alert(`Reminder: ${taskText}`);
                    }, timeUntilReminder);

                    li.reminderTimeout = reminderTimeout;
                    li.reminderDate = reminderDateInput;
                    saveTasks();
                } else {
                    alert("Please enter a future date and time.");
                }
            }
        });

        // If a reminder is already set, schedule it
        if (reminderDate) {
            const reminderTime = new Date(reminderDate);
            const timeUntilReminder = reminderTime - new Date();
            if (timeUntilReminder > 0) {
                li.reminderTimeout = setTimeout(() => {
                    alert(`Reminder: ${taskText}`);
                }, timeUntilReminder);
            }
        }

        todoList.appendChild(li);
        saveTasks();
    };

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText);
            taskInput.value = '';
        }
    });

    // Load tasks on page load
    loadTasks();
});
