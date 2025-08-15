import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { currencies } from "@/utils/currencies";

const CartContext = createContext();

export function CartProvider({ children, walletCurrency, walletBalance }) {
    const [isClient, setIsClient] = useState(false);
    const [wallet, setWallet] = useState({
        currency: walletCurrency ?? "MXN",
        balance: parseFloat(walletBalance) || 0,
    });
    const [cart, setCart] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [exchangeRates, setExchangeRates] = useState({});
    const [ratesReady, setRatesReady] = useState(false);

    // Detectar cliente y cargar datos
    useEffect(() => {
        setIsClient(true);

        try {
        const savedWallet = localStorage.getItem("wallet");
        if (savedWallet) setWallet(JSON.parse(savedWallet));

        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCart(JSON.parse(storedCart));

        const storedPurchased = localStorage.getItem("purchased");
        if (storedPurchased) setPurchased(JSON.parse(storedPurchased));
        } catch (err) {
        console.error("Error cargando datos del localStorage:", err);
        }
    }, []);

    // Guardar cambios en localStorage
    useEffect(() => {
        if (isClient) localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart, isClient]);

    useEffect(() => {
        if (isClient) localStorage.setItem("purchased", JSON.stringify(purchased));
    }, [purchased, isClient]);

    useEffect(() => {
        if (isClient) localStorage.setItem("wallet", JSON.stringify(wallet));
    }, [wallet, isClient]);

    // Obtener CONVERSIONES
    useEffect(() => {
        if (!isClient) return;

        async function fetchRates() {
        try {
            const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
            const data = await res.json();
            if (data && data.rates) {
            setExchangeRates(data.rates);
            setRatesReady(true);
            } else {
            throw new Error("No se recibieron tasas de cambio");
            }
        } catch (error) {
            console.error("Error cargando tipos de cambio, usando fallback local:", error);
            
            const backupRates = {
            MXN: 20.0,
            USD: 1.0,
            EUR: 0.85,
            JPY: 110.0,
            GBP: 0.75,
            };
            setExchangeRates(backupRates);
            setRatesReady(true);
        }
        }

        fetchRates();
    }, [isClient]);

    // Función para convertir precio (NO FUNCIONA)
    const convertPrice = useCallback(
        (price, fromCurrency) => {
        const amount = Number(price) || 0;
        if (fromCurrency === wallet.currency) return amount;
        if (!exchangeRates[fromCurrency] || !exchangeRates[wallet.currency]) {
            console.warn(`Tasas de cambio no disponibles para ${fromCurrency} o ${wallet.currency}`);
            return amount;
        }

        const amountInUSD = amount / exchangeRates[fromCurrency];
        return amountInUSD * exchangeRates[wallet.currency];
        }, [exchangeRates, wallet.currency]
    );

    // Agregar al carrito (con precio convertido)
    const addToCart = useCallback((pokemon) => {
            if (!ratesReady) {
                console.warn("Las tasas de cambio no están listas");
                return;
            }
            if (purchased.some((p) => p.id === pokemon.id) || cart.some((p) => p.id === pokemon.id)) {
                return;
            }

            const convertedPrice = convertPrice(pokemon.price, pokemon.currency);
            const pokemonWithConvertedPrice = { ...pokemon, convertedPrice };

            setCart((prev) => [...prev, pokemonWithConvertedPrice]);
        }, [cart, purchased, ratesReady, convertPrice]
    );

    const removeFromCart = useCallback((id) => {
        setCart((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const confirmPurchase = useCallback(() => {
        const total = cart.reduce((sum, p) => sum + Number(p.convertedPrice || 0), 0);
        if (wallet.balance >= total) {
            setWallet((prev) => ({ ...prev, balance: prev.balance - total }));
            setPurchased((prev) => [...prev, ...cart]);
            setCart([]);
            return true;
        }
        return false;
    }, [cart, wallet.balance]);

    const changeWalletCurrency = useCallback(
        (newCurrency) => {
        const convertedBalance = convertPrice(wallet.balance, wallet.currency);
        setWallet({
            currency: newCurrency,
            balance: convertedBalance,
        });
        },
        [convertPrice, wallet.balance, wallet.currency]
    );

    const reloadWallet = useCallback((amount) => {
            setWallet((prev) => ({
            ...prev,
            balance: prev.balance + Number(amount || 0),
        }));
    }, []);

    const buyNow = useCallback((pokemon) => {
        if (!ratesReady) {
            alert("Las tasas de cambio no están listas. Intente de nuevo en unos momentos.");
            return false;
        }

        if (purchased.some(p => p.id === pokemon.id)) {
            return false;
        }

        const convertedPrice = convertPrice(pokemon.price, pokemon.currency);

        if (wallet.balance >= convertedPrice) {
            setWallet(prev => ({
                ...prev,
                balance: prev.balance - convertedPrice
            }));

            setPurchased(prev => [...prev, { 
                ...pokemon, 
                convertedPrice 
            }]);

            if (cart.some(p => p.id === pokemon.id)) {
                setCart(prev => prev.filter(p => p.id !== pokemon.id));
            }
            
            return true;
        }
        
        return false;
    }, [purchased, wallet.balance, convertPrice, ratesReady, cart]);

    return (
        <CartContext.Provider
        value={{
            cart,
            purchased,
            wallet,
            currencies,
            addToCart,
            removeFromCart,
            confirmPurchase,
            convertPrice,
            changeWalletCurrency,
            reloadWallet,
            isClient,
            ratesReady,
            buyNow 
        }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
