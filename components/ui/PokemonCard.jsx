import Image from "next/image"
import Link from "next/link"
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

const PokemonCard = ({ id, name, image, price, currency, color }) => {
    const { addToCart, purchased, cart } = useCart();
    const isPurchased = purchased.some(p => p.id === id);
    const isInCart = cart.some(p => p.id === id);

    return (
        <div 
            className="relative rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition overflow-hidden group"
            style={{ "--bg-color": color }}
        >
            <div 
                className="absolute inset-0 brightness-[25%] group-hover:brightness-50 transition duration-300"
                style={{ 
                    backgroundColor: `var(--bg-color)`,
                    zIndex: -1,
                }}
            />
            
            {isPurchased && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    Comprado
                </div>
            )}
            
            <img src={image} alt={name} className="w-32 h-32 object-contain" />
            <h3 className="capitalize font-bold text-lg mt-2 text-white">{name}</h3>
            <p className="text-white">{price} {currency}</p>
            <div className="mt-2 flex gap-2">
                {!isPurchased ? (
                    <>
                        <button 
                            onClick={() => addToCart({ id, name, image, price, currency, color })}
                            disabled={isInCart}
                            className={`${isInCart 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded`}
                            title={isInCart ? "Ya en el carrito" : "Agregar al carrito"}
                        >
                            <FaShoppingCart />
                        </button>
                        <Link 
                            href={`/pokemon/${name}`} 
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                        >
                            Comprar
                        </Link>
                    </>
                ) : (
                    <span className="bg-gray-500 text-white px-4 py-2 rounded text-sm">
                        No disponible
                    </span>
                )}
            </div>
        </div>
    );
}

export default PokemonCard;