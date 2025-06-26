// validation for strong password (8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)

export const validatePassword = (password: string): string | null => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  if (password.length < minLength) {
    return "Password must be at least 8 characters long";
  }
  
  if (!hasUpperCase) {
    return "Password must contain at least one uppercase letter";
  }
  
  if (!hasLowerCase) {
    return "Password must contain at least one lowercase letter";
  }
  
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  
  if (!hasSpecialChar) {
    return "Password must contain at least one special character";
  }

  return null;
};