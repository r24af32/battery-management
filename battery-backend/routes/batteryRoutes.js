import express from 'express';
import BatteryData from '../models/batteryData.js';

const router = express.Router();

let latestData = null;

router.post('/data', async (req, res) => {
  try {
    console.log("🔍 Incoming raw data:", req.body);

    // Convert to numbers
    const voltage = parseFloat(req.body.voltage);
    const current = parseFloat(req.body.current);
    const temperature = parseFloat(req.body.temperature);
    const percentage = parseInt(req.body.percentage);

    // Validate
    if (
      isNaN(voltage) ||
      isNaN(current) ||
      isNaN(temperature) ||
      isNaN(percentage)
    ) {
      console.error("❌ Invalid number format:", req.body);
      return res.status(400).json({ message: "Invalid number format" });
    }

    const batteryEntry = new BatteryData({
      voltage,
      current,
      temperature,
      percentage,
    });

    await batteryEntry.save();
    console.log("📥 Data saved:", batteryEntry);
    res.status(200).json({ message: "Data saved successfully" });

  } catch (error) {
    console.error("❌ Error in /api/data:", error);
    res.status(500).json({ message: "Server error" });
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
