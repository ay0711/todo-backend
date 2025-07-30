const express = require('express')
const app = express ()
require('dotenv').config()
const cors = require('cors')
app.use(cors())
const mongoURI = process.env.MONGO_URI
const port = process.env.PORT|| 5959
const mongoose = require('mongoose')
app.use(express.json());

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


    const TodoSchema = new mongoose.Schema({
        text: { type: String },
        completed: { type: Boolean, default: false }
    });


const Todo = mongoose.model('Todo', TodoSchema);
app.get('/', (req, res) => {
    res.send('Welcome to the Todo API');
});


app.post('/todos', async (req, res) => {
    try {
        console.log("Received todo:", req.body);
        const newTodo = new Todo(req.body);
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error('Error creating todo:', err);
        res.status(400).json({ message: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(400).json({ message: err.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(400).json({ message: err.message });
    }
});

app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(port, ()=>{
    console.log('Here we go!');
    
})