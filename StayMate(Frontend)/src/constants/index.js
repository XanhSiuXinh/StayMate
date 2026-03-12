// Application constants
export const APP_CONSTANTS = {
  // User roles
  ROLES: {
    STUDENT: 'Student',
    LANDLORD: 'Landlord',
    ADMIN: 'Admin'
  },
  
  // Account status
  ACCOUNT_STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended'
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
  },
  
  // File upload limits
  UPLOAD_LIMITS: {
    MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_PHOTO_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_PHOTOS_COUNT: 6,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
  },
  
  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_BIO_LENGTH: 500,
    MAX_FULL_NAME_LENGTH: 100
  }
};

export default APP_CONSTANTS;
