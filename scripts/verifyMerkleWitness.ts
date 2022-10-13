import MerkleTools, {Proof} from 'merkle-tools';
const credential = require('../dummyCredential.json');

const claim = credential.proof.leaves[0];
const proof = claim.node;
const targetHash = claim.targetHash;
const merkleRoot = credential.proof.merkleRoot;

const merkleTools = new MerkleTools({ hashType: 'sha256' });

// the TS type is wrong for this field in merkle-tools. So we cast here to fool TS.
const castedProof = proof as unknown as Proof<string>;

const isValid = merkleTools.validateProof(castedProof, targetHash, merkleRoot);

console.log('proof is valid', isValid);