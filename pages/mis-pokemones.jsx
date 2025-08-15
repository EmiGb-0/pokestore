// pages/mis-pokemones.jsx
import IndexLayout from '@/components/layouts/IndexLayout'
import PokemonCard from '@/components/ui/PokemonCard'
import { useCart } from '@/context/CartContext'

export default function MisPokemones() {
    const { purchased } = useCart()

    return (
        <IndexLayout>
            <main className="container mx-auto py-6 px-5 md:px-0">
                <h1 className="text-2xl font-bold mb-6">Mis Pokémones Comprados</h1>
                
                {purchased.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="mb-2">Aún no has comprado ningún Pokémon.</p>
                        <p className="text-sm">Visita la tienda para hacer tu primera compra.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {purchased.map((pokemon) => (
                            <PokemonCard
                                key={`${pokemon.id}-${pokemon.name}`}
                                id={pokemon.id}
                                name={pokemon.name}
                                image={pokemon.image}
                                price={pokemon.price}
                                currency={pokemon.currency}
                                color={pokemon.color}
                            />
                        ))}
                    </div>
                )}
            </main>
        </IndexLayout>
    )
}