const { body } = require('express-validator');

// Patient registration validation rules
exports.registerValidation = [
  body('aadhaarNumber')
    .trim()
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar number must be exactly 12 digits')
    .isNumeric()
    .withMessage('Aadhaar number must contain only numbers'),
  
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  
  body('mobileNumber')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be exactly 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian mobile number'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  body('bloodGroup')
    .trim()
    .notEmpty()
    .withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  
  // Address validations
  body('address.line1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required'),
  
  body('address.line2')
    .optional({ checkFalsy: true })
    .trim(),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be between 2 and 100 characters'),
  
  body('address.pincode')
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Pincode must be exactly 6 digits')
    .isNumeric()
    .withMessage('Pincode must contain only numbers'),
  
  // Emergency contact validations
  body('emergencyContact.name')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Emergency contact name must be between 2 and 100 characters'),
  
  body('emergencyContact.relationship')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact relationship is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Relationship must be between 2 and 50 characters'),
  
  body('emergencyContact.mobile')
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Emergency contact mobile must be exactly 10 digits')
    .isNumeric()
    .withMessage('Emergency contact mobile must contain only numbers')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid Indian mobile number for emergency contact'),
];

// Login validation rules
exports.loginValidation = [
  body('mobileNumber')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value, { req }) => {
      // If UHI is provided, mobileNumber is optional
      if (req.body.uhi) {
        return true;
      }
      // If no UHI, validate mobile number
      if (!value) {
        throw new Error('Mobile number or UHI is required');
      }
      if (value.length !== 10) {
        throw new Error('Mobile number must be exactly 10 digits');
      }
      if (!/^\d+$/.test(value)) {
        throw new Error('Mobile number must contain only numbers');
      }
      return true;
    }),
  
  body('uhi')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value, { req }) => {
      // Either UHI or mobileNumber must be provided
      if (!value && !req.body.mobileNumber) {
        throw new Error('Mobile number or UHI is required');
      }
      // If UHI is provided, validate its format (alphanumeric, typically FIRSTNAME followed by digits)
      if (value && !/^[A-Z]+\d+$/.test(value)) {
        throw new Error('UHI must be in format: FIRSTNAME followed by numbers (e.g., JOHN1234)');
      }
      return true;
    }),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];
