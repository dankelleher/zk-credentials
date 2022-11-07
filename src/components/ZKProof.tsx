import React, {FC, useCallback, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack, Textarea} from "@chakra-ui/react";
import {useCredentialProof} from "../context/CredentialProof";
import {ZKProof as ZKProofType} from "../types/ZKProof";

const dummyProof: ZKProofType = require('../dummyProof.json');

export const ZKProof: FC = () => {
    const snarky = useSnarky();
    const { set } = useCredentialProof();
    const [dobLeaf, setDOBLeaf] = useState<string>();
    const [proof, setProof] = useState<ZKProofType>();

    const prove = useCallback(async () => {
        if (!snarky || !dobLeaf) return;
        await snarky.prove(dobLeaf);

        setProof(snarky.proof);

        set('zkProof', snarky.proof);
    }, [snarky, dobLeaf, set]);

    const useDummy = useCallback(() => {
        setProof(dummyProof);
        set('zkProof', dummyProof);
    }, [set]);

    return <Container width="100%">
        <Stack style={{ marginBottom: "2px" }}>
            <label htmlFor="dobLeaf">DOB Claim: </label>
            <Input id="dobLeaf" onChange={(e) => setDOBLeaf(e.target.value)} type="text" placeholder="urn:dateOfBirth.day:...:1|urn:dateOfBirth.month:...:1|urn:dateOfBirth.year:...:1990|"/>
            <Button onClick={snarky.compile} disabled={snarky.status !== 'uninitialised'}>Prepare Prover</Button>
            <Button onClick={prove} disabled={snarky.status !== 'ready' && snarky.status !== 'error'}>Prove</Button>
            <Button onClick={useDummy}>Use Dummy Proof</Button>
            <Input id="dobLeaf" readOnly={true} type="text" value={snarky.status || ''} placeholder="ZK Prover Status"/>
        </Stack>
        <Textarea
            style={{ width: "20vw" }}
            value={JSON.stringify(proof, null, 2) || ""}
            readOnly={true}
            placeholder="Proof"
        />
    </Container>
}