import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: 'text'
  },
  price: {
    type: Number,
    required: true,
    index: true
  },
  priceCurrency: {
    type: String,
    default: 'USD'
  },
  description: { 
    type: String,
    index: 'text'
  },
  make: { 
    type: String,
    index: 'text'
  },
  model: { 
    type: String,
    index: 'text'
  },
  year: {
    type: Number,
    index: true
  },
  mileage: String,
  mileageUnit: String,
  itemCondition: String,
  availability: String,
  vin: String,
  bodyType: String,
  color: String,
  driveWheelConfiguration: String,
  numberOfDoors: String,
  fuelType: String,
  vehicleEngine: String,
  vehicleSeatingCapacity: String,
  vehicleTransmission: String,
  carFeature: [String],
  carSafetyFeature: [String],
  cylinders: String,
  visibility: String,
  images: {
    type: [String],
    default: []
  },
  image: String,
  stockNumber: String,
  date: {
    type: Date,
    default: Date.now
  },
  steering: String,
  seats: String,
  engineCode: String,
  driveType: String,
  country: String,
  category: String,
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  section: {
    type: String,
    enum: ['recent', 'popular'],
    default: 'recent',
    required: true,
    index: true
  },
  offerType: {
    type: String,
    enum: ['In Stock', 'Sold'],
    default: 'In Stock',
    index: true
  }
}, {
  collection: 'CarListing',
  timestamps: true,
  strict: false
});

// If main image is not set, use the first image from the images array
CarSchema.pre('save', function(next) {
  if (!this.image && this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  next();
});

// Check if the model exists to prevent recompilation error in development
const CarListing = mongoose.models.CarListing || mongoose.model('CarListing', CarSchema);

export default CarListing; 