import {MerkleProof} from "../lib/credentials";

export type CredentialProof = {
    merkleProof: MerkleProof | undefined;
    zkProof: string | undefined;
    issuer: string | undefined;
    signature: string | undefined;
}