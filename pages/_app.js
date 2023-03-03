import { TransactionsProvider } from "../context/Entherum.js";

export default function App({ Component, pageProps }) {
  return (
    <TransactionsProvider>
      <Component {...pageProps} />
    </TransactionsProvider>
  );
}
