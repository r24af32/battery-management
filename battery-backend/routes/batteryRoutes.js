import express from 'express';
import BatteryData from '../models/batteryData.js';

const router = express.Router();

let latestData = null;

// ✅ POST from ESP8266
router.post('/data', async (req, res) => {
  try {
    // ✅ Debug log the raw body
    console.log("🔍 Incoming raw data:", req.body);

    // ✅ Check for valid body
    if (
      !req.body ||
      typeof req.body.voltage !== 'number' ||
      typeof req.body.current !== 'number' ||
      typeof req.body.temperature !== 'number' ||
      typeof req.body.percentage !== 'number'
    ) {
      console.log("❌ Invalid data format received:", req.body);
      return res.status(400).json({ message: "Invalid data format" });
    }

    latestData = req.body;

    const batteryEntry = new BatteryData(latestData);
    await batteryEntry.save();

    console.log("📥 Received & saved:", latestData);
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
