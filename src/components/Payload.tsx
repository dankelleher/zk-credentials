import React, {FC, useState} from "react";
import {useSnarky} from "../hooks/useSnarky";
import {Button, Container, Input, Stack, Textarea} from "@chakra-ui/react";
import {useCredentialProof} from "../context/CredentialProof";

export const Payload: FC = () => {
    const credentialProof = useCredentialProof();

    return <Container width="100%">
        <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(credentialProof, null, 2))}>Copy to clipboard</Button>
        <Textarea rows={50} width="100%" value={JSON.stringify(credentialProof, null, 2)} readOnly={true} placeholder="Payload"/>
    </Container>
}