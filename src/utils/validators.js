// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation: 8-20 chars, at least one uppercase, one lowercase, one number
export const validatePassword = (password) => {
    if (password.length < 8 || password.length > 20) {
        return false;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
};

// Required field validation
export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
};

// Max length validation
export const validateMaxLength = (value, maxLength) => {
    return !value || value.length <= maxLength;
};

// Get password validation message
export const getPasswordValidationMessage = () => {
    return 'La contraseña debe tener entre 8 y 20 caracteres, al menos una mayúscula, una minúscula y un número';
};
