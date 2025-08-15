

async function fetchPokemonDetails(nameOrUrl) {
    const resPokemon = await fetch(
        nameOrUrl.startsWith('http') ? nameOrUrl : `https://pokeapi.co/api/v2/pokemon/${nameOrUrl}`
    );
    const dataPokemon = await resPokemon.json();

    const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dataPokemon.id}`);
    const dataSpecies = await resSpecies.json();

    return {
        id: dataPokemon.id,
        name: dataPokemon.name,
        image: dataPokemon.sprites.other["official-artwork"].front_default,
        color: dataSpecies.color.name, 
        types: (dataPokemon.types || []).map((t) => t.type.name),
    };
}

export async function fetchPokemons(limit = 20, offset = 0) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    const detailedPokemons = await Promise.all(
        data.results.map((pokemon) => fetchPokemonDetails(pokemon.url))
    );

    return detailedPokemons;
}

export async function fetchStarterPokemons() {
    const starters = ["bulbasaur", "charmander", "squirtle", "pikachu"];

    const detailedPokemons = await Promise.all(
        starters.map((name) => fetchPokemonDetails(name))
    );

    return detailedPokemons;
}
