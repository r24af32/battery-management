// models/BatteryModel.js
import mongoose from 'mongoose';

const batterySchema = new mongoose.Schema({
  voltage: Number,
  current: Number,
  temperature: Number,
  percentage: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BatteryData', batterySchema);
