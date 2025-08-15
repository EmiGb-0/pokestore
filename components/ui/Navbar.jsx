import { useState } from "react";
import Link from "next/link";
import { IoMenu, IoClose } from "react-icons/io5";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { wallet, cart } = useCart();

    return (
        <nav className="">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    
                    <Link href="/" className="text-xl font-bold">
                        PokeStore
                    </Link>

                    <button 
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
                    </button>

                    
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex gap-4">
                            <Link href="/" className="hover:text-blue-500">
                                Inicio
                            </Link>
                            <Link href="/mis-pokemones" className="hover:text-blue-500">
                                Mis Pokemones
                            </Link>
                            <Link href="/carrito" className="hover:text-blue-500 flex items-center">
                                Carrito
                                {cart.length > 0 && (
                                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="font-medium">
                            ${wallet.balance?.toFixed(2) || '0.00'} {wallet.currency}
                        </div>
                    </div>
                </div>

                {isOpen && (
                    <div className="md:hidden mt-3 pb-3 space-y-3">
                        <Link 
                            href="/" 
                            className="block py-2 hover:text-blue-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link 
                            href="/mis-pokemones" 
                            className="block py-2 hover:text-blue-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Mis Pokemones
                        </Link>
                        <Link 
                            href="/carrito" 
                            className=" py-2 hover:text-blue-500 flex items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            Carrito
                            {cart.length > 0 && (
                                <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <div className="font-medium pt-2 border-t border-gray-100">
                            ${wallet.balance?.toFixed(2) || '0.00'} {wallet.currency}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;