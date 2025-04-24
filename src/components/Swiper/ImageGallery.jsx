import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Swiper, SwiperSlide } from "swiper/react";
import { Zoom, Navigation, Thumbs, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

export default function ImageGallery({ images, gallery = false }) {
    const [isEnd, setIsEnd] = useState({
        left: true,
        right: true,
    });

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="w-full flex flex-col justify-center items-center">
            {images.length > 0 && (
                <>
                    <div className="w-full flex justify-center items-center relative">
                        <div
                            className={`absolute nlg:static z-50 left-1 custom-swiper-button-prev cursor-pointer text-sm md:text-md px-4 py-2 rounded-lg bg-gray-100 mx-2 sm:mx-5 ${
                                isEnd.left ? "text-zinc-400" : "text-zinc-800"
                            }`}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        <Swiper
                            style={{
                                "--swiper-navigation-color": "#000",
                                "--swiper-pagination-color": "#000",
                            }}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[FreeMode, Zoom, Navigation, Thumbs]}
                            spaceBetween={50}
                            slidesPerView={1}
                            navigation={{
                                prevEl: ".custom-swiper-button-prev",
                                nextEl: ".custom-swiper-button-next",
                            }}
                            onSlideChange={(swiper) => {
                                setIsEnd({
                                    left: swiper.isBeginning,
                                    right: swiper.isEnd,
                                });
                            }}
                            onInit={(swiper) => {
                                setIsEnd({
                                    left: swiper.isBeginning,
                                    right: swiper.isEnd,
                                });
                            }}
                            zoom={true}
                            className={
                                "w-full max-w-3xl aspect-square rounded-lg overflow-hidden"
                            }
                        >
                            {images.map((image, index) => {
                                return (
                                    <SwiperSlide
                                        key={index}
                                        className={
                                            "h-full w-full bg-gray-100 flex justify-center items-center"
                                        }
                                    >
                                        <div className="swiper-zoom-container h-full w-full flex justify-center items-center">
                                            <img
                                                src={image}
                                                className={
                                                    "object-contain max-h-full max-w-full"
                                                }
                                            />
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        <div
                            className={`absolute nlg:static z-50 right-1 custom-swiper-button-next cursor-pointer text-sm md:text-md px-4 py-2 rounded-lg bg-gray-100 mx-2 sm:mx-5 ${
                                isEnd.right ? "text-zinc-400" : "text-zinc-800"
                            }`}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>
                    </div>
                    {images.length > 1 && gallery && (
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            centerInsufficientSlides={true}
                            slidesPerView="auto"
                            className={"w-full h-20 sxs:h-24 xs:h-28 mt-5"}
                        >
                            {images.map((image, index) => {
                                return (
                                    <SwiperSlide
                                        key={index}
                                        className="h-full"
                                        style={{ width: "auto" }}
                                    >
                                        <div
                                            className={
                                                "h-full w-full flex justify-center items-center"
                                            }
                                        >
                                            <img
                                                src={image}
                                                className={
                                                    "object-cover h-full aspect-square border-4 border-transparent hover:border-blue-500 rounded-lg cursor-pointer"
                                                }
                                            />
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    )}
                </>
            )}
        </div>
    );
}