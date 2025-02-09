import {
  BarBackButton,
  ButtonCell,
  CellStack,
  NavigationContainer,
  SpacerCell,
  icons,
  BarCloseButton,
} from "@argent/ui"
import { Center, Flex, Image } from "@chakra-ui/react"
import { nip19 } from "nostr-tools"
import { FC, useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { settingsStore } from "../../../shared/settings"
import { useKeyValueStorage } from "../../../shared/storage/hooks"
import { AddressCopyButton } from "../../components/AddressCopyButton"
import { routes, useReturnTo } from "../../routes"
import { upgradeAccount } from "../../services/backgroundAccounts"
import {
  openBlockExplorerAddress,
  useBlockExplorerTitle,
} from "../../services/blockExplorer.service"
import { Account } from "../accounts/Account"
import {
  getAccountName,
  useAccountMetadata,
} from "../accounts/accountMetadata.state"
import { getNetworkAccountImageUrl } from "../accounts/accounts.service"
import { useAccount } from "../accounts/accounts.state"
import { useCurrentNetwork } from "../networks/useNetworks"
import { AccountEditName } from "./AccountEditName"
import { Button, CopyTooltip } from "@argent/ui"

const { ExpandIcon, HideIcon, PluginIcon, AlertIcon, CopyIcon } = icons

export const AccountEditScreen: FC = () => {
  const currentNetwork = useCurrentNetwork()
  const { accountAddress = "" } = useParams<{ accountAddress: string }>()
  const navigate = useNavigate()
  const returnTo = useReturnTo()
  const { accountNames, setAccountName } = useAccountMetadata()
  const account = useAccount({
    address: accountAddress,
    networkId: currentNetwork.id,
  })
  const accountName = account
    ? getAccountName(account, accountNames)
    : "Not found"
  const blockExplorerTitle = useBlockExplorerTitle()

  const [liveEditingAccountName, setLiveEditingAccountName] =
    useState(accountName)

  const onClose = useCallback(() => {
    if (returnTo) {
      navigate(returnTo)
    } else {
      navigate(-1)
    }
  }, [navigate, returnTo])

  const experimentalPluginAccount = useKeyValueStorage(
    settingsStore,
    "experimentalPluginAccount",
  )

  const showDelete =
    account && (account.networkId === "devnet")

  const handleHideOrDeleteAccount = async (account: Account) => {
    if (showDelete) {
      navigate(routes.accountDeleteConfirm(account.address))
    } else {
      navigate(routes.accountHideConfirm(account.address))
    }
  }

  const onChangeName = useCallback((name: string) => {
    setLiveEditingAccountName(name)
  }, [])

  const onSubmitChangeName = useCallback(() => {
    account &&
      setAccountName(account.networkId, account.address, liveEditingAccountName)
  }, [account, liveEditingAccountName, setAccountName])

  const onCancelChangeName = useCallback(() => {
    setLiveEditingAccountName(accountName)
  }, [accountName])

  return (
    <>
      <NavigationContainer
        leftButton={<BarBackButton onClick={onClose} />}
        rightButton={<BarCloseButton onClick={() => navigate(routes.accountTokens())}></BarCloseButton>}
        title={liveEditingAccountName}
      >
        <Center p={4}>
          <Image
            borderRadius={"full"}
            width={20}
            height={20}
            src={getNetworkAccountImageUrl({
              accountName: liveEditingAccountName,
              accountAddress,
              networkId: currentNetwork.id,
              backgroundColor: account?.hidden ? "333332" : undefined,
            })}
          />
        </Center>
        <CellStack>
          <Flex direction={"column"}>
            <AccountEditName
              value={liveEditingAccountName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChangeName(e.target.value)
              }
              onSubmit={onSubmitChangeName}
              onCancel={onCancelChangeName}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
            />
            <Center
              border={"1px solid"}
              borderColor={"border"}
              borderTop={"none"}
              borderBottomLeftRadius="lg"
              borderBottomRightRadius="lg"
              p={2}
            >
              <AddressCopyButton address={accountAddress} />
            </Center>
            { account !== undefined &&
              <Center
                border={"1px solid"}
                borderColor={"border"}
                borderTop={"none"}
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
                p={2}
              >
                <PublicKeyCopyButton publicKey={account.publicKey}/>
              </Center>
            }
            { account !== undefined && account.signer.keyType === "bip340-schnorr" &&
              <Center
                border={"1px solid"}
                borderColor={"border"}
                borderTop={"none"}
                borderBottomLeftRadius="lg"
                borderBottomRightRadius="lg"
                p={2}
              >
                <AddressCopyButton address={nip19.npubEncode(account?.publicKey)} type="nostr public key" title="Nostr" />
              </Center>
            }
          </Flex>
          <SpacerCell />
          <ButtonCell
            onClick={() =>
              account &&
              openBlockExplorerAddress(currentNetwork, account.address)
            }
            rightIcon={<ExpandIcon />}
          >
            View on explorer
          </ButtonCell>
          <ButtonCell
            onClick={() => account && handleHideOrDeleteAccount(account)}
            icon={<HideIcon />}
          >
            {showDelete ? "Delete" : "Hide"} account
          </ButtonCell>
          <ButtonCell
            color={"error.500"}
            onClick={() => navigate(routes.exportPrivateKey())}
            icon={<AlertIcon />}
          >
            Export private key
          </ButtonCell>
        </CellStack>
      </NavigationContainer>
    </>
  )
}

const PublicKeyCopyButton: FC<{ publicKey: string }> = ({ publicKey }) => {
  return (
    <CopyTooltip prompt={'Click to copy public key'} copyValue={publicKey}>
      <Button
        size="3xs"
        color={"white50"}
        bg={"transparent"}
        _hover={{ bg: "neutrals.700", color: "text" }}
      >
        {`Public Key: ${shortPublicKey(publicKey)}`}
      </Button>
    </CopyTooltip>
  )
}

const shortPublicKey = (publicKey: string) => {
  const start = publicKey.slice(0, 6)
  const end = publicKey.slice(-6)
  return `${start}...${end}`
}