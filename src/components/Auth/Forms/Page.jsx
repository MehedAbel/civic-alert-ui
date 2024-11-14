import React from 'react';

const Page = ({ className = '', children }) => {
    return (
        <div className={"flex flex-col justify-center items-center absolute inset-0 overflow-auto bg-gradient-to-b from-ocean-light to-ocean-dark h-screen bg-cover bg-center " + className}>
            {children}
        </div>
    )
}

export default Page;