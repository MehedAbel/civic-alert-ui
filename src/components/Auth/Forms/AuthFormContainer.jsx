import React from 'react';

const AuthFormContainer = ({ className = '', children }) => {
    return (
        <div className={"w-full max-w-md bg-white rounded-3xl shadow-lg p-8 font-syne " + className}>
            {children}
        </div>
    )
}

export default AuthFormContainer;