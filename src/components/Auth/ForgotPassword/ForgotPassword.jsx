import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext.jsx';

import Loader from '../../Modal/Loader/Loader.jsx';
import Page from '../Form/Page.jsx'
import AuthFormContainer from '../Form/AuthFormContainer.jsx';
import AuthForm from '../Form/AuthForm.jsx';
import Title from '../Form/Title.jsx';
import Input from '../Form/Input.jsx';
import SubmitButton from '../Form/SubmitButton.jsx';
import ErrorMessage from '../../Error/Error.jsx';
import Logo from '../Form/Logo.jsx';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const [formValues, setFormValues] = useState({
        email: ''
    });

    const inputRefs = useRef({
        email: null
    });

    const formErrorRef = useRef();

    useEffect(() => {
        setFormError('');
    }, [formValues, wasFormSubmitted]);

    useEffect(() => {
        inputRefs.current.email.focus();
    }, []);

    const updateFormValue = (fieldName, value) => {
        setFormValues((prevState) => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setWasFormSubmitted(true);


        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/api/auth/forgotten-password/${formValues.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw Error('Error attempting to reset password!');
            }

            setIsSuccessful(true);
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
            {isLoading && <Loader message='Resetting Password'/>} 
            <AuthFormContainer>
                <Logo />
                <Title title='Reset Password' className={isSuccessful && 'hidden'}/>
                <AuthForm onSubmit={submit} noValidate className={isSuccessful && 'hidden'}>
                    <ErrorMessage errorMessage={formError} ariaLive="assertive" ref={formErrorRef} className={`${formError ? 'block' : 'hidden'}`}/>

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
                    />

                    <SubmitButton name='Reset Password' className='mt-6'/>
                </AuthForm>

                {isSuccessful && 
                    <div className='text-blue-500 font-medium mt-3'>
                        <p>Please check your email for your new password</p> 
                        <a href="/login" className="text-blue-500 underline">
                            Log In
                        </a>

                    </div>
                }
            
            </AuthFormContainer>
        </Page>    
    );
};

export default ForgotPassword;