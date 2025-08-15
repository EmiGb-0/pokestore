export const currencies = [
  { money: 'MXN', name: 'Pesos Mexicanos' },
  { money: 'USD', name: 'Dólares Americanos' },
  { money: 'EUR', name: 'Euros' },
  { money: 'JPY', name: 'Yen Japonés' },
  { money: 'GBP', name: 'Libra Esterlina' },
];

export function getRandomCurrency() {
  return currencies[Math.floor(Math.random() * currencies.length)];
}

export function getRandomPrice() {
  return (Math.random() * 1000 + 50).toFixed(2); 
}
