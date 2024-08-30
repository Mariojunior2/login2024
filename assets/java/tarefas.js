
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const taskForm = document.getElementById('taskForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else if (taskForm) {
            verificarAutenticacao();
        taskForm.addEventListener('submit', adicionarTarefa);
    }
});


async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Login bem-sucedido!');
            window.location.href = 'dashboard.html'; 
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente mais tarde.');
    }
}



async function verificarAutenticacao() {
    try {
        const response = await fetch('http://localhost:3000/auth-check', {
            credentials: 'include'
        });
        if (response.ok) {
            carregarTarefas();
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = 'login.html';
    }
}


async function adicionarTarefa(event) {
    event.preventDefault();
    const title = document.getElementById('titulo').value;
    const description = document.getElementById('descricao').value;
    const dueDate = document.getElementById('duedata').value;

    try {
  
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ title, description, dueDate })
        });

        if (response.ok) {
            alert('Tarefa adicionada com sucesso!');
            
            await carregarTarefas();
        } else {
            const errorData = await response.json();
            console.error('Erro ao adicionar tarefa:', errorData);
            alert('Erro ao adicionar tarefa: ' + (errorData.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        alert('Erro ao adicionar tarefa. Tente novamente mais tarde.');
    }
}


async function carregarTarefas() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            credentials: 'include'
        });

        const tasks = await response.json();

        if (response.ok) {
            atualizarTabelaDeTarefas(tasks);
        } else {
            console.error('Erro ao carregar tarefas:', tasks);
            alert('Erro ao carregar tarefas.');
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        alert('Erro ao carregar tarefas. Por favor, tente novamente mais tarde.');
    }
}


function atualizarTabelaDeTarefas(tasks) {
    const taskTableBody = document.querySelector('#taskTable tbody');
    taskTableBody.innerHTML = ''; 

    if (tasks.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="4">Nenhuma tarefa encontrada.</td>`;
        taskTableBody.appendChild(emptyRow);
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td><button onclick="removerTarefa(${task.id})">Remover</button></td>
        `;
        taskTableBody.appendChild(row);
    });
}


async function removerTarefa(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert('Tarefa removida com sucesso!');
            await carregarTarefas();
        } else {
            const errorData = await response.json();
            console.error('Erro ao remover tarefa:', errorData);
            alert('Erro ao remover tarefa: ' + (errorData.error || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro ao remover tarefa:', error);
        alert('Erro ao remover tarefa. Tente novamente mais tarde.');
    }
}


async function removerTarefa(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert('Tarefa removida com sucesso!');
            carregarTarefas();
        } else {
            alert('Erro ao remover tarefa.');
        }
    } catch (error) {
        console.error('Erro ao remover tarefa:', error);
        alert('Erro ao remover tarefa. Tente novamente mais tarde.');
    }
}
