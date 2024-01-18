import "../styles/globals.css"

import {
  AlephiumConnectButton,
  AlephiumWalletProvider,
} from "@alephium/web3-react"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlephiumWalletProvider network="testnet">
      <Component {...pageProps} />
      <AlephiumConnectButton />
    </AlephiumWalletProvider>
  )
}

export default MyApp
