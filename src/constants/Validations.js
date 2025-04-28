// register page constants
const REGEX = {
    firstName: /^[a-zA-Z]+$/,
    lastName: /^[a-zA-Z]+$/,
    email: /^[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
};

const errorMessages = {
    firstName: 'Prenumele trebuie sa contina doar litere si sa nu contina spatii',
    lastName: 'Numele trebuie sa contina doar litere si sa nu contina spatii',
    email: 'Format invalid de email',
    password:
        'Parola trebuie sa contina cel putin 8 caractere, inclusiv cel putin o litera mare si o litera mica si un numar.',
    confirmPassword: 'Parolele nu se potrivesc',
    emptyField: 'Acest camp este obligatoriu'
};

export { REGEX, errorMessages };