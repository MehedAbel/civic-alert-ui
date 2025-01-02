import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import Shield from '../../../assets/shield.png';
import User from '../../../assets/user.png';

import './Home.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

const Home = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    const markers = [
        {
            geocode: [44.3000, 23.7600],
            popUp: "PopUp1"
        },
        {
            geocode: [44.3102, 23.7349],
            popUp: "PopUp2"
        },
        {
            geocode: [44.3502, 23.8249],
            popUp: "PopUp3"
        }
    ];

    const customIcon = new Icon({
        iconUrl: "/src/assets/pin-marker.png",
        iconSize: [38, 38]
    });

    return (
        <div className='h-screen'>
            <div className='bg-blue-400 h-20 w-full flex justify-between items-center px-5 py-2'>
                <div>
                    <Link to="/client/home" className='flex gap-2 items-center'>
                        <img src={Shield} alt="" className='h-11' />
                        <p className='text-3xl text-white font-semibold font-syne'>Civic Alert</p>
                    </Link>
                </div>
                <div className='flex gap-7 items-center'>
                    <Link to="/client/home">
                        <p className='text-xl text-white font-semibold font-syne'>Rapoarte</p>
                    </Link>
                    <Link to="/client/home">
                        <p className='text-xl text-white font-semibold font-syne'>Q/A</p>
                    </Link>
                    <Link to="/client/home">
                        <p className='text-xl text-white font-semibold font-syne'>Contact</p>
                    </Link>
                    <Link to="/client/home">
                        <img src={User} alt="" className='h-8' />
                    </Link>
                </div>
            </div>  
            <div className='h-full bg-blue-100'>
                <MapContainer center={[44.3302, 23.7949]} zoom={13}>
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />

                    {
                        markers.map((marker, index) => (
                            <Marker 
                                position={marker.geocode} 
                                icon={customIcon}
                            >
                                <Popup>
                                    <h2>{marker.popUp}</h2>
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            </div>
        </div>
    );
}

export default Home;