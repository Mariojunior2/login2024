const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 3000;


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'task_manager'
});


app.use(express.json());


app.use(cors({
    origin: 'http://localhost', 
    credentials: true 
}));


app.use(session({
    secret: 'segredo-seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));


function authenticate(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        res.status(401).json({ error: 'Usuário não autenticado' });
    }
}


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            req.session.user_id = rows[0].id;
            res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ error: 'Usuário ou senha incorretos.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});


app.get('/auth-check', (req, res) => {
    if (req.session.user_id) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});


app.get('/api/tasks', authenticate, async (req, res) => {
    try {
        const [tasks] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [req.session.user_id]);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

app.post('/api/tasks', authenticate, async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
       
        if (!title || !description || !dueDate) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

     
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description, dueDate, user_id) VALUES (?, ?, ?, ?)',
            [title, description, dueDate, req.session.user_id]
        );
        
        res.status(201).json({ message: 'Tarefa adicionada com sucesso!', taskId: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        res.status(500).json({ error: 'Erro ao adicionar tarefa' });
    }
});




app.delete('/api/tasks/:taskId', authenticate, async (req, res) => {
    const { taskId } = req.params;
    try {
        await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.session.user_id]);
        res.status(200).json({ message: 'Tarefa removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover tarefa:', error);
        res.status(500).json({ error: 'Erro ao remover tarefa' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});




