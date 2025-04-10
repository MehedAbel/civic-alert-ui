import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

import Navbar from '../Navbar/Navbar.jsx';
import Loader from '../../Modal/Loader/Loader.jsx';

import './Home.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import InfrastructureIcon from '../../../assets/legend/infrastructure.png'
import ConstructionIcon from '../../../assets/legend/construction.png';
import TransportIcon from '../../../assets/legend/transport.png';
import CrashIcon from '../../../assets/legend/crash.png';
import { use } from 'react';
import { API_URL } from '../../../config.js';

const MyMap = ({ children }) => {
    const map = useMap();

    useEffect(() => {
        window.leafletMap = map;
    }, [map]);

    return children;
}

const ClickHandler = ({onMapClick, isPlacingMarker}) => {
    useMapEvents({
        click: (e) => {
            if (isPlacingMarker) {
                onMapClick(e.latlng);
            }
        }
    });

    return null;
};

const customIcon = new Icon({
    iconUrl: "/src/assets/pin-marker.png",
    iconSize: [38, 38]
});

const Home = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isPlacingMarker, setIsPlacingMarker] = useState(false);
    const [clickedLocation, setClickedLocation] = useState(null);
    const [createReportModalOpen, setCreateReportModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [activeMarker, setActiveMarker] = useState(null);
    const [reportDetails, setReportDetails] = useState({
        latitude: 0,
        longitude: 0,
        title: '',
        description: '',
        category: '',
        images: []
    });

    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`${API_URL}/api/report/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw Error('Failed to fetch reports');
                }

                const data = await response.json();

                console.log(data);
                setReports(data);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchReports();
    }, []);

    const openViewModal = (report) => {
        setSelectedReport(report);
        setIsViewModalOpen(true);
    }

    const closeViewModal = () => {
        setSelectedReport(null);
        setIsViewModalOpen(false);
    }

    const handleMapClick = (latlng) => {
        setReportDetails({
            ...reportDetails,
            latitude: latlng.lat,
            longitude: latlng.lng
        })

        setClickedLocation(latlng);
        setCreateReportModalOpen(true);
        setIsPlacingMarker(false);
    };

    const handleTogglePlaceMarker = () => {
        setIsPlacingMarker((prevState) => !prevState);
    };

    const handleInputChange = (e) => {
        setReportDetails({
            ...reportDetails,
            [e.target.name]: e.target.value
        });  
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setReportDetails({
            ...reportDetails,
            images: [...reportDetails.images, ...files]
        });
    };

    // legend toggle
    const [showLegend, setShowLegend] = useState(false);

    const toggleLegend = () => {
        setShowLegend(!showLegend);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoadingMessage('Submitting report...');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('report', JSON.stringify({
            title: reportDetails.title,
            description: reportDetails.description,
            category: reportDetails.category,
            latitude: reportDetails.latitude,
            longitude: reportDetails.longitude
        }));

        reportDetails.images.forEach((image) => {
            formData.append(`images`, image);
        });

        try {
            const response = await fetch(`${API_URL}/api/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            })

            if (!response.ok) {
                throw Error('Failed to submit report');
            }

            const data = await response.json();
            setReports([...reports, data]);

        } catch (error) {
            console.error(error.message);
            // setFormError(error.message);
            formErrorRef.current.focus();
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setCreateReportModalOpen(false);
        }
    }

    return (
        <div className='h-screen'>
            {isLoading && <Loader message={loadingMessage}/>}
            <Navbar />
            <div className='bg-blue-100 relative h-full'>
                <MapContainer center={[44.3100, 23.8100]} zoom={13} className='z-0 {isPlacingMarker ? "cursor-crosshair" : ""}'>
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />

                    <ClickHandler onMapClick={handleMapClick} isPlacingMarker={isPlacingMarker}/>
                    
                    <MyMap>
                        <MarkerClusterGroup
                            chunkedLoading
                        >
                            {
                                reports.map((report, index) => (
                                    <Marker 
                                        position={[report.latitude, report.longitude]} 
                                        icon={customIcon}
                                        key={index}
                                    >
                                        <Popup>
                                            {/* POPUP */}
                                            <div className="p-2 w-64">
                                                <h2 className="text-lg font-bold border-b pb-1">{report.title}</h2>
                                                <div className="text-sm">
                                                    <p><span className="font-medium">Description:</span> {report.description}</p>
                                                    <p><span className="font-medium">Category:</span> {report.category}</p>
                                                    <p><span className="font-medium">Date:</span> {new Date(report.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className='w-full h-28 bg-gray-200 flex items-center justify-center'>Photo Goes Here</div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openViewModal(report);

                                                        const popup = e.target.closest('.leaflet-popup');
                                                        if (popup) {
                                                            const map = window.leafletMap;
                                                            map.closePopup();
                                                        }
                                                    }} 
                                                    className='w-full py-2 bg-ocean-200 text-white font-semibold rounded-3xl hover:bg-ocean-300 mt-3'>View Report</button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))
                            }
                        </MarkerClusterGroup>
                    </MyMap>

                    
                </MapContainer>

                {/* place marker button */}
                <button
                    className="absolute top-4 left-14 z-10 bg-white border border-gray-300 rounded-md px-4 py-2 font-syne font-semibold text-xl"
                    disabled={createReportModalOpen}
                    style={{ opacity: createReportModalOpen ? 0.5 : 1 }}
                    onClick={handleTogglePlaceMarker}
                >
                    {isPlacingMarker ? "Cancel Marker" : "Place Marker"}
                </button>
                
                {/* toggle legend */}
                <div className='absolute top-4 right-4 z-10' style={{ opacity: createReportModalOpen ? 0.5 : 1 }}>
                    {!showLegend ? (
                        <button onClick={toggleLegend} disabled={createReportModalOpen} className='bg-white border border-gray-300 rounded-md px-4 py-2 font-syne font-semibold text-xl'>Legenda</button>
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
            
            {/* view report modal */}
            {isViewModalOpen && selectedReport && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-2">{selectedReport.title}</h2>
                        <p><span className="font-medium">Description:</span> {selectedReport.description}</p>
                        <p><span className="font-medium">Category:</span> {selectedReport.category}</p>
                        <p><span className="font-medium">Date:</span> {new Date(selectedReport.date).toLocaleDateString()}</p>
                        <div className='w-full h-28 bg-gray-200 flex items-center justify-center'>Photo Goes Here</div>

                        <button 
                            onClick={closeViewModal} 
                            className="mt-4 w-full bg-gray-500 text-white py-1 rounded hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            
            {/* create report modal */}
            {createReportModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-xl font-bold mb-2">Create a Report</h2>
                    <p className="text-sm text-gray-600">Lat: {clickedLocation.lat}, Lng: {clickedLocation.lng}</p>

                    <label className="block mt-3 text-sm font-medium">Report Category:</label>
                    <select
                        name="category"
                        value={reportDetails.category}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md"
                        required
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
                        required
                    />

                    <label className="block mt-3 text-sm font-medium">Description:</label>
                    <textarea
                        name="description"
                        value={reportDetails.description}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded-md"
                        required
                    />

                    <label className='block mt-3 text-sm font-medium'>Images:</label>
                    <input 
                        type="file" 
                        name='images'
                        onChange={handleImageChange}
                        className='w-full border p-2 rounded-md'
                        accept='image/*'
                        multiple
                    />

                    <div className="flex justify-end mt-4">
                        <button onClick={() => setCreateReportModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
                    </div>
                </div>
            </div>
            )}

        </div>
    );
}

export default Home;