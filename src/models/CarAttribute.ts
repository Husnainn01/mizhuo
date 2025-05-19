import mongoose from 'mongoose';

// Define schema for various car attributes
const CarAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['transmission', 'fuel', 'body', 'drive', 'feature'],
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create a compound index for uniqueness
CarAttributeSchema.index({ type: 1, value: 1 }, { unique: true });

// Check if the model exists to prevent recompilation error in development
const CarAttribute = mongoose.models.CarAttribute || mongoose.model('CarAttribute', CarAttributeSchema);

export default CarAttribute; 