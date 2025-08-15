import { CartProvider } from "@/context/CartContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider
      walletCurrency={pageProps.wallet?.currency || 'MXN'}
      walletBalance={pageProps.wallet?.balance || 1000}
    >
      <Component {...pageProps} />
    </CartProvider>
  )
}