function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `alert alert-${type}`;
    feedback.classList.remove('d-none');
    setTimeout(() => {
        feedback.classList.add('d-none');
    }, 3000);
}

async function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (title) {
        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, due_date: dueDate, priority })
        });
        if (response.ok) {
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('taskDueDate').value = '';
            document.getElementById('taskPriority').value = '';
            loadTasks();
            showFeedback('Tarefa adicionada com sucesso!', 'success');
        } else {
            const error = await response.json();
            showFeedback(error.error || 'Erro ao adicionar tarefa.', 'danger');
        }
    } else {
        showFeedback('O título da tarefa não pode estar vazio.', 'warning');
    }
}

function editTask(id, title, description, dueDate, priority, status) {
    document.getElementById('editTaskId').value = id;
    document.getElementById('editTaskTitle').value = title;
    document.getElementById('editTaskDescription').value = description;
    document.getElementById('editTaskDueDate').value = dueDate;
    document.getElementById('editTaskPriority').value = priority;
    document.getElementById('editTaskStatus').value = status;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

async function saveTask() {
    const id = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const dueDate = document.getElementById('editTaskDueDate').value;
    const priority = document.getElementById('editTaskPriority').value;
    const status = document.getElementById('editTaskStatus').value;

    const response = await fetch(`/edit/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, due_date: dueDate, priority, status })
    });
    if (response.ok) {
        loadTasks();
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        editModal.hide();
        showFeedback('Tarefa editada com sucesso!', 'success');
    } else {
        const error = await response.json();
        showFeedback(error.error || 'Erro ao editar tarefa.', 'danger');
    }
}

async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Adicionando classe baseada na prioridade
        if (task.priority === 'Alta') {
            li.classList.add('priority-high');
        } else if (task.priority === 'Média') {
            li.classList.add('priority-medium');
        } else if (task.priority === 'Baixa') {
            li.classList.add('priority-low');
        }

        li.innerHTML = `
            <div>
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <small>Vencimento: ${task.due_date || 'Sem data'}</small><br>
                <small>Prioridade: ${task.priority}</small><br>
                <small>Status: ${task.status}</small>
            </div>
            <div>
                <button class="btn btn-primary btn-sm me-2" onclick="editTask(${task.id}, '${task.title}', '${task.description}', '${task.due_date}', '${task.priority}', '${task.status}')">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

async function deleteTask(id) {
    const response = await fetch(`/delete/${id}`, { method: 'DELETE' });
    if (response.ok) {
        loadTasks();
        showFeedback('Tarefa excluída com sucesso!', 'success');
    } else {
        showFeedback('Erro ao excluir tarefa.', 'danger');
    }
}

window.onload = loadTasks;
