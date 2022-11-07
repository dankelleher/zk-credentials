import React, {FC, useCallback, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack, Textarea} from "@chakra-ui/react";
import {useCredentialProof} from "../context/CredentialProof";
import {Proof} from "../types/Proof";

const dummyProof: Proof = require('../dummyProof.json');

export const ZKProof: FC = () => {
    const snarky = useSnarky();
    const { set } = useCredentialProof();
    const [dobLeaf, setDOBLeaf] = useState<string>();
    const [proof, setProof] = useState<string>();

    const prove = useCallback(async () => {
        if (!snarky || !dobLeaf) return;
        await snarky.prove(dobLeaf);

        setProof(snarky.proof?.toString() || snarky.error || "");

        set('zkProof', snarky.proof?.toString());
    }, [snarky, dobLeaf, set]);

    const useDummy = useCallback(() => {
        setProof(dummyProof.proof);
        set('zkProof', dummyProof.proof);
    }, [set]);

    return <Container width="100%">
        <Stack style={{ marginBottom: "2px" }}>
            <label htmlFor="dobLeaf">DOB Claim: </label>
            <Input id="dobLeaf" onChange={(e) => setDOBLeaf(e.target.value)} type="text" placeholder="urn:dateOfBirth.day:...:1|urn:dateOfBirth.month:...:1|urn:dateOfBirth.year:...:1990|"/>
            <Button onClick={snarky.compile}>Compile</Button>
            <Button onClick={prove}>Prove</Button>
            <Button onClick={useDummy}>Use Dummy Proof</Button>
        </Stack>
        <Textarea
            style={{ width: "20vw" }}
            value={proof || snarky.error || ""}
            readOnly={true}
            placeholder="Proof"
        />
    </Container>
}