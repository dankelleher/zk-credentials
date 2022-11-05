import {FC, useCallback, useState} from "react";
import {useCredentials} from "../hooks/useCredentials";
import {extractMerkleProofFromCredential, getClaim, getSignature, MerkleProof} from "../lib/credentials";
import {VerifiableCredential} from "../types/VerifiableCredential";
import { CivicOrangeButton } from "./CivicOrangeButton";
import {
    Box, Button,
    Container,
    FormControl,
    FormLabel, HStack, Input,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Textarea,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {useCredentialProof} from "../context/CredentialProof";

const claimIdentifier = 'claim-cvc:Document.dateOfBirth-v1';

const dummyCredential: VerifiableCredential = require('../dummyCredential.json');

export const Credential: FC = () => {
    const credentials = useCredentials();
    const { set } = useCredentialProof();
    const [merkleProof, setMerkleProof] = useState<MerkleProof>();
    const [claimValue, setClaimValue] = useState<string>();
    const [credentialString, setCredentialString] = useState<string>();

    const selectCredential = useCallback(async (credential: VerifiableCredential) => {
        const merkle = extractMerkleProofFromCredential(credential, claimIdentifier);
        const claim = getClaim(credential, claimIdentifier);
        const signature = getSignature(credential, claimIdentifier);
        console.log("Signature... ", signature)

        setMerkleProof(merkle);
        setClaimValue(claim.value);

        set('merkleProof', merkle);
        set('issuer', credential.issuer);
        set('signature', JSON.stringify(signature));
    }, [set]);

    const store = useCallback(() => {
        if (credentialString) {
            credentials.addCredential(JSON.parse(credentialString));
            credentials.saveCredentials();
            setCredentialString('');
        }
    }, [credentials, credentialString]);

    const getDummyCredential = useCallback(() => {
        setCredentialString(JSON.stringify(dummyCredential, null, 2));
    }, [setCredentialString]);

    const clearCredentials = useCallback(() => {
        setCredentialString('');
        credentials.clearCredentials();
    }, [credentials]);

    return (
        <Container width="100%">
            <Stack>
                <FormControl>
                    <FormLabel>Credential</FormLabel>
                    <Textarea id="credential" placeholder="Credential" onChange={e => setCredentialString(e.target.value)} value={credentialString}/>
                </FormControl>
                <CivicOrangeButton onClick={store} text={"Store a credential"} />
                <Button onClick={getDummyCredential}>Get Dummy Credential</Button>
                <Button onClick={clearCredentials}>Clear</Button>
                <TableContainer>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Subject</Th>
                                <Th>Issuer</Th>
                                <Th>Issued</Th>
                                <Th>Type</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {credentials.credentials.map((credential, index) => (
                                <Tr key={index}>
                                    <Td fontSize={'xs'}><Button onClick={() => selectCredential(credential)}>Use</Button></Td>
                                    <Td fontSize={'xs'}>{credential.credentialSubject.id}</Td>
                                    <Td fontSize={'xs'}>{credential.issuer}</Td>
                                    <Td fontSize={'xs'}>{credential.issuanceDate}</Td>
                                    <Td fontSize={'xs'}>{credential.type}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <HStack>
                    <FormLabel>Claim</FormLabel>
                    <Input value={claimValue}/>
                </HStack>
                <HStack>
                    <FormLabel>Merkle Proof</FormLabel>
                    <Textarea value={JSON.stringify(merkleProof, null, 2)}/>
                </HStack>
            </Stack>
        </Container>
    )
}