import Navbar from '../Navbar/Navbar.jsx';
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { API_URL } from "../../../config.js";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import ImageGallery from '../../Swiper/ImageGallery.jsx';
import GoogleMapsIcon from '../../../assets/google-maps.png';

const statusSteps = ["OPEN", "IN_PROGRESS", "SOLVED"];
const statusLabels = {
  OPEN: "Deschis",
  IN_PROGRESS: "In progres",
  SOLVED: "Rezolvat"
};
const statusColors = {
  OPEN: {
	text: "text-ocean-200",
	bg: "bg-ocean-200"
  },
  IN_PROGRESS: {
	text: "text-yellow-500",
	bg: "bg-yellow-500"
  },
  SOLVED: {
	text: "text-green-500",
	bg: "bg-green-500"
  }
};

export default function Reports() {
  const { fetchWithAuth, email } = useAuth();
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("TOATE");

  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/report/all-by-username/${email}`)
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(console.error);
  }, []);

  console.log(reports);

  const filteredReports = filter === "TOATE"
    ? reports
    : reports.filter(r => r.status === filter);

  console.log(filteredReports);

  const toggleExpand = id => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col font-syne bg-gray-100">
        <Navbar />
      {/* Filter buttons */}
      <div className='space-y-7 p-9 bg-gray-100 h-full'>
          <div className="flex flex-wrap gap-2">
            {["TOATE", "OPEN", "IN_PROGRESS", "SOLVED"].map(s => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === s
                    ? "bg-ocean-200 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setFilter(s)}
              >
                {s === "TOATE" ? "Toate" : statusLabels[s]}
              </button>
            ))}
          </div>
          {/* Reports list */}
          {filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-xl shadow-lg flex flex-col space-y-2 relative max-w-7xl mx-auto"
            >
              {/* Expand/collapse */}
              <button
                onClick={() => toggleExpand(report.id)}
                className="self-start bg-ocean-200 text-white px-2 py-1 text-sm rounded-full absolute top-4 left-4"
              >
                {expanded === report.id ? "Ascunde detalii" : "Vezi detalii"}
              </button>

              {/* Title and Date */}
              <div className='flex justify-center'>
                  <div className='flex flex-col items-center'>
                      <h2 className="text-lg font-semibold">{report.title}</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}
                      </p>
                  </div>
              </div>
              {/* Stepper */}
              <div className="flex justify-between items-center px-2 pt-5">
			  {statusSteps.map((step, index) => {
				const currentIndex = statusSteps.indexOf(report.status);
				const isActive = index <= currentIndex;
					return (
						<div key={step} className="flex-1 flex flex-col items-center">
						<div
							className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
							isActive
								? `border-none ${statusColors[report.status].bg} text-white`
								: "border-gray-300 text-gray-400"
							}`}
						>
							{isActive ? "✓" : index + 1}
						</div>
						<span
							className={`text-sm mt-1 ${
							isActive ? statusColors[report.status].text : "text-gray-400"
							}`}
						>
							{statusLabels[step]}
						</span>
						</div>
					);
				})}
              </div>
              
              {/* Expanded content */}
              {expanded === report.id && (
                <div className="pt-5">
                  <div className='flex justify-between px-6 items-center flex-col lg:flex-row gap-6'>
                      <div className='flex flex-col gap-2 shadow-lg rounded-lg p-7'>
                          <div className='flex'>
                            <p className="text-ocean-200">Categorie:</p>
                            <p>&nbsp;{report.category}</p>
                          </div>
                          <div className='flex'>
                            <p className="text-ocean-200">Latitudine:</p>
                            <p>&nbsp;{report.latitude}</p>
                          </div>
                          <div className='flex'>
                            <p className="text-ocean-200">Longitudine:</p>
                            <p>&nbsp;{report.longitude}</p>
                          </div>
                          <div className='mt-3 -mb-2'>
                            <a
                                target='_blank' 
                                rel="noopener noreferrer"
                                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} 
                                className='font-semibold hover:underline hover:text-ocean-200 flex items-center gap-2'>
                                    <img src={GoogleMapsIcon} alt="Google Maps Icon" className='h-5'/>
                                    <p>Vezi in Google Maps</p>
                            </a>
                          </div>
                      </div>
                      <div className='max-w-md'>
							{
								report.imageUrls?.length > 0 ? (<ImageGallery images={report.imageUrls} gallery={true} />) : 
								(
									<div className="w-96 h-56 bg-gray-200 rounded-lg flex justify-center items-center font-mono">
                                    	Fara Imagini
                                	</div>
								)
							}
                      </div>

                  </div>
                  <div className='flex flex-col pt-5 px-6 pb-2'>
                      <p className="text-ocean-200 font-medium">Descriere</p>
                      <p>{report.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
