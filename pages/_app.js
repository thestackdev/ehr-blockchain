import { TransactionsProvider } from "../context/Entherum.js";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <TransactionsProvider>
      <Component {...pageProps} />
    </TransactionsProvider>
  );
}
