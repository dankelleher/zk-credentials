import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Tabs, TabPanel, TabPanels, Tab, TabList, Container, Center,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import {ZKProof} from "./components/ZKProof";
import {Credential} from "./components/Credential";
import {CredentialProofProvider} from "./context/CredentialProof";
import {Payload} from "./components/Payload";

export const App = () => (
    <ChakraProvider theme={theme}>
      <CredentialProofProvider>
        <Center>
          <Box textAlign="center" fontSize="xl" width="80vw">
            <Grid minH="100vh" p={3}>
              <ColorModeSwitcher justifySelf="flex-end" />
              <VStack spacing={8}>
                <Logo h="5vmin" pointerEvents="none" />
                <Tabs>
                  <TabList>
                    <Tab>Credential</Tab>
                    <Tab>ZK Proof</Tab>
                    <Tab>Payload</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel><Credential /></TabPanel>
                    <TabPanel><ZKProof /></TabPanel>
                    <TabPanel><Payload /></TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </Grid>
          </Box>
        </Center>
      </CredentialProofProvider>
    </ChakraProvider>
)
export default App;
