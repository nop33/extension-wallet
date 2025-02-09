import { lowerCase, upperFirst } from "lodash-es"
import { Call } from "starknet"
import { ReviewTransactionResult } from "./actionQueue/types"

import { WalletAccount } from "./wallet.model"
import { AlephiumExplorerTransaction } from "./explorer/type"

export type Status = 'NOT_RECEIVED' | 'RECEIVED' | 'PENDING' | 'ACCEPTED_ON_MEMPOOL' | 'ACCEPTED_ON_L2' | 'ACCEPTED_ON_CHAIN' | 'REJECTED' | 'REMOVED_FROM_MEMPOOL';

// Global Constants for Transactions
export const SUCCESS_STATUSES: Status[] = [
  "ACCEPTED_ON_MEMPOOL",
  "ACCEPTED_ON_CHAIN",
  "ACCEPTED_ON_L2",
  "PENDING",
]

export const TRANSACTION_STATUSES_TO_TRACK: Status[] = [
  "RECEIVED",
  "ACCEPTED_ON_MEMPOOL",
  "NOT_RECEIVED",
]

export interface TransactionMeta {
  title?: string
  subTitle?: string
  transactions?: Call | Call[] // TODO: remove this
  type?: string // TODO: in future can be DECLARE | DEPLOY | CALL
  request?: ReviewTransactionResult
  explorer?: AlephiumExplorerTransaction
}

export interface TransactionBase {
  hash: string
  account: {
    networkId: string
  }
}

export interface TransactionRequest extends TransactionBase {
  account: WalletAccount
  meta?: TransactionMeta
}

export interface Transaction extends TransactionRequest {
  status: Status
  failureReason?: { code: string; error_message: string }
  timestamp: number
}

export const compareTransactions = (
  a: TransactionBase,
  b: TransactionBase,
): boolean => a.hash === b.hash && a.account.networkId === a.account.networkId

export function entryPointToHumanReadable(entryPoint: string): string {
  try {
    return upperFirst(lowerCase(entryPoint))
  } catch {
    return entryPoint
  }
}

export const getInFlightTransactions = (
  transactions: Transaction[],
): Transaction[] =>
  transactions.filter(
    ({ status, meta }) =>
      TRANSACTION_STATUSES_TO_TRACK.includes(status)
  )

export function nameTransaction(calls: Call | Call[]) {
  const callsArray = Array.isArray(calls) ? calls : [calls]
  const entrypointNames = callsArray.map((call) => call.entrypoint)
  return transactionNamesToTitle(entrypointNames)
}

export function transactionNamesToTitle(
  names: string | string[],
): string | undefined {
  if (!Array.isArray(names)) {
    names = [names]
  }
  const entrypointNames = names.map((name) => lowerCase(name))
  const lastName = entrypointNames.pop()
  const title = entrypointNames.length
    ? `${entrypointNames.join(", ")} and ${lastName}`
    : lastName
  return upperFirst(title)
}

// ===== ALPH ======

