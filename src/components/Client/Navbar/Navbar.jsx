import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import Shield from '../../../assets/shield.png';
import User from '../../../assets/user.png';

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <div className='bg-ocean-200 h-20 w-full flex justify-between items-center px-5 py-2'>
            <div>
                <Link to="/client/home" className='flex gap-2 items-center'>
                    <img src={Shield} alt="" className='h-11' />
                    <p className='text-3xl text-white font-semibold font-syne'>Civic Alert</p>
                </Link>
            </div>
            <div className='flex gap-7 items-center'>
                <Link to="/client/reports">
                    <p className='text-xl text-white font-semibold font-syne'>Rapoarte</p>
                </Link>
                <Link to="/client/faq">
                    <p className='text-xl text-white font-semibold font-syne'>FAQ</p>
                </Link>
                <Link to="/client/home">
                    <p className='text-xl text-white font-semibold font-syne'>Contact</p>
                </Link>
                <button onClick={logout}>
                    <p className='text-xl text-white font-semibold font-syne'>Logout</p>
                </button>
                <Link to="/client/home">
                    <img src={User} alt="" className='h-8' />
                </Link>
            </div>
        </div>
    );
}

export default Navbar;