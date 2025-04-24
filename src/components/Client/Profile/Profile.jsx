import Navbar from '../Navbar/Navbar.jsx';
import UserIcon from '../../../assets/user.png';
import SecUser from '../../../assets/secUser.png';
import LogoutIcon from '../../../assets/logout.png';
import EditIcon from '../../../assets/edit.png';
import { useAuth } from "../../../context/AuthContext.jsx";
import { useState } from "react";

export default function Profile() { 
    const { logout, email, firstName, lastName } = useAuth();

    const [userData, setUserData] = useState({
        email,
        firstName,
        lastName
    });

    const [editMode, setEditMode] = useState(false);

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });  
    };

    const handleSave = () => {
        setEditMode(false);
    }

	return (
		<div className="flex flex-col font-syne h-screen bg-gray-100">
			<Navbar />
			<div className='flex flex-col p-9 gap-6 bg-gray-100'>
				<div className='flex justify-between'>
					<h1 className='text-2xl font-semibold'>Profilul meu</h1>
                    {
                        editMode ? 
                            (<button className='py-1 px-2 bg-green-500 hover:bg-green-600 text-white text-lg rounded-lg' onClick={() => handleSave()}>
                                Salveaza
                            </button>) : 
                            (<button className='py-1 px-2 bg-ocean-200 hover:bg-ocean-300 text-white text-lg rounded-lg flex gap-1 items-center' onClick={() => setEditMode(true)}>
                                <img src={EditIcon} alt="Edit Icon" className='h-5'/>
                                <p>Editare</p>
                            </button>)
                    }
				</div>
				<div className='flex gap-6 flex-col md:flex-row items-center md:items-start'>
                    <div className='flex flex-col items-center bg-white flex-1 max-w-96 p-5 rounded-lg shadow-lg'>
                        <img src={UserIcon} alt="User Icon" className='h-20'/>
                        <h3 className='text-ocean-200 font-medium text-lg mt-1'>{firstName + " " + lastName}</h3>
                        <div className='flex flex-col w-full gap-3 pb-4'>
                            <div>
                                <label htmlFor="lastName">Nume</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name='lastName'
                                    value={userData.lastName}
                                    onChange={handleInputChange}
                                    className='w-full py-1 px-2 border border-gray-300 rounded-md text-gray-500'
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label htmlFor="firstName">Prenume</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name='firstName'
                                    value={userData.firstName}
                                    onChange={handleInputChange}
                                    className='w-full py-1 px-2 border border-gray-300 rounded-md text-gray-500'
                                    disabled={!editMode}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    name='email'
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className='w-full py-1 px-2 border border-gray-300 rounded-md text-gray-500'
                                    disabled={!editMode}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 flex-1'>
                        <div className='bg-white border-gray-400 h-fit rounded-lg shadow-lg p-5 flex flex-col gap-4'>
                            <div className='flex gap-3'>
                                <img src={SecUser} alt="User Icon" className='h-6'/>
                                <h3 className='text-lg font-medium'>Setari Cont</h3>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex justify-between items-center'>
                                    <h4 className=''>Doriti sa va deconectati din aplicatie?</h4>
                                    <button 
                                        className='bg-red-500 text-white py-1 px-2 rounded-md flex items-center gap-2 hover:bg-red-600'
                                        onClick={logout}    
                                    >
                                        <img src={LogoutIcon} alt="Logout Icon" className='h-4'/>
                                        <p>Deconectare</p>
                                    </button>
                                </div>  
                            </div>
                        </div>
                        
                    </div>  
                </div>
			</div>
		</div>
	);
}