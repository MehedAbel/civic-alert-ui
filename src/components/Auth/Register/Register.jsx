import { useState, useEffect, useRef } from 'react';

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
    const [isLoading, setIsLoading] = useState(false);

    const [isSuccessful, setIsSuccessful] = useState(false);
    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    const inputRefs = useRef({
        firstName: null,
        lastName: null,
        email: null
    });

    const formErrorRef = useRef();

    useEffect(() => {
        setFormError('');
    }, [formValues, wasFormSubmitted]);

    useEffect(() => {
        inputRefs.current.firstName.focus();
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
        return isInvalidField;
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
            isFieldInvalid('email')
        );
    };

    const submit = (e) => {
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

        setIsLoading(true);
        fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: formValues.firstName,
                lastname: formValues.lastName,
                email: formValues.email,
            })
        })
        .then((response) => {
            if (!response.ok) {
                {
                    if (response.status === 500) throw Error('Email already exists');
                    else throw Error('Response status not ok!');    
                }
            } else {
                setIsSuccessful(true);
            }
        })
        .catch((error) => {
            console.error(error.message);
            setFormError(error.message);
            formErrorRef.current.focus();
        }).finally(() => setIsLoading(false));
    };

    return (
        <Page>
            {isLoading && <Loader message='Registering'/>} 
            <AuthFormContainer>
                <Logo />
                <Title title='Register' className={isSuccessful && 'hidden'}/>
                <AuthForm onSubmit={submit} noValidate className={isSuccessful && 'hidden'}>
                    <ErrorMessage errorMessage={formError} ariaLive="assertive" ref={formErrorRef} className={`${formError ? 'block' : 'hidden'}`}/>
                    
                    <Input
                        label='First Name'
                        id="first-name"
                        type="text"
                        value={formValues.firstName}
                        onChange={(e) => updateFormValue('firstName', e.target.value)}
                        ref={(ref) => (inputRefs.current.firstName = ref)}
                        placeholder="John"
                        autoComplete="given-name"
                        required
                    >
                        {getErrorMessage('firstName')}
                    </Input>
                    
                    <Input
                        label='Last Name'
                        id="last-name"
                        type="text"
                        value={formValues.lastName}
                        onChange={(e) => updateFormValue('lastName', e.target.value)}
                        ref={(ref) => (inputRefs.current.lastName = ref)}
                        placeholder="Doe"
                        autoComplete="family-name"
                        required
                    >
                        {getErrorMessage('lastName')}
                    </Input>

                    <Input
                        label='Email'
                        id="email"
                        type="email"
                        value={formValues.email}
                        onChange={(e) => updateFormValue('email', e.target.value)}
                        ref={(ref) => (inputRefs.current.email = ref)}
                        placeholder="john.doe@domain.com"
                        autoComplete="email"
                        required
                    >
                        {getErrorMessage('email')}
                    </Input>
                    
                    <p className="text-centero mt-6 mb-3 text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="text-ocean-200 hover:underline">
                            Log In
                        </a>
                    </p>

                    <SubmitButton name="Create Account"/>
                </AuthForm>
                {isSuccessful && <div className='text-blue-500 font-medium mt-3'> Please check your email for a link to set your password </div>}
            </AuthFormContainer>
        </Page>
    );
};

export default Register;