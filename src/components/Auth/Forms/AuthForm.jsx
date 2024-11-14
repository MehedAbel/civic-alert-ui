import React from 'react';

const AuthForm = ({ onSubmit, className = '', children, ...props }) => {
    return (
        <form onSubmit={onSubmit} className={'flex flex-col items-center ' + className} {...props}>
            {children}
        </form>
    )
}

export default AuthForm;