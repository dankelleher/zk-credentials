import {MerkleProof} from "../lib/credentials";
import {ZKProof} from "./ZKProof";

export type CredentialProof = {
    merkleProof: MerkleProof | undefined;
    zkProof: ZKProof | undefined;
    issuer: string | undefined;
    signature: string | undefined;
}