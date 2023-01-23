import { Abi, Contract, ProviderInterface, number, stark } from "starknet"

import ArgentCompiledContractAbi from "../../../abis/ArgentAccount.json"
import ProxyCompiledContractAbi from "../../../abis/Proxy.json"
import { Network, getNetwork, getProvider } from "../../../shared/network"
import {
  ArgentAccountType,
  BaseWalletAccount,
  WalletAccount,
  WalletAccountSigner,
} from "../../../shared/wallet.model"
import { getAccountIdentifier } from "../../../shared/wallet.service"
import { createNewAccount } from "../../services/backgroundAccounts"

export interface AccountConstructorProps {
  address: string
  publicKey: string
  networkId: string
  signer: WalletAccountSigner
  type: ArgentAccountType
  deployTransaction?: string
  hidden?: boolean
  needsDeploy?: boolean
}

export class Account {
  address: string
  publicKey: string
  networkId: string
  signer: WalletAccountSigner
  type: ArgentAccountType
  hidden?: boolean

  get networkName(): string {
    return this.networkId
  }

  constructor({
    address,
    publicKey,
    networkId,
    signer,
    type,
    hidden,
  }: AccountConstructorProps) {
    this.address = address
    this.networkId = networkId
    this.publicKey = publicKey
    this.signer = signer
    this.hidden = hidden
    this.type = type
  }

  public static async create(networkId: string): Promise<Account> {
    const result = await createNewAccount(networkId)
    if (result === "error") {
      throw new Error(result)
    }

    return new Account({
      address: result.account.address,
      publicKey: result.account.signer.publicKey,
      networkId: networkId,
      signer: result.account.signer,
      type: result.account.type,
    })
  }

  public toWalletAccount(): WalletAccount {
    const { address, networkId, signer, type } = this
    return {
      address,
      networkId,
      signer,
      type,
    }
  }

  public toBaseWalletAccount(): BaseWalletAccount {
    const { address, networkId } = this
    return {
      networkId,
      address,
    }
  }
}
