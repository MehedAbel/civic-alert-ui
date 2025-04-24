import { useEffect, useState, useRef } from 'react';
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
import ErrorMessage from '../../Error/Error.jsx';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ImageGallery from '../../Swiper/ImageGallery.jsx';

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

const getPinIcon = (category) => {
    switch (category) {
        case 'Infrastructura':
            return new Icon({
                iconUrl: "/src/assets/legend/infrastructure-pin.png",
                iconSize: [48, 50]
            });
        case 'Constructii si lucrari publice':
            return new Icon({
                iconUrl: "/src/assets/legend/construction-pin.png",
                iconSize: [48, 50]
            });
        case 'Transport':
            return new Icon({
                iconUrl: "/src/assets/legend/transport-pin.png",
                iconSize: [48, 50]
            });
        case 'Accident':
            return new Icon({
                iconUrl: "/src/assets/legend/accident-pin.png",
                iconSize: [48, 50]
            });
        default:
            return new Icon({
                iconUrl: "/src/assets/pin-marker.png",
                iconSize: [48, 50]
            });
    }
}

const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
  

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

    const [wasFormSubmitted, setWasFormSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const inputRefs = useRef({
        title: null,
        description: null,
        category: null
    });

    const formErrorRef = useRef();

    useEffect(() => {
        setFormError('');
    }, [reportDetails, wasFormSubmitted]);

    const isFieldInvalid = (fieldName) => {
        return reportDetails[fieldName] === '';
    };

    const getErrorMessage = (fieldName) => {
        // keep the error message in the DOM for screen readers

        const invalidFieldError = 'This field is required';
        let errorMessage = null;

        const fieldValue = reportDetails[fieldName];

        if (!fieldValue && wasFormSubmitted) {
            errorMessage = invalidFieldError;
        }

        if (errorMessage) {
            return <ErrorMessage errorMessage={errorMessage} id={fieldName + 'Error'} />;
        }

        return (
            <ErrorMessage
                errorMessage={errorMessage}
                id={fieldName + 'Error'}
                style={{ position: 'absolute', left: '-99999px' }}
            />
        );
    };

    const isFormValid = () => {
        return !(
            isFieldInvalid('title') ||
            isFieldInvalid('description') ||
            isFieldInvalid('category')
        );
    };

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

    useEffect(() => {
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
        setWasFormSubmitted(true);

        if (!isFormValid()) {
            for (let input in inputRefs.current) {
                if (isFieldInvalid(input)) {
                    const event = new Event('click'); // it doesn't read the error without this when using the screen reader
                    inputRefs.current[input].focus();
                    inputRefs.current[input].dispatchEvent(event);
                    return;
                }
            }
        }
        
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            })

            if (!response.ok) {
                throw Error('Failed to submit report');
            }

            fetchReports();
        } catch (error) {
            console.error(error.message);
            setFormError(error.message);
            formErrorRef.current.focus();
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
            setCreateReportModalOpen(false);
            setWasFormSubmitted(false);
            setReportDetails({
                latitude: 0,
                longitude: 0,
                title: '',
                description: '',
                category: '',
                images: []
            })
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            {isLoading && <Loader message={loadingMessage}/>}
            <Navbar />
            <div className='bg-blue-100 relative h-full flex'>
                {/* view report modal */}
                {isViewModalOpen && selectedReport && (
                    <div className="flex items-center justify-center bg-black bg-opacity-50 relative font-syne">
                        <div className="bg-white w-96 shadow-lg h-full">
                        {
                            selectedReport.imageUrls?.length > 0 ? (<ImageGallery images={selectedReport.imageUrls} />) : 
                            (
                                <div className="w-96 h-56 bg-gray-200 rounded-lg flex justify-center items-center font-mono">
                                    Fara Imagini
                                </div>
                            )
                        }

                            <h2 className="text-xl font-bold text-center mt-5">{selectedReport.title}</h2>
                            <hr className='mt-5 bg-ocean-light h-0.5 mx-4 opacity-50 rounded-md'/>
                            <div className='flex justify-between mx-4 mt-5'>
                                <div className='flex flex-col'>
                                    <span className="font-medium text-ocean-light">Data si timpul</span>
                                    <span className='font-semibold'> {new Date(selectedReport.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                    </span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className="font-medium text-ocean-light">Categorie</span>
                                    <span className='font-semibold'>{selectedReport.category}</span>
                                </div>
                            </div>
                            <hr className='mt-5 bg-ocean-light h-0.5 mx-4 opacity-50 rounded-md'/>
                            <div className='mt-5 mx-4'>
                                <div className="font-medium text-ocean-light">Descriere</div>
                                <div>{selectedReport.description}</div>
                            </div>
                            

                            <button 
                                onClick={closeViewModal} 
                                className="absolute text-lg top-2 right-2 text-white bg-gray-300 hover:bg-gray-400 z-10 px-2 rounded-full font-semibold"
                            >
                                X
                            </button>
                        </div>
                    </div>
                )}

                <div className='h-full w-full relative'>
                    <MapContainer center={[44.3100, 23.8100]} zoom={13} className={"z-0 w-full "}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />
                        <ClickHandler onMapClick={handleMapClick} isPlacingMarker={isPlacingMarker}/>
                    
                        <MyMap className=''>
                            <MarkerClusterGroup
                                chunkedLoading
                            >
                                {
                                    reports.map((report, index) => {
                    
                    
                                        return (
                                        <Marker
                                            position={[report.latitude, report.longitude]}
                                            icon={getPinIcon(report.category)}
                                            key={index}
                                        >
                                            <Popup>
                                                {/* POPUP */}
                                                <div className="p-2 w-64 font-syne">
                                                    <h2 className="text-lg font-bold text-center">{report.title}</h2>
                                                    <hr className='mx-4 bg-ocean-light h-0.5 opacity-50 rounded-md mt-2'/>
                                                    <div className="">
                                                        <p><span className="font-medium text-ocean-light">Data si timpul:</span> {new Date(report.createdAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        })}</p>
                                                    </div>
                                                        <p><span className="font-medium text-ocean-light">Categorie:</span> {report.category}</p>
                                                        <p><span className="font-medium text-ocean-light">Descriere:</span> {truncate(report.description, 80)}</p>
                                                    {report.imageUrls?.length > 0 ? (
                                                        <Swiper
                                                            modules={[Pagination]}
                                                            spaceBetween={50}
                                                            slidesPerView={1}
                                                            pagination={{
                                                                clickable: true,
                                                            }}
                                                            className="w-full h-44 rounded-lg overflow-hidden"
                                                        >
                                                            {report.imageUrls.map((image, index) => {
                                                                return (
                                                                    <SwiperSlide key={index}>
                                                                        <img
                                                                            src={image}
                                                                            className="object-cover w-full h-full"
                                                                        />
                                                                    </SwiperSlide>
                                                                );
                                                            })}
                                                        </Swiper>
                                                    ) : (
                                                        <div className="w-full h-44 bg-gray-200 rounded-lg flex justify-center items-center font-mono">
                                                            No Image
                                                        </div>
                                                    )}
                    
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
                                                        className='w-full py-2 bg-ocean-200 text-white font-semibold rounded-3xl hover:bg-ocean-300 mt-3'>
                                                            Vezi Raport
                                                    </button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    )})
                                }
                            </MarkerClusterGroup>
                        </MyMap>                    
                    </MapContainer>

                    {/* place marker button */}
                    {
                        isPlacingMarker ? 
                        (
                            <div className='bg-white border border-gray-300 rounded-2xl px-2 pb-5 font-syne absolute top-4 left-14 z-10'>
                                <div className='flex justify-end'>
                                    <button onClick={handleTogglePlaceMarker} className='font-syne text-lg text-white px-2 mt-2 mb-1 font-semibold bg-gray-300 hover:bg-gray-400 rounded-full'>
                                        X
                                    </button>
                                </div>
                                <div className='px-6 pb-2 pt-1 max-w-48 text-center'>
                                    Faceti click pe harta unde s-a intamplat evenimentul
                                </div>
                            </div>
                        ) : 
                        (
                            <button
                                className="absolute top-4 left-14 z-10 bg-white border border-gray-300 rounded-2xl px-4 py-2 font-syne font-semibold text-xl"
                                disabled={createReportModalOpen}
                                style={{ opacity: createReportModalOpen ? 0.5 : 1 }}
                                onClick={handleTogglePlaceMarker}
                            >
                                Creati un raport
                            </button>
                        )
                    }

                    {/* toggle legend */}
                    <div className='absolute top-4 right-4 z-10' style={{ opacity: createReportModalOpen ? 0.5 : 1 }}>
                        {!showLegend ? (
                            <button 
                                onClick={toggleLegend} 
                                disabled={createReportModalOpen} 
                                className='bg-white border border-gray-300 rounded-2xl px-4 py-2 font-syne font-semibold text-xl'>Legenda</button>
                        ) : (
                            <div className='bg-white border border-gray-300 rounded-2xl px-2 pb-5 font-syne'>
                                <div className='flex justify-end'>
                                    <button onClick={toggleLegend} className='font-syne text-lg px-2 mt-2 mb-1 font-semibold text-white bg-gray-300 hover:bg-gray-400 rounded-full'>
                                        X
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
            
            {/* create report modal */}
            {createReportModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-syne">
                <div className="bg-white p-6 rounded-lg w-96 relative bg-gradient-to-b">
                    <h2 className="text-xl font-bold mb-2 text-center">Creeaza Raport</h2>
                    <ErrorMessage errorMessage={formError} ariaLive="assertive" ref={formErrorRef} className={`${formError ? 'block' : 'hidden'}`}/>
                    <p className="text-sm text-gray-600">Lat: {clickedLocation.lat}, Lng: {clickedLocation.lng}</p>

                    <label className="block mt-3 text-sm font-medium">Categorie*</label>
                    <select
                        name="category"
                        id="category"
                        value={reportDetails.category}
                        onChange={handleInputChange}
                        ref={(ref) => inputRefs.current.category = ref}
                        className="w-full border p-2 rounded-md"
                        required
                    >
                        <option value="">Selecteza o categorie</option>
                        <option value="Infrastructura">Infrastructura</option>
                        <option value="Accident">Accident</option>
                        <option value="Transport">Transport</option>
                        <option value="Constructii si lucrari publice">Constructii si lucrari publice</option>
                    </select>
                    {getErrorMessage('category')}

                    <label className="block mt-3 text-sm font-medium">Titlu*</label>
                    <input
                        maxLength={50}
                        type="text"
                        name="title"
                        id="title"
                        value={reportDetails.title}
                        onChange={handleInputChange}
                        ref={(ref) => inputRefs.current.title = ref}
                        className="w-full border p-2 rounded-md"
                        required
                    />
                    {getErrorMessage('title')}

                    <label className="block mt-3 text-sm font-medium">Descriere*</label>
                    <textarea
                        maxLength={255}
                        name="description"
                        id="description"
                        value={reportDetails.description}
                        onChange={handleInputChange}
                        ref={(ref) => inputRefs.current.description = ref}
                        className="w-full border p-2 rounded-md"
                        required
                    />
                    {getErrorMessage('description')}

                    <label className='block mt-3 text-sm font-medium'>Imagini</label>
                    <input 
                        type="file" 
                        name='images'
                        id="images"
                        onChange={handleImageChange}
                        className='w-full border p-2 rounded-md'
                        accept='image/*'
                        multiple
                    />

                    <div className="flex justify-center mt-4">
                        <button onClick={handleSubmit} className="px-4 py-1 bg-ocean-200 text-white rounded-lg hover:bg-ocean-light">Trimite Raport</button>
                    </div>

                    <button onClick={() => setCreateReportModalOpen(false)} className="mr-2 absolute top-3 left-5 text-ocean-light rounded-md font-semibold text-4xl">{"<"}</button>
                </div>
            </div>
            )}

        </div>
    );
}

export default Home;
