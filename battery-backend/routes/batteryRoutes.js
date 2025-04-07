import express from 'express';
import BatteryData from '../models/batteryData.js';

const router = express.Router();

let latestData = null;

// ✅ POST from ESP8266
router.post('/data', async (req, res) => {
  try {
    console.log("🔍 Incoming raw data:", req.body); // Debug print

    const { voltage, current, temperature, percentage } = req.body;

    // Check for missing or incorrect keys
    if (
      typeof voltage !== 'number' ||
      typeof current !== 'number' ||
      typeof temperature !== 'number' ||
      typeof percentage !== 'number'
    ) {
      console.error("❌ Invalid data format received:", req.body);
      return res.status(400).json({ message: "Invalid data format" });
    }

    const batteryEntry = new BatteryData({
      voltage,
      current,
      temperature,
      percentage,
    });

    await batteryEntry.save();
    console.log("📥 Received & saved:", batteryEntry);
    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
});


// ✅ GET latest for UI
router.get('/latest', (req, res) => {
  res.json(latestData || null);
});

// ✅ GET history for chart
router.get('/history', async (req, res) => {
  try {
    const data = await BatteryData.find().sort({ timestamp: -1 }).limit(20);
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ error: 'Failed to fetch battery history data' });
  }
});

export default router;
