import React from 'react';

const Title = ({ className = '', title }) => {
    return (
        <h2 className={"text-3xl font-bold text-center mb-6 " + className}>{title}</h2>
    )
}

export default Title;