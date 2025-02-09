import { SignMessageParams } from "@alephium/web3"
import { P4, H5, H6, H2 } from "@argent/ui"
import { FC } from "react"
import styled from "styled-components"

import { usePageTracking } from "../../services/analytics"
import { P } from "../../theme/Typography"
import {
  ConfirmPageProps,
  DeprecatedConfirmScreen,
} from "./DeprecatedConfirmScreen"
import { Field, FieldGroup, FieldKey, FieldValue, SectionHeader } from "../../components/Fields"
import { AccountAddressField } from "./transaction/fields/AccountAddressField"
import { Box, Flex } from "@chakra-ui/react"
import { ConfirmScreen } from "./ConfirmScreen"

interface ApproveSignatureScreenProps
  extends Omit<ConfirmPageProps, "onSubmit"> {
  dataToSign: SignMessageParams & { host: string }
  onSubmit: (data: SignMessageParams) => void
}

export const Pre = styled.pre`
  margin-top: 24px;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.15);
  max-width: calc(100vw - 64px);
  overflow: auto;
`

export const Message = styled(Field)`
  padding: 0px 0px;
  color: ${({ theme }) => theme.text2};
`

export const ApproveSignatureScreen: FC<ApproveSignatureScreenProps> = ({
  dataToSign,
  onSubmit,
  selectedAccount,
  ...props
}) => {
  usePageTracking("signMessage")

  return (
    <ConfirmScreen
      confirmButtonText="Sign"
      confirmButtonBackgroundColor="neutrals.800"
      rejectButtonText="Cancel"
      showHeader={false}
      scrollable={false}
      selectedAccount={selectedAccount}
      onSubmit={() => {
        onSubmit(dataToSign)
      }}
      {...props}
    >
      {
        dataToSign.host &&
        <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mb="6"
        mt="3"
        gap="6"
        >
          <H2>Sign Message</H2>
          <H6>{dataToSign.host}</H6>
        </Flex>
      }
      { selectedAccount &&
        <FieldGroup>
          <AccountAddressField
            title="Signer"
            accountAddress={selectedAccount.address}
            networkId={selectedAccount.networkId}
          />
          <Field>
            <FieldKey>Hasher</FieldKey>
            <FieldValue>{dataToSign.messageHasher}</FieldValue>
          </Field>
          <SectionHeader>{dataToSign.message}</SectionHeader>
          <Field>
            <FieldKey>Network</FieldKey>
            <FieldValue>{selectedAccount.networkName}</FieldValue>
          </Field>
        </FieldGroup>
      }
      <Box w="full" h={20} />
    </ConfirmScreen>
  )
}
