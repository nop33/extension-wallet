import { getDefaultAlephiumWallet } from "@alephium/get-extension-wallet"

export const addToken = async (id: string): Promise<boolean> => {
  const alephium = await getDefaultAlephiumWallet()
  if (!alephium?.connectedAccount || !alephium?.connectedNetworkId) {
    throw Error("Alephium object not initialized")
  }
  return await alephium.request({
    type: "AddNewToken",
    params: {
      id: id,
      networkId: "devnet",
      symbol: "",
      decimals: 0,
      name: "",
      logoURI: "",
    },
  })
}

export const getExplorerBaseUrl = (): string | undefined => {
  return "http://localhost:23000"
}
