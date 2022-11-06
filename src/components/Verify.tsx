import React, {FC, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack, Textarea} from "@chakra-ui/react";

import { extractMerkleProofFromPayload, extractSignatureFromPayload, extractIssuerFromPayload, MerkleProof } from "../lib/credentials";
import { useCredentials } from "../hooks/useCredentials";

export const Verify: FC = () => {
    const snarky = useSnarky();
    const credentials = useCredentials();
    const [proof, setProof] = useState<string>();
    const [payload, setPayload] = useState<string>();

    const verifyEverything = async () => {
        //require payload
        if(!payload) return
        //extract the data from the payload
        const merkleProofData: MerkleProof = extractMerkleProofFromPayload(payload);
        console.log("Merkle proof data: ", merkleProofData)
        //1. verify merkle root
        const verifyMerkleProofResult = await credentials.verifyMerkleProofAction(JSON.stringify(merkleProofData.proof), merkleProofData.merkleRoot, merkleProofData.targetHash)
        if (verifyMerkleProofResult == false) {
            console.log("Merkle proof verification failed")
        }
        //2. verify credential
        const signature: string = extractSignatureFromPayload(payload)
        const issuer: string = extractIssuerFromPayload(payload)
        const verifySignatureResult = await credentials.verifySignatureAction(merkleProofData.merkleRoot, signature, issuer)
        if(verifySignatureResult == false){
            //revert
        }

        //3. verify proof
        if(proof){
            console.log("Verifying proof...")
            snarky.verify(proof)
        }

    }

    return <Container width="100%">
        <Stack style={{ marginBottom: "2px" }}>
            <label htmlFor="proof">Proof: </label>
            <Input id="proof" onChange={(e) => setProof(e.target.value)} type="text" />
            <Input id="payload" onChange={(e) => setPayload(e.target.value)} type="text" />
            <Button onClick={() => proof && snarky.verify(proof)}>Verify proof</Button>
            <Button onClick={verifyEverything}>Verify</Button>
        </Stack>
        {/* <Textarea
            style={{ width: "20vw" }}
            value={snarky.proof?.toString() || snarky.error || ""}
            readOnly={true}
            placeholder="Proof"
        /> */}
    </Container>
}