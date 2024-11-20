import Shield from '../../../assets/shield.png'

const Logo = ({}) => {
    return (
        <div className='flex gap-1 text-3xl justify-center mb-6 items-center'>
            <p>Civic</p>
            <img src={Shield} className='h-11' />
            <p>Alert</p>
        </div>
    );
};

export default Logo;