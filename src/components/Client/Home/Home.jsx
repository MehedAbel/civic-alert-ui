import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

import Navbar from '../Navbar/Navbar.jsx';

import './Home.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import InfrastructureIcon from '../../../assets/legend/infrastructure.png'
import ConstructionIcon from '../../../assets/legend/construction.png';
import TransportIcon from '../../../assets/legend/transport.png';
import CrashIcon from '../../../assets/legend/crash.png';

const Home = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    const markers = [
        {
            geocode: [44.3000, 23.7600],
            date: "31-12-1854",
            type: "Transport",
            description: "popup with number 1",
            images: ["https://picsum.photos/400/250", "https://picsum.photos/400/250", "https://picsum.photos/400/250"],
        },
        {
            geocode: [44.3102, 23.7349],
            date: "31-12-1854",
            type: "Accidente",
            description: "popup with number 2",
            images: ["https://picsum.photos/400/250", "https://picsum.photos/400/250", "https://picsum.photos/400/250"],
        },
        {
            geocode: [44.3502, 23.8249],
            date: "31-12-1854",
            type: "Infrastructura",
            description: "popup with number 3",
            images: ["https://picsum.photos/400/250", "https://picsum.photos/400/250", "https://picsum.photos/400/250"],
        }
    ];

    const customIcon = new Icon({
        iconUrl: "/src/assets/pin-marker.png",
        iconSize: [38, 38]
    });

    // legend toggle
    const [showLegend, setShowLegend] = useState(false);

    const toggleLegend = () => {
        setShowLegend(!showLegend);
    }

    return (
        <div className='h-screen'>
            <Navbar />
            <div className='h-full bg-blue-100 relative'>
                <MapContainer center={[44.3100, 23.8100]} zoom={13} className='z-0'>
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />

                    <MarkerClusterGroup
                        chunkedLoading
                    >
                        {
                            markers.map((marker, index) => (
                                <Marker 
                                    position={marker.geocode} 
                                    icon={customIcon}
                                >
                                    <Popup>
                                        <h2>{marker.description}</h2>
                                    </Popup>
                                </Marker>
                            ))
                        }
                    </MarkerClusterGroup>
                </MapContainer>
                
                {/* toggle legend */}
                <div className='absolute top-4 right-4 z-50'>
                    {!showLegend ? (
                        <button onClick={toggleLegend} className='bg-white border border-gray-300 rounded-md px-4 py-2 font-syne font-semibold text-xl'>Legenda</button>
                    ) : (
                        <div className='bg-white border border-gray-300 rounded-xl px-2 pb-2 font-syne'>
                            <div className='flex justify-end'>
                                <button onClick={toggleLegend} className='font-syne text-lg px-2 pt-1 font-semibold'>
                                    x
                                </button>
                            </div>
                            <div className='px-2 pb-2 pt-1 flex flex-col gap-4'>
                                <div className='flex items-center gap-4'>
                                    <div className='basis-1/6 flex justify-center items-center'>
                                        <img src={InfrastructureIcon} alt="" className='h-9'/>
                                    </div>
                                    <p className='text-md text-center px-3 py-2 bg-ocean-200 text-white rounded-2xl basis-5/6'>Infrastructura</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='basis-1/6 flex justify-center items-center'>
                                        <img src={TransportIcon} alt="" className='h-9'/>
                                    </div>
                                    <p className='text-md text-center px-3 py-2 bg-ocean-200 text-white rounded-2xl basis-5/6'>Transport</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='basis-1/6 flex justify-center items-center'>
                                        <img src={ConstructionIcon} alt="" className='h-9'/>
                                    </div>
                                    <p className='text-md text-center px-3 py-2 bg-ocean-200 text-white rounded-2xl basis-5/6'>Constructii si lucrari publice</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='basis-1/6 flex justify-center items-center'>
                                        <img src={CrashIcon} alt="" className='h-9'/>
                                    </div>
                                    <p className='text-md text-center px-3 py-2 bg-ocean-200 text-white rounded-2xl basis-5/6'>Accident</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div> 
            </div>
        </div>
    );
}

export default Home;