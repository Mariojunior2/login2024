const express = require('express');
const pool = require('../config/database'); 
const router = express.Router();

function authenticate(req, res, next) {
    if (!req.session || !req.session.user_id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    next();
}

router.post('/', authenticate, async (req, res) => {
    const { title, description, dueDate } = req.body;
    const userId = req.session.user_id;

    try {
        const [result] = await pool.execute(
            `INSERT INTO tasks (title, description, dueDate, status, user_id) VALUES (?, ?, ?, 'pending', ?)`,
            [title, description, dueDate, userId]
        );
        res.status(201).json({ message: 'Tarefa adicionada com sucesso!', taskId: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        res.status(500).json({ error: 'Erro ao adicionar tarefa', details: error.message });
    }
});

router.get('/', authenticate, async (req, res) => {
    try {
        const [tasks] = await pool.execute(`SELECT * FROM tasks WHERE user_id = ?`, [req.session.user_id]);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas', details: error.message });
    }
});

if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro ao adicionar tarefa:', errorData);
    alert('Erro ao adicionar tarefa: ' + (errorData.error || 'Erro desconhecido'));
}
