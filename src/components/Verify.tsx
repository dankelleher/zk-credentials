import React, {FC, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack, Textarea} from "@chakra-ui/react";

export const Verify: FC = () => {
    const snarky = useSnarky();
    const [proof, setProof] = useState<string>();

    return <Container width="100%">
        <Stack style={{ marginBottom: "2px" }}>
            <label htmlFor="proof">Proof: </label>
            <Input id="proof" onChange={(e) => setProof(e.target.value)} type="text" />
            <Button onClick={() => proof && snarky.verify(proof)}>Verify proof</Button>
        </Stack>
        {/* <Textarea
            style={{ width: "20vw" }}
            value={snarky.proof?.toString() || snarky.error || ""}
            readOnly={true}
            placeholder="Proof"
        /> */}
    </Container>
}