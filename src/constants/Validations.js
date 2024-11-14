// register page constants
const REGEX = {
    firstName: /^[a-zA-Z]+$/,
    lastName: /^[a-zA-Z]+$/,
    email: /^[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
};

const errorMessages = {
    firstName: 'First Name must contain only letters and no spaces',
    lastName: 'Last Name must contain only letters and no spaces',
    email: 'Invalid email format',
    password:
        'Password must contain at least 8 characters including at least one upper and lowercase letter and a number.',
    confirmPassword: 'Passwords do not match',
    emptyField: 'This field is required'
};

export { REGEX, errorMessages };