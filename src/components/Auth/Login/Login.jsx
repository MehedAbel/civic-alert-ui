import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

import sha256 from 'js-sha256';

import Loader from '../../Modal/Loader/Loader.jsx';
import Page from '../Form/Page.jsx'
import AuthFormContainer from '../Form/AuthFormContainer.jsx';
import AuthForm from '../Form/AuthForm.jsx';
import Title from '../Form/Title.jsx';
import Input from '../Form/Input.jsx';
import SubmitButton from '../Form/SubmitButton.jsx';
import ErrorMessage from '../../Error/Error.jsx';
import Logo from '../Form/Logo.jsx';

const Login = () => {
    const { login } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const [rememberMe, setRememberMe] = useState(false);

    const [formValues, setFormValues] = useState({
        email: localStorage.getItem('rememberedEmail') || '',
        password: '',
    });

    const inputRefs = useRef({
        email: null,
        password: null,
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

        const hashedPassword = sha256(formValues.password);

        try {
            setIsLoading(true);
            await login(formValues.email, hashedPassword);
        } catch(error) {
            console.error(error.message);
            setFormError(error.message);
            formErrorRef.current.focus();
        } finally {
            rememberMe ? localStorage.setItem('rememberedEmail', formValues.email) : localStorage.removeItem('rememberedEmail');
            setIsLoading(false);
        }
    };

    return (
        <Page>
            {isLoading && <Loader message='Logging in'/>} 
            <AuthFormContainer>
                <Logo />
                <Title title='Welcome'/>
                <AuthForm onSubmit={submit} noValidate>
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
                    />

                    <div className='flex items-center justify-between w-full text-sm'>
                        <div className='flex items-center'>
                            <input 
                                type="checkbox" 
                                name="remember" 
                                className='mr-2 w-4 h-4'
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember">Remember Me</label>
                        </div>
                        <a href="/forgot-password" className="text-ocean-200 hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <p className="text-center mt-9 mb-3 text-sm">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="text-ocean-200 hover:underline">
                            Sign Up
                        </a>
                    </p>

                    <SubmitButton name='Login' />
                </AuthForm>
            </AuthFormContainer>
        </Page>    
    );
};

export default Login;