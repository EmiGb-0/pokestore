import Link from "next/link";

import IndexLayout from "@/components/layouts/IndexLayout";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";

export default function Carrito() {
    const {
        cart = [],
        removeFromCart = () => {},
        confirmPurchase = () => false,
        wallet = { balance: 0, currency: "MXN" },
        changeWalletCurrency = () => {},
        reloadWallet = () => {},
        currencies = [],
        convertPrice = () => 0,
    } = useCart();

    const [selectedCurrency, setSelectedCurrency] = useState(wallet.currency || "MXN");
    const [reloadAmount, setReloadAmount] = useState(100);

    const total = useMemo(
        () => cart.reduce((sum, p) => sum + (p.convertedPrice || 0), 0),
        [cart]
    );

    const handleCurrencyChange = (e) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);
        changeWalletCurrency(newCurrency);
    };

    return (
        <IndexLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>

                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-3">Tu Monedero</h2>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                        <span className="font-bold">
                            Saldo: {(wallet.balance || 0).toFixed(2)} {wallet.currency}
                        </span>
                        
                        <div>
                            <label className="mr-2">Moneda:</label>
                            <select 
                                value={selectedCurrency}
                                onChange={handleCurrencyChange}
                                className="border rounded p-1 bg-gray-700 text-white"
                            >
                                {currencies.map(currency => (
                                    <option key={currency.money} value={currency.money}>
                                        {currency.money}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <span>Recargar:</span>
                        <select 
                            value={reloadAmount}
                            onChange={(e) => setReloadAmount(Number(e.target.value))}
                            className="border rounded p-1 bg-gray-700 text-white"
                        >
                            {[100, 500, 1000, 5000].map(amount => (
                                <option key={amount} value={amount}>
                                    +{amount} {wallet.currency}
                                </option>
                            ))}
                        </select>
                        
                        <button
                            onClick={() => reloadWallet(reloadAmount)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                            Recargar
                        </button>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl mb-4">Tu carrito está vacío</p>
                        <Link 
                            href="/" 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Volver a la tienda
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {cart.map((p) => (
                                <div key={p.id} className="flex items-center border rounded-lg p-3 bg-gray-800">
                                    <img 
                                        src={p.image} 
                                        alt={p.name} 
                                        className="w-16 h-16 object-contain mr-3"
                                    />
                                    <div className="flex-1">
                                        <h3 className="capitalize font-semibold">{p.name}</h3>
                                        <div className="flex justify-between text-sm">
                                            <span>
                                                {p.price} {p.currency}
                                            </span>
                                            <span className="font-bold">
                                                {p.convertedPrice?.toFixed(2)} {wallet.currency}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(p.id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">
                                    Total: {total.toFixed(2)} {wallet.currency}
                                </h2>
                                
                                <button
                                    onClick={() => {
                                        const success = confirmPurchase();
                                        alert(success ? "¡Compra exitosa!" : "Fondos insuficientes");
                                    }}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Confirmar Compra
                                </button>
                            </div>
                            
                            <p className="text-sm text-gray-400">
                                Saldo después de compra: {(wallet.balance - total).toFixed(2)} {wallet.currency}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </IndexLayout>
    );
}