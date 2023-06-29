import { H5, icons } from "@argent/ui"
import { Flex, Text } from "@chakra-ui/react"
import { FC } from "react"
const { NftIcon } = icons

const EmptyCollections: FC<{ networkId: string }> = () => (
  <Flex
    direction="column"
    flex={1}
    textAlign="center"
    justifyContent="center"
    m={0}
  >
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      flex={1}
    >
      <Flex
        bg="black"
        w="80px"
        h="80px"
        mb="4"
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
      >
        <Text fontSize="4xl">
          <NftIcon />
        </Text>
      </Flex>
      <H5 color="neutrals.400">No NFTs</H5>
    </Flex>
  </Flex>
)

export { EmptyCollections }
