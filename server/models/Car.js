const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  engineCapacity: { type: Number, required: true },
  power: { type: Number, required: true },
  bodyType: { type: String, required: true },
  color: { type: String, required: true },
  vin: { type: String, required: true },
  description: { type: String },
  images: [{ type: String, required: true }],
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);