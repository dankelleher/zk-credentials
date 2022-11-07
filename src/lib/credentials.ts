import MerkleTools, {Proof} from 'merkle-tools';
import {Leaf, VerifiableCredential} from "../types/VerifiableCredential";
import * as nacl from 'tweetnacl';
import { decode } from 'bs58';

export type MerkleProof = {
    proof: Proof<string>[],
    targetHash: string,
    merkleRoot: string,
}

export const getClaim = (credential: VerifiableCredential, identifier: string): Leaf => {
    const claim = credential.proof.leaves.find(claim => claim.identifier === identifier);

    if (!claim) throw new Error(`No claim found for identifier ${identifier}`);

    return claim;
}

export const getSignature = (credential: VerifiableCredential, identifier: string): string => {
    const signature = credential.proof.merkleRootSignature.signature

    if (!signature) throw new Error(`No signature found for identifier ${identifier}`);

    return signature;
}

export const extractMerkleProofFromCredential = (credential: VerifiableCredential, identifier: string): MerkleProof => {
    console.log('extractMerkleProofFromCredential', credential, identifier);
    const claim = getClaim(credential, identifier);

    console.log('claim', claim);

    const proof = claim.node;
    const targetHash = claim.targetHash;
    const merkleRoot = credential.proof.merkleRoot;
    return { proof, targetHash, merkleRoot };
}

export const verifyMerkleProof = ({proof, merkleRoot, targetHash}: MerkleProof): boolean => {
    console.log("Verifying merkle proof...")
    const merkleTools = new MerkleTools({ hashType: 'sha256' });
    const castedProof = proof as unknown as Proof<string>;
    console.log("Casted proof: ", castedProof)
    const res = merkleTools.validateProof(castedProof, targetHash, merkleRoot);
    console.log("Verification result: ", res)
    return res
}

export const verifySignature = (merkleRootString: string, signatureString: string, issuer: string) => {
    console.log("Issuer input: ", issuer)
    const merkleRoot = new TextEncoder().encode(merkleRootString);

    const signature = Buffer.from(signatureString, 'hex');

    const signerPublicKeyString = issuer.replace(/(did:.*:)/, '');
    console.log("Fixed issuer string: ", signerPublicKeyString)
    const signerPublicKey = decode(signerPublicKeyString);

    const verification = nacl.sign.detached.verify(merkleRoot, signature, signerPublicKey);
    console.log('signature verified', verification);
    return verification;
}