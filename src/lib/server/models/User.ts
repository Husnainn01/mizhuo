import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES, ROLE_PERMISSIONS } from '@/models/UserConstants';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: USER_ROLES,
    default: 'user' 
  },
  permissions: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// Set default permissions based on role
UserSchema.pre('save', function(next) {
  // If this is a new user or the role has changed, set default permissions
  if (this.isNew || this.isModified('role')) {
    const role = this.role as keyof typeof ROLE_PERMISSIONS;
    this.permissions = [...ROLE_PERMISSIONS[role] || []];
  }
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has specific permission
UserSchema.methods.hasPermission = function(permission: string): boolean {
  return this.permissions.includes(permission);
};

// Method to check if user has any of the provided permissions
UserSchema.methods.hasAnyPermission = function(permissions: string[]): boolean {
  return this.permissions.some((p: string) => permissions.includes(p));
};

// Check if model exists already to prevent recompilation in development
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User; 