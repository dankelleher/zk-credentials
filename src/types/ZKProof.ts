export interface ZKProof {
    publicInput: string[];
    maxProofsVerified: 0 | 1 | 2;
    proof: string;
}

