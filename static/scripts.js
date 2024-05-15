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
            document.getElementById('taskForm').reset();
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
    const taskListAll = document.getElementById('taskListAll');
    const taskListHigh = document.getElementById('taskListHigh');
    const taskListMedium = document.getElementById('taskListMedium');
    const taskListLow = document.getElementById('taskListLow');
    taskListAll.innerHTML = '';
    taskListHigh.innerHTML = '';
    taskListMedium.innerHTML = '';
    taskListLow.innerHTML = '';

    tasks.forEach(task => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-3 task-card-container'; // Classe adicional para a animação
        const card = document.createElement('div');
        card.className = 'card';

        // Adicionando classe baseada na prioridade
        if (task.priority === 'Alta') {
            card.classList.add('priority-high');
        } else if (task.priority === 'Média') {
            card.classList.add('priority-medium');
        } else if (task.priority === 'Baixa') {
            card.classList.add('priority-low');
        }

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <p class="card-text"><small>Vencimento: ${task.due_date || 'Sem data'}</small></p>
                <p class="card-text"><small>Prioridade: ${task.priority}</small></p>
                <p class="card-text"><small>Status: ${task.status}</small></p>
                <button class="btn btn-primary btn-sm me-2" onclick="editTask(${task.id}, '${task.title}', '${task.description}', '${task.due_date}', '${task.priority}', '${task.status}')">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                    <i class="bi bi-trash"></i> Excluir
                </button>
                <div class="form-check mt-2">
                    <input class="form-check-input" type="checkbox" value="" id="taskStatus${task.id}" ${task.status === 'Completed' ? 'checked' : ''} onclick="toggleTaskStatus(${task.id})">
                    <label class="form-check-label" for="taskStatus${task.id}">
                        Concluída
                    </label>
                </div>
            </div>
        `;
        col.appendChild(card);
        taskListAll.appendChild(col);

        // Adicionando cards nas abas específicas de prioridade
        if (task.priority === 'Alta') {
            taskListHigh.appendChild(col.cloneNode(true));
        } else if (task.priority === 'Média') {
            taskListMedium.appendChild(col.cloneNode(true));
        } else if (task.priority === 'Baixa') {
            taskListLow.appendChild(col.cloneNode(true));
        }
    });
}

async function deleteTask(id) {
    const response = await fetch(`/delete/${id}`, { method: 'DELETE' });
    if (response.ok) {
        const taskCard = document.querySelector(`.task-card-container[data-id="${id}"]`);
        if (taskCard) {
            taskCard.classList.add('fadeOutDown'); // Adiciona a animação de saída
            setTimeout(() => {
                loadTasks();
            }, 500); // Tempo suficiente para a animação
        } else {
            loadTasks();
        }
        showFeedback('Tarefa excluída com sucesso!', 'success');
    } else {
        showFeedback('Erro ao excluir tarefa.', 'danger');
    }
}

async function toggleTaskStatus(id) {
    const response = await fetch(`/toggle-status/${id}`, { method: 'PUT' });
    if (response.ok) {
        loadTasks();
        showFeedback('Status da tarefa atualizado!', 'success');
    } else {
        showFeedback('Erro ao atualizar status da tarefa.', 'danger');
    }
}

window.onload = loadTasks;
