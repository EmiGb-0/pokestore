
import Header from "../ui/Header"

const IndexLayout = ({children, walletBalance, walletCurrency, starterPokemons}) => {
    return (
        <>
            <Header 
                starterPokemons={starterPokemons}
                walletBalance={walletBalance} 
                walletCurrency={walletCurrency}
            />
            
            {children}

        </>
    )
}

export default IndexLayout