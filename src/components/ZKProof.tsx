import React, {FC, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack, Textarea} from "@chakra-ui/react";

export const ZKProof: FC = () => {
    const snarky = useSnarky();
    const [dobLeaf, setDOBLeaf] = useState<string>();

    return <Container width="100%">
        <Stack style={{ marginBottom: "2px" }}>
            <label htmlFor="dobLeaf">DOB Claim: </label>
            <Input id="dobLeaf" onChange={(e) => setDOBLeaf(e.target.value)} type="text" placeholder="urn:dateOfBirth.day:...:1|urn:dateOfBirth.month:...:1|urn:dateOfBirth.year:...:1990|"/>
            <Button onClick={snarky.compile}>Compile</Button>
            <Button onClick={() => dobLeaf && snarky.prove(dobLeaf)}>Prove</Button>
        </Stack>
        <Textarea
            style={{ width: "20vw" }}
            value={snarky.proof?.toString() || snarky.error || ""}
            readOnly={true}
            placeholder="Proof"
        />
    </Container>
}