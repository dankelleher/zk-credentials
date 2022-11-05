import * as nacl from 'tweetnacl';
import { decode } from 'bs58';
import {TextEncoder} from "util";

const credential = require('../src/dummyCredential.json');

const merkleRootString = credential.proof.merkleRoot;
// credential-commons requires this rather than the more natural Buffer.from(merkleRootString, 'hex')
const merkleRoot = new TextEncoder().encode(merkleRootString);

const signatureString = credential.proof.merkleRootSignature.signature;
const signature = Buffer.from(signatureString, 'hex');

const signerPublicKeyString = credential.issuer.replace(/(did:.*:)/, '');
const signerPublicKey = decode(signerPublicKeyString);

console.log('verifying signature...', {
    merkleRootString,
    signatureString,
    issuer: credential.issuer,
    signerPublicKeyString,
});
const verification = nacl.sign.detached.verify(merkleRoot, signature, signerPublicKey);
console.log('signature verified', verification);