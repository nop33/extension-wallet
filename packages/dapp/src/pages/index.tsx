import { useWallet } from "@alephium/web3-react"
import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"

import { TokenDapp } from "../components/TokenDapp"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  const wallet = useWallet()
  const [address, setAddress] = useState<string>()
  const [network, setNetwork] = useState<string | undefined>(undefined)
  const [isConnected, setConnected] = useState(false)

  return (
    <div className={styles.container}>
      <Head>
        <title>Alephium Test dApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
