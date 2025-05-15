import mongoose from 'mongoose';

// Define Inquiry interface
export interface IInquiry {
  name: string;
  email: string;
  phone: string;
  message: string;
  carId?: mongoose.Types.ObjectId;
  status: 'new' | 'read' | 'responded';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  carId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Car',
    required: false
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'responded'], 
    default: 'new' 
  }
}, { 
  timestamps: true 
});

// Add indexes
InquirySchema.index({ email: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ carId: 1 });
InquirySchema.index({ createdAt: -1 });

// Check if model exists already
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

export default Inquiry; 