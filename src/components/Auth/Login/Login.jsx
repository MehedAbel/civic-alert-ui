import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

import sha256 from 'js-sha256';

import Page from '../Forms/Page.jsx'
import AuthFormContainer from '../Forms/AuthFormContainer.jsx';
import AuthForm from '../Forms/AuthForm.jsx';
import Title from '../Forms/Title.jsx';
import Input from '../Forms/Input.jsx';
import SubmitButton from '../Forms/SubmitButton.jsx';
import Error from '../../Error/Error.jsx';
import Logo from '../Forms/Logo.jsx';

const Login = () => {
    const { login } = useAuth();

    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const [formValues, setFormValues] = useState({
        email: '',
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
            await login(formValues.email, hashedPassword);
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
                <Title title='Welcome'/>
                <AuthForm onSubmit={submit} noValidate>
                    <Error errorMessage={formError} ariaLive="assertive" ref={formErrorRef} className={`${formError ? 'block' : 'hidden'}`}/>

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

                    <p className="text-center mt-6 mb-3">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="text-blue-500 underline">
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