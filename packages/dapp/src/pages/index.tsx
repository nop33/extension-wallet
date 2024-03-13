import { WalletConnectProvider } from "@alephium/walletconnect-provider"
import { useWallet } from "@alephium/web3-react"
import type { NextPage } from "next"
import Head from "next/head"
import { useState } from "react"

import { TokenDapp } from "../components/TokenDapp"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  const wallet = useWallet()
  const [address, setAddress] = useState<string>()
  const [network, setNetwork] = useState<string | undefined>(undefined)
  const [isConnected, setConnected] = useState(false)

  const connect = async () => {
    const wcProvider = await WalletConnectProvider.init({
      projectId: "6e2562e43678dd68a9070a62b6d52207",
      networkId: "testnet",
      onDisconnected: () => Promise.resolve(),
    })

    wcProvider.on("displayUri", (uri) => console.log(uri))

    await wcProvider.connect()

    if (wcProvider.account)
      wcProvider.signMessage({
        signerAddress: wcProvider.account.address,
        message: "Hello there!",
        messageHasher: "alephium",
      })

    return wcProvider.account || undefined
  }

  const handleWCButtonClick = async () => {
    const result = await connect()
    console.log("result", result)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Alephium Test dApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={handleWCButtonClick}>Connect manually wc</button>

      <main className={styles.main}>
        {wallet.connectionStatus === "connected" ? (
          <>
            <h3 style={{ margin: 0 }}>
              Wallet address: <code>{wallet.account.address}</code>
            </h3>
            <h3 style={{ margin: 0 }}>
              Network: <code>{wallet.account.network}</code>
            </h3>
            {wallet.account.address && (
              <TokenDapp address={wallet.account.address} />
            )}
          </>
        ) : (
          <>
            <p>First connect wallet to use dapp.</p>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
