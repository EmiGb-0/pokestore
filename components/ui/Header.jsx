import { useState } from 'react'

import { useRouter } from 'next/router'

import Navbar from './Navbar'
import HeaderSwiper from '../swiper/HeaderSwiper'
import WaveWrapper from './WaveWrapper'

const Header = ({ walletBalance, walletCurrency, starterPokemons = [] }) => {

    const router = useRouter();

    const [waveColor, setWaveColor] = useState(starterPokemons[0]?.color || '#4facfe');
    
    return (
        <header className='relative'>
            <Navbar walletBalance={walletBalance} walletCurrency={walletCurrency} />
            
            {router.pathname === '/' && (
                <div className='relative min-h-[250px] max-h-[250px] mb-52'>
                    <WaveWrapper color={waveColor} />

                    <div class="relative z-10 py-5">
                        <HeaderSwiper 
                            starterPokemons={starterPokemons} 
                            setWaveColor={setWaveColor} 
                        />
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header