import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

import Navbar from '../Navbar/Navbar.jsx';

import './Home.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import InfrastructureIcon from '../../../assets/legend/infrastructure.png'
import ConstructionIcon from '../../../assets/legend/construction.png';
import TransportIcon from '../../../assets/legend/transport.png';
import CrashIcon from '../../../assets/legend/crash.png';

const Home = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [clickedLocation, setClickedLocation] = useState(null);
    const [reportDetails, setReportDetails] = useState({
        latitude: null,
        longitude: null,
        title: null,
        description: null,
        category: null
    });

    const MapEvents = () => {
        useMapEvents({
            contextmenu: (e) => {
                e.preventDefault();
                const { lat, lng } = e.latlng;
                setClickedLocation({ lat, lng });
                setModalOpen(true);
            }
        });

        return null;
    };

    // const handleRightClick = (e) => {
    //     e.preventDefault();
    //     const { lat, lng } = e.latlng;
    //     setClickedLocation({ lat, lng });
    //     setModalOpen(true);
    // };

    const handleInputChange = (e) => {
        setReportDetails({
            ...reportDetails,
            [e.target.name]: e.target.value
        });  
    };

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
            <div className='bg-blue-100 relative h-full'>
                <MapContainer center={[44.3100, 23.8100]} zoom={13} className='z-0'>
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />

                    <MapEvents />

                    <MarkerClusterGroup
                        chunkedLoading
                    >
                        {
                            markers.map((marker, index) => (
                                <Marker 
                                    position={marker.geocode} 
                                    icon={customIcon}
                                    key={index}
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
            
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-xl font-bold mb-2">Create a Report</h2>
                    <p className="text-sm text-gray-600">Lat: {clickedLocation.lat}, Lng: {clickedLocation.lng}</p>

                    <label className="block mt-3 text-sm font-medium">Report Category:</label>
                    <select
                        name="type"
                        value={reportDetails.category}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md"
                    >
                        <option value="">Select Category</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Accident">Accident</option>
                        <option value="Transport">Transport</option>
                    </select>

                    <label className="block mt-3 text-sm font-medium">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={reportDetails.title}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md"
                    />

                    <label className="block mt-3 text-sm font-medium">Description:</label>
                    <textarea
                        name="description"
                        value={reportDetails.description}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md"
                    />

                    <div className="flex justify-end mt-4">
                        <button onClick={() => setModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                    </div>
                </div>
            </div>
            )}

        </div>
    );
}

export default Home;