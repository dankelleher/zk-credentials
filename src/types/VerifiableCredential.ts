export interface Name {
    familyNames: string;
    givenNames: string;
}

export interface DateOfBirth {
    day: number;
    month: number;
    year: number;
}

export interface IdDocumentFront {
    algorithm: string;
    data: string;
}

export interface Selfie {
    algorithm: string;
    data: string;
}

export interface Evidences {
    idDocumentFront: IdDocumentFront;
    selfie: Selfie;
}

export interface Document {
    type: string;
    name: Name;
    dateOfBirth: DateOfBirth;
    issueCountry: string;
    evidences: Evidences;
}

export interface CredentialSubject {
    id: string;
    document: Document;
}

export interface Node {
    right: string;
    left: string;
}

export interface Leaf {
    identifier: string;
    value: string;
    claimPath: string;
    targetHash: string;
    node: Node[];
}

export interface MerkleRootSignature {
    signature: string;
    verificationMethod: string;
}

export interface Proof {
    type: string;
    merkleRoot: string;
    anchor: string;
    leaves: Leaf[];
    merkleRootSignature: MerkleRootSignature;
    granted?: any;
}

export interface VerifiableCredential {
    "@context": string[];
    id: string;
    identifier: string;
    issuer: string;
    issuanceDate: string;
    type: string[];
    credentialSubject: CredentialSubject;
    proof: Proof;
}