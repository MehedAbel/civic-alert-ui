import { forwardRef } from "react";

const Error = forwardRef(({ className = '', errorMessage, id = '', style = {}, ariaLive = 'polite'}, ref) => {
    return (
        <div className={"mt-1" + className} aria-live={ariaLive} ref={ref}>
            <p
                className="font-medium text-sm text-red-500"
                id={id}
                style={style}
            >
                {errorMessage}
            </p>
        </div>
    );
});

export default Error;