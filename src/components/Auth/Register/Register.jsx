import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

import sha256 from 'js-sha256';

import { API_URL } from '../../../config';
import { REGEX, errorMessages } from '../../../constants/Validations.js';

import Loader from '../../Modal/Loader/Loader.jsx';
import Page from '../Form/Page.jsx'
import AuthFormContainer from '../Form/AuthFormContainer.jsx';
import AuthForm from '../Form/AuthForm.jsx';
import Title from '../Form/Title.jsx';
import Input from '../Form/Input.jsx';
import SubmitButton from '../Form/SubmitButton.jsx';
import ErrorMessage from '../../Error/Error.jsx';
import Logo from '../Form/Logo.jsx';

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Registering...');

    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const inputRefs = useRef({
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        confirmPassword: null
    });

    const formErrorRef = useRef();

    useEffect(() => {
        setFormError('');
    }, [formValues, wasFormSubmitted]);

    useEffect(() => {
        inputRefs.current.lastName.focus();
    }, []);

    const updateFormValue = (fieldName, value) => {
        setFormValues((prevState) => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const isFieldInvalid = (fieldName) => {
        const fieldValue = formValues[fieldName];
        const isInvalidField = REGEX[fieldName] && !REGEX[fieldName].test(fieldValue);

        const isPasswordMismatch =
            fieldName === 'confirmPassword' && formValues.password !== formValues.confirmPassword;

        return isInvalidField || isPasswordMismatch;
    };

    const getErrorMessage = (fieldName) => {
        const fieldValue = formValues[fieldName];

        let errorMessage = null;
        const emptyFieldError = errorMessages['emptyField'];
        const invalidFieldError = errorMessages[fieldName];

        if (!fieldValue && wasFormSubmitted) {
            errorMessage = emptyFieldError;
        } else if (fieldValue && isFieldInvalid(fieldName)) {
            errorMessage = invalidFieldError;
        }

        if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} id={fieldName + 'Error'} />;
        }

        // keep the error message in the DOM for screen readers
        return (
            <ErrorMessage
                errorMessage={invalidFieldError}
                id={fieldName + 'Error'}
                style={{ position: 'absolute', left: '-99999px' }}
            />
        );
    };

    const isFormValid = () => {
        return !(
            isFieldInvalid('firstName') ||
            isFieldInvalid('lastName') ||
            isFieldInvalid('email') ||
            isFieldInvalid('password') ||
            isFieldInvalid('confirmPassword')
        );
    };

    const submit = async (e) => {
        e.preventDefault();
        setWasFormSubmitted(true);

        if (!isFormValid()) {
            for (let input in inputRefs.current) {
                if (isFieldInvalid(input)) {
                    const event = new Event('click'); // it doesn't read the error without this when using the screen reader
                    inputRefs.current[input].focus();
                    inputRefs.current[input].dispatchEvent(event);
                    return;
                }
            }
        }

        const hashedPassword = sha256(formValues.password);

        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    email: formValues.email,
                    password: hashedPassword,
                })
            });

            if (!response.ok) {
                if (response.status === 500) throw Error('Acest email este deja inregistrat!');
                else throw Error('Response status not ok!');
            }

            const data = await response.json();
            if (data) {
                try {
                    setLoadingMessage('Logging in...');
                    await login(data.email, hashedPassword);
                } catch (error) {
                    console.error(error.message);
                    navigate('/login');
                }
            } else {
                throw Error('Something\'s wrong with the data received at registration');
            }

        } catch(error) {
            console.error(error.message);
            setFormError(error.message);
            formErrorRef.current.focus();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page>
            {isLoading && <Loader message={loadingMessage}/>} 
            <AuthFormContainer>
                <Logo />
                <Title title='Inregistrare'/>
                <AuthForm onSubmit={submit} noValidate>
                    <ErrorMessage errorMessage={formError} ariaLive="assertive" ref={formErrorRef} className={`${formError ? 'block' : 'hidden'}`}/>
                    
                    <Input
                        label='Nume'
                        id="last-name"
                        type="text"
                        value={formValues.lastName}
                        onChange={(e) => updateFormValue('lastName', e.target.value)}
                        ref={(ref) => (inputRefs.current.lastName = ref)}
                        placeholder="Popescu"
                        autoComplete="family-name"
                        required
                    >
                        {getErrorMessage('lastName')}
                    </Input>

                    <Input
                        label='Prenume'
                        id="first-name"
                        type="text"
                        value={formValues.firstName}
                        onChange={(e) => updateFormValue('firstName', e.target.value)}
                        ref={(ref) => (inputRefs.current.firstName = ref)}
                        placeholder="Ion"
                        autoComplete="given-name"
                        required
                    >
                        {getErrorMessage('firstName')}
                    </Input>

                    <Input
                        label='Email'
                        id="email"
                        type="email"
                        value={formValues.email}
                        onChange={(e) => updateFormValue('email', e.target.value)}
                        ref={(ref) => (inputRefs.current.email = ref)}
                        placeholder="ion.popescu@exemplu.ro"
                        autoComplete="email"
                        required
                    >
                        {getErrorMessage('email')}
                    </Input>

                    <Input
                        label='Parola'
                        id="password"
                        type="password"
                        value={formValues.password}
                        onChange={(e) => updateFormValue('password', e.target.value)}
                        ref={(ref) => (inputRefs.current.password = ref)}
                        placeholder="Introdu parola"
                        autoComplete="new-password"
                        required
                    >
                        {getErrorMessage('password')}
                    </Input>

                    <Input
                        label='Confirma Parola'
                        id="confirm-password"
                        type="password"
                        value={formValues.confirmPassword}
                        onChange={(e) => updateFormValue('confirmPassword', e.target.value)}
                        ref={(ref) => (inputRefs.current.confirmPassword = ref)}
                        placeholder="Reintrodu parola"
                        autoComplete="new-password"
                        required
                    >
                        {getErrorMessage('confirmPassword')}
                    </Input>
                    
                    <p className="text-centero mt-6 mb-3 text-sm">
                        Ai deja un cont?{' '}
                        <a href="/login" className="text-ocean-200 hover:underline">
                            Conecteaza-te
                        </a>
                    </p>

                    <SubmitButton name="Creeaza cont"/>
                </AuthForm>
            </AuthFormContainer>
        </Page>
    );
};

export default Register;