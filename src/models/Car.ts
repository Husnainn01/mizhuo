import mongoose from 'mongoose';

// Define the interface for Car
export interface ICar {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  description: string;
  images: string[];
  features: string[];
  bodyType: string;
  condition: string;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  price: { type: Number, required: true, index: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  features: { type: [String], default: [] },
  bodyType: { type: String, required: true },
  condition: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Create indexes for search
CarSchema.index({ make: 'text', model: 'text', description: 'text' });

// Create compound indexes for common searches
CarSchema.index({ make: 1, model: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ year: 1 });
CarSchema.index({ isFeatured: 1 });

// Check if the model exists to prevent recompilation error in development
const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);

export default Car; 