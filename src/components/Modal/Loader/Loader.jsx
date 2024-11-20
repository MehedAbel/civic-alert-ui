const Loader = ({message = ''}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex flex-col items-center justify-center">
            <div className="mb-4">
                <div className="w-16 h-16 border-4 border-ocean-300 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
            <div className="text-white font-semibold">{message}</div>
        </div>
    );
};

export default Loader;