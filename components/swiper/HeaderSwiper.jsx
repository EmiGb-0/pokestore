
import { useRef, useState } from 'react';

import Image from "next/image"
import Link from "next/link"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation,  } from 'swiper/modules';

import 'swiper/css';

const HeaderSwiper = ({ starterPokemons, setWaveColor }) => {
    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay]}
                onSlideChange={(swiper) => {
                    setWaveColor(starterPokemons[swiper.activeIndex].color);
                }}
                className="relative z-20"
            >
                {starterPokemons.map((pokemon) => (
                    <SwiperSlide key={pokemon.id}>
                        <div className="flex flex-col items-center p-4">
                            <div className='relative'>
                                <Image
                                    src={pokemon.image}
                                    alt={pokemon.name}
                                    width={300}
                                    height={300}
                                    className="z-20 relative mb-2"
                                />
                                <div 
                                    className="absolute inset-0 rounded-full z-10"
                                    style={{ 
                                        backgroundColor: pokemon.color + "80", 
                                        transform: "scale(1.2)",
                                        top: "10%"
                                    }}
                                />
                            </div>
                            <h3 className="capitalize font-semibold text-3xl">{pokemon.name}</h3>
                           
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

export default HeaderSwiper