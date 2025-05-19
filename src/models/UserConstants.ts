// Define available roles
export const USER_ROLES = ['user', 'admin', 'editor', 'viewer'];

// Define available permissions
export const PERMISSIONS = {
  // Car related permissions
  CREATE_CAR: 'create:car',
  READ_CAR: 'read:car',
  UPDATE_CAR: 'update:car',
  DELETE_CAR: 'delete:car',
  
  // Attribute related permissions
  CREATE_ATTRIBUTE: 'create:attribute',
  READ_ATTRIBUTE: 'read:attribute',
  UPDATE_ATTRIBUTE: 'update:attribute',
  DELETE_ATTRIBUTE: 'delete:attribute',
  
  // User related permissions
  CREATE_USER: 'create:user',
  READ_USER: 'read:user',
  UPDATE_USER: 'update:user',
  DELETE_USER: 'delete:user',
  
  // Inquiry related permissions
  READ_INQUIRY: 'read:inquiry',
  UPDATE_INQUIRY: 'update:inquiry',
  DELETE_INQUIRY: 'delete:inquiry',
};

// Define default role-based permissions
export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  editor: [
    PERMISSIONS.READ_CAR,
    PERMISSIONS.CREATE_CAR,
    PERMISSIONS.UPDATE_CAR,
    PERMISSIONS.READ_ATTRIBUTE,
    PERMISSIONS.CREATE_ATTRIBUTE,
    PERMISSIONS.UPDATE_ATTRIBUTE,
    PERMISSIONS.READ_INQUIRY,
    PERMISSIONS.UPDATE_INQUIRY,
  ],
  viewer: [
    PERMISSIONS.READ_CAR,
    PERMISSIONS.READ_ATTRIBUTE,
    PERMISSIONS.READ_INQUIRY,
  ],
  user: [],
};

// Define User interface
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  permissions: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
} 