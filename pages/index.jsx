// pages/index.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import IndexLayout from "@/components/layouts/IndexLayout";
import PokemonCard from "@/components/ui/PokemonCard";
import { fetchPokemons, fetchStarterPokemons } from "@/lib/pokeapi";
import { getRandomCurrency, getRandomPrice } from "@/utils/currencies";


const TYPE_MAP = {
  Fuego: "fire",
  Agua: "water",
  Planta: "grass",
  Eléctrico: "electric",
  Psíquico: "psychic",
  Fantasma: "ghost",
  Dragón: "dragon",
};

const TYPE_OPTIONS = Object.keys(TYPE_MAP);
const RARITY_OPTIONS = ["Comunes", "Raros", "Legendarios"];


const getRarityFromPrice = (price) => {
  if (price < 100) return "Comunes";
  if (price < 500) return "Raros";
  return "Legendarios";
};

export default function Home({ pokemons: initialPokemons, wallet, starterPokemons }) {

  const [pokemons, setPokemons] = useState(initialPokemons || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [offset, setOffset] = useState(initialPokemons?.length || 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 180);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredPokemons = useMemo(() => {
    const search = debouncedSearch.toLowerCase();

    return pokemons.filter((p) => {
    
      const matchesName = p.name.toLowerCase().includes(search);

      const matchesType = selectedType
        ? p.types && p.types.includes(TYPE_MAP[selectedType])
        : true;

      const matchesRarity = selectedRarity
        ? (p.rarity ?? getRarityFromPrice(Number(p.price || 0))) === selectedRarity
        : true;

      return matchesName && matchesType && matchesRarity;
    });
  }, [pokemons, debouncedSearch, selectedType, selectedRarity]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/pokemons?limit=${PAGE_SIZE}&offset=${offset}`);
      const { pokemons: newPokemons } = await res.json();

      if (!newPokemons || newPokemons.length === 0) {
        setHasMore(false);
      } else {
        setPokemons((prev) => [...prev, ...newPokemons]);
        setOffset((prev) => prev + newPokemons.length);
        if (newPokemons.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (err) {
      console.error("Error cargando más pokemons:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [offset, loadingMore, hasMore]);

  return (
    <IndexLayout
      walletBalance={wallet.balance}
      walletCurrency={wallet.currency}
      starterPokemons={starterPokemons}
    >
      <main className="container mx-auto py-6 px-5 md:px-0">
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <input
            aria-label="Buscar pokemon por nombre"
            type="text"
            placeholder="Buscar pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 flex-1 bg-gray-800"
          />

          <select
            aria-label="Filtrar por tipo"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded p-2 bg-gray-800"
          >
            <option value="">Todos los tipos</option>
            {TYPE_OPTIONS.map((t) => (
              <option className="bg-gray-800" key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por rareza"
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="border rounded p-2 bg-gray-800"
          >
            <option value="">Todas las rarezas</option>
            {RARITY_OPTIONS.map((r) => (
              <option className="bg-gray-800" key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {filteredPokemons.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {debouncedSearch || selectedType || selectedRarity ? (
              <>
                <p className="mb-2">No se encontraron pokemons que coincidan.</p>
                <p className="text-sm">Intenta cambiar los filtros o borrar la búsqueda.</p>
              </>
            ) : (
              <p className="mb-2">No hay pokemons disponibles en este momento.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredPokemons.map((pokemon) => (
                <PokemonCard
                  key={`${pokemon.id}-${pokemon.name}-${pokemon.price}`}
                  id={pokemon.id}
                  name={pokemon.name}
                  image={pokemon.image}
                  price={pokemon.price}
                  currency={pokemon.currency}
                  color={pokemon.color}
                />
              ))}
            </div>

            <div className="text-center mt-6">
              {hasMore ? (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loadingMore ? "Cargando..." : "Cargar más"}
                </button>
              ) : (
                <p className="text-sm text-gray-400">No hay más pokemons para cargar.</p>
              )}
            </div>
          </>
        )}
      </main>
    </IndexLayout>
  );
}

export async function getServerSideProps() {
  const pokeLimit = 20;
  const pokemonsRes = await fetchPokemons(pokeLimit, 0);
  const starterPokemonsRes = await fetchStarterPokemons();

  const pokemons = pokemonsRes.map((p) => {
    const price = getRandomPrice();
    return {
      ...p,
      price,
      currency: getRandomCurrency().money,
      rarity: getRarityFromPrice(price),
    };
  });

  const starterPokemons = starterPokemonsRes.map((p) => ({
    ...p,
    price: getRandomPrice(),
    currency: getRandomCurrency().money,
    rarity: getRarityFromPrice(getRandomPrice()),
  }));

  const wallet = {
    balance: Number((Math.random() * (5000 - 1000) + 1000).toFixed(2)),
    currency: "MXN",
  };

  return { props: { pokemons, wallet, starterPokemons } };
}
