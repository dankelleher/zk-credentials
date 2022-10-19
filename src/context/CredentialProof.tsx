import {createContext, FC, PropsWithChildren, useContext, useState} from "react";
import {MerkleProof} from "../lib/credentials";

type CredentialProof = {
    merkleProof: MerkleProof | undefined;
    zkProof: string | undefined;
    issuer: string | undefined;
}
type CredentialProofContextType = CredentialProof & {
    set: <T extends keyof CredentialProof>(property: T, value: CredentialProof[T]) => void;
}
const defaultProofContext = {
    issuer: undefined, merkleProof: undefined, merkleRoot: undefined, zkProof: undefined, set: () => {}
};
const CredentialProofContext = createContext<CredentialProofContextType>(defaultProofContext);

export const CredentialProofProvider: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
    const [state, setState] = useState<CredentialProof>(defaultProofContext)

    const set = <T extends keyof CredentialProof>(property: T, value: CredentialProof[T]) => {
        setState((prevState) => ({ ...prevState, [property]: value }));
    }

    return <CredentialProofContext.Provider value={{
        ...state,
        set
    }}>
        {children}
    </CredentialProofContext.Provider>
}

export const useCredentialProof = () => useContext(CredentialProofContext)