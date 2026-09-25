const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Schema สำหรับบันทึก Action Log ของผู้เล่น
const actionLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  scenarioId: { type: String, required: true },
  actionChosen: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ActionLog = mongoose.model('ActionLog', actionLogSchema);

// API รับ Action Log จากเกม
app.post('/api/action-logs', async (req, res) => {
  try {
    const { username, scenarioId, actionChosen, isCorrect } = req.body;
    const newLog = new ActionLog({ username, scenarioId, actionChosen, isCorrect });
    await newLog.save();
    res.status(201).json({ success: true, message: 'Action Log saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});