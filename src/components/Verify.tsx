import React, {FC, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack} from "@chakra-ui/react";

import { useCredentials } from "../hooks/useCredentials";
import { CredentialProof } from "../types/CredentialProof";

export const Verify: FC = () => {
    const snarky = useSnarky();
    const credentials = useCredentials();
    const [payload, setPayload] = useState<CredentialProof>();

    const verifyEverything = async () => {
        //require a complete payload (TODO clean up later and use the type system to enforce this)
        if (!payload || !payload.issuer || !payload.merkleProof || !payload.zkProof || !payload.signature || !payload.issuer) return

        console.log("Merkle proof data: ", payload.merkleProof)

        //1. verify merkle root
        credentials.verifyMerkleProofAction(payload.merkleProof)

        //2. verify credential
        credentials.verifySignatureAction(payload.merkleProof.merkleRoot, payload.signature, payload.issuer)

        //3. verify proof
            console.log("Verifying proof...")
            snarky.verify(payload.zkProof)
    }

    return <Container width="100%">
        <Stack style={{ marginBottom: "2px" }}>
            <label htmlFor="proof">Proof: </label>
            <Input id="payload" onChange={(e) => setPayload(JSON.parse(e.target.value))} type="text" />
            <Button onClick={verifyEverything}>Verify</Button>
        </Stack>
    </Container>
}