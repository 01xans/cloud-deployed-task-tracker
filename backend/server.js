const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

const Task = mongoose.model('Task', new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  project: String
}));

app.get('/tasks', async (_, res) => res.json(await Task.find()));
app.post('/tasks', async (req, res) => res.json(await new Task(req.body).save()));
app.put('/tasks/:id', async (req, res) => res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/tasks/:id', async (req, res) => res.json(await Task.findByIdAndDelete(req.params.id)));

app.listen(5000, '0.0.0.0', () => console.log('🚀 Backend running on http://localhost:5000'));
