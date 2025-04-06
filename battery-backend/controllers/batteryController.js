import BatteryData from '../models/batteryData.js';

// POST /api/data
export const addBatteryData = async (req, res) => {
  try {
    const newData = new BatteryData(req.body);
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
};

// GET /api/latest
export const getLatestData = async (req, res) => {
  try {
    const latest = await BatteryData.findOne().sort({ _id: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest data' });
  }
};
