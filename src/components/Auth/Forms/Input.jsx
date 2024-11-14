import { forwardRef } from 'react';

const Input = forwardRef(({ label, className = '', id, children, ...props }, ref) => {
    return (
        <div className="flex flex-col items-start w-full mb-3">
            {label && <label htmlFor={id} className="text-gray-800 font-medium text-sm ">{label}</label>}
            <input
                className={"p-2 border border-gray-300 rounded-lg w-full " + className}
                id={id}
                ref={ref}
                {...props}
            />
            {children}
        </div>
    );
});

export default Input;