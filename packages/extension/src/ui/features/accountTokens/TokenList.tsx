import { FC, Suspense } from "react"
import { useNavigate } from "react-router-dom"

import { Token, TokenWithBalance } from "../../../shared/token/type"
import { ErrorBoundary } from "../../components/ErrorBoundary"
import ErrorBoundaryFallbackWithCopyError from "../../components/ErrorBoundaryFallbackWithCopyError"
import { routes } from "../../routes"
import { useSelectedAccount } from "../accounts/accounts.state"
import { NewTokenButton } from "./NewTokenButton"
import { TokenListItemVariant } from "./TokenListItem"
import { TokenListItemContainer } from "./TokenListItemContainer"
import { useFungibleTokensWithBalance } from "./tokens.state"

interface TokenListProps {
  tokenList?: Token[]
  showNewTokenButton?: boolean
  showTokenSymbol?: boolean
  variant?: TokenListItemVariant
  navigateToSend?: boolean
}

export const TokenList: FC<TokenListProps> = ({
  tokenList,
  showNewTokenButton = true,
  showTokenSymbol = false,
  variant,
  navigateToSend = true,
}) => {
  const navigate = useNavigate()
  const account = useSelectedAccount()
  const tokensForAccount = useFungibleTokensWithBalance(account)
  if (!account) {
    return null
  }

  const tokens: TokenWithBalance[] | undefined = tokenList || tokensForAccount.tokenDetails
  tokens.forEach(token => {
    token.balance = tokensForAccount.tokenDetails.find(td => td.id === token.id)?.balance
  })

  return (
    <ErrorBoundary
      fallback={
        <ErrorBoundaryFallbackWithCopyError
          message={"Sorry, an error occurred fetching tokens"}
        />
      }
    >
      <Suspense fallback={<NewTokenButton isLoading />}>
        {tokens.map((token) => (
          <TokenListItemContainer
            key={token.id}
            account={account}
            tokenWithBalance={token}
            variant={variant}
            showTokenSymbol={showTokenSymbol}
            onClick={() => {
              // navigate(
              //   navigateToSend
              //     ? routes.sendToken(token.id)
              //     : routes.token(token.id),
              // )
              navigate(routes.sendToken(token.id))
            }}
          />
        ))}
        {showNewTokenButton && <NewTokenButton />}
      </Suspense>
    </ErrorBoundary>
  )
}
