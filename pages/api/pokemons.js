
import { fetchPokemons } from "@/lib/pokeapi";
import { getRandomPrice, getRandomCurrency } from "@/utils/currencies";

export default async function handler(req, res) {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const limitNum = Number(limit) || 20;
    const offsetNum = Number(offset) || 0;

    const pokemons = await fetchPokemons(limitNum, offsetNum);

    const getRarity = (price) => {
      if (price < 100) return "Comunes";
      if (price < 500) return "Raros";
      return "Legendarios";
    };

    const formatted = pokemons.map((p) => {
      const price = getRandomPrice();
      return {
        ...p,
        price,
        currency: getRandomCurrency().money,
        rarity: getRarity(price),
      };
    });

    res.status(200).json({ pokemons: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching pokemons" });
  }
}
