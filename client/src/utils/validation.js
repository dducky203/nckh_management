import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return ERROR_MESSAGES.FORM.REQUIRED;
  }
  if (!VALIDATION_RULES.EMAIL.test(email)) {
    return ERROR_MESSAGES.FORM.EMAIL_INVALID;
  }
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return ERROR_MESSAGES.FORM.REQUIRED;
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.FORM.PASSWORD_TOO_SHORT;
  }
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name) {
    return ERROR_MESSAGES.FORM.REQUIRED;
  }
  if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return ERROR_MESSAGES.FORM.NAME_TOO_SHORT;
  }
  return null;
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) {
    return ERROR_MESSAGES.FORM.REQUIRED;
  }
  if (!VALIDATION_RULES.PHONE.test(phone)) {
    return ERROR_MESSAGES.FORM.PHONE_INVALID;
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.FORM.REQUIRED;
  }
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.FORM.PASSWORDS_NOT_MATCH;
  }
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName = '') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return fieldName ? `${fieldName} là bắt buộc` : ERROR_MESSAGES.FORM.REQUIRED;
  }
  return null;
};

// Generic form validation
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login form validation
export const validateLoginForm = (data) => {
  return validateForm(data, {
    email: [validateEmail],
    password: [validateRequired],
  });
};

// Register form validation
export const validateRegisterForm = (data) => {
  return validateForm(data, {
    name: [validateName],
    email: [validateEmail],
    password: [validatePassword],
    confirmPassword: [(value) => validateConfirmPassword(data.password, value)],
  });
};

// Contact form validation
export const validateContactForm = (data) => {
  return validateForm(data, {
    name: [validateName],
    email: [validateEmail],
    subject: [validateRequired],
    message: [validateRequired],
  });
};