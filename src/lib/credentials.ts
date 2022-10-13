import MerkleTools, {Proof} from 'merkle-tools';
import {VerifiableCredential} from "../types/VerifiableCredential";
import {log} from "util";

export type MerkleProof = {
    proof: Proof<string>[],
    targetHash: string,
    merkleRoot: string,
}

export const extractMerkleProofFromCredential = (credential: VerifiableCredential, identifier: string): MerkleProof => {
    console.log('extractMerkleProofFromCredential', credential, identifier);
    const claim = credential.proof.leaves.find(claim => claim.identifier === identifier);

    if (!claim) throw new Error(`No claim found for identifier ${identifier}`);

    console.log('claim', claim);

    const proof = claim.node;
    const targetHash = claim.targetHash;
    const merkleRoot = credential.proof.merkleRoot;
    return { proof, targetHash, merkleRoot };
}

export const verifyMerkleProof = ({ proof, merkleRoot, targetHash}: MerkleProof): boolean => {
    const merkleTools = new MerkleTools({ hashType: 'sha256' });
    const castedProof = proof as unknown as Proof<string>;
    return merkleTools.validateProof(castedProof, targetHash, merkleRoot);
}