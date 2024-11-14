import React from 'react';

const SubmitButton = ({ name, className = '', ...props }) => {
    return (
        <button
            type="submit"
            className={"w-full max-w-80 py-3 bg-ocean-200 text-white font-semibold rounded-3xl hover:bg-ocean-300 " + className}
        >
            {name}
        </button>
    );
}

export default SubmitButton;