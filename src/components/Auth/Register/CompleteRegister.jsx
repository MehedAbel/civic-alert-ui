import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

import sha256 from 'js-sha256';

import { API_URL } from '../../../config.js';
import { REGEX, errorMessages } from '../../../constants/Validations.js';

import Page from '../Forms/Page.jsx'
import AuthFormContainer from '../Forms/AuthFormContainer.jsx';
import AuthForm from '../Forms/AuthForm.jsx';
import Title from '../Forms/Title.jsx';
import Input from '../Forms/Input.jsx';
import SubmitButton from '../Forms/SubmitButton.jsx';
import Error from '../../Error/Error.jsx';
import Logo from '../Forms/Logo.jsx';

const CompleteRegister = () => {
    const { login } = useAuth();

    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const [formValues, setFormValues] = useState({
        password: '',
        confirmPassword: ''
    });

    const inputRefs = useRef({
        password: null,
        confirmPassword: null
    });

    const formErrorRef = useRef();

    useEffect(() => {
        setFormError('');
    }, [formValues, wasFormSubmitted]);

    useEffect(() => {
        inputRefs.current.password.focus();
    }, []);

    const updateFormValue = (fieldName, value) => {
        setFormValues((prevState) => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const isFieldInvalid = (fieldName) => {
        const fieldValue = formValues[fieldName];

        const isPasswordMismatch =
            fieldName === 'confirmPassword' && formValues.password !== formValues.confirmPassword;
        const isInvalidField = REGEX[fieldName] && !REGEX[fieldName].test(fieldValue);

        return isPasswordMismatch || isInvalidField;
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
            return <Error errorMessage={errorMessage} id={fieldName + 'Error'} />;
        }

        // keep the error message in the DOM for screen readers
        return (
            <Error
                errorMessage={invalidFieldError}
                id={fieldName + 'Error'}
                style={{ position: 'absolute', left: '-99999px' }}
            />
        );
    };

    const isFormValid = () => {
        return !(
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
            const response = await fetch(`${API_URL}/api/auth/complete-register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    password: hashedPassword
                })
            });

            if (!response.ok) {
                throw Error('Something went wrong!');
            }

            const data = await response.json();
            if (data) {
                try {
                    await login(data.email, hashedPassword);
                } catch(error) {
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
        }
    };

    return (
        <Page>  
            <AuthFormContainer>
                <Logo />
                <Title title='Set Password'/>
                <AuthForm onSubmit={submit} noValidate>
                    <Error errorMessage={formError} ariaLive="assertive" ref={formErrorRef} className={`${formError ? 'block' : 'hidden'}`}/>

                    <Input
                        label='Password'
                        id="password"
                        type="password"
                        value={formValues.password}
                        onChange={(e) => updateFormValue('password', e.target.value)}
                        ref={(ref) => (inputRefs.current.password = ref)}
                        placeholder="Type in your password"
                        autoComplete="new-password"
                        required
                    >
                        {getErrorMessage('password')}
                    </Input>

                    <Input
                        label='Confirm Password'
                        id="confirm-password"
                        type="password"
                        value={formValues.confirmPassword}
                        onChange={(e) => updateFormValue('confirmPassword', e.target.value)}
                        ref={(ref) => (inputRefs.current.confirmPassword = ref)}
                        placeholder="Retype your password"
                        autoComplete="new-password"
                        required
                    >
                        {getErrorMessage('confirmPassword')}
                    </Input>

                    <SubmitButton name='Complete Registration' className='mt-6'/>
                </AuthForm>
            </AuthFormContainer>
        </Page>    
    );
};

export default CompleteRegister;