import { decode, encode } from 'bs58';
import { VC, Claim, schemaLoader, CVCSchemaLoader } from '@identity.com/credential-commons'
import {VerifiableCredential} from "./VerifiableCredential";
import * as nacl from 'tweetnacl';

export const DOCUMENT_CREDENTIAL_TYPE = 'credential-cvc:IdDocument-v3';

type Pii = {
    document: {
        type: string;
        number: string;
        gender: string;
        name: { givenNames: string; familyNames: string };
        dateOfBirth: { day: number; month: number; year: number };
        placeOfBirth: string;
        issueCountry: string;
        nationality: string;
    }
}

const getIssuerVerificationMethod = (issuerDid: string): string => `${issuerDid}#default`;

const buildClaims = async (pii: Pii) => {
    const typeClaim = await Claim.create('claim-cvc:Document.type-v1', pii.document.type);
    const nameClaim = await Claim.create('claim-cvc:Document.name-v1', pii.document.name);
    const dateOfBirthClaim = await Claim.create('claim-cvc:Document.dateOfBirth-v1', pii.document.dateOfBirth);
    const issueCountryClaim = await Claim.create('claim-cvc:Document.issueCountry-v1', pii.document.issueCountry);
    const evidencesClaim = await Claim.create('claim-cvc:Document.evidences-v1', {});
    return [typeClaim, nameClaim, dateOfBirthClaim, issueCountryClaim, evidencesClaim];
};

export const createIdDocumentCredential = async (
    pii: Pii,
    subjectDID: string,
    issuerDid: string,
    issuerPrivateKey: string
): Promise<VerifiableCredential> => {
    const claims = await buildClaims(pii);
    const issuerKeypair = nacl.sign.keyPair.fromSecretKey(decode(issuerPrivateKey));
    return VC.create(DOCUMENT_CREDENTIAL_TYPE, issuerDid, null, subjectDID, claims, null, {
        verificationMethod: getIssuerVerificationMethod(issuerDid),
        keypair: issuerKeypair,
    });
};

( async () => {
    // load civic schemas on startup and store them in memory
    schemaLoader.addLoader(new CVCSchemaLoader(undefined, null));

    const subject = nacl.sign.keyPair();
    const issuer = nacl.sign.keyPair();
    const credential = await createIdDocumentCredential(
        {
            document: {
                type: 'passport',
                number: '123456789',
                gender: 'M',
                name: {
                    givenNames: 'John',
                    familyNames: 'Doe',
                },
                dateOfBirth: { day: 1, month: 1, year: 1990 },
                placeOfBirth: 'London',
                issueCountry: 'GBR',
                nationality: 'UK'
            },
        },
        'did:sol:' + encode(subject.publicKey),
        'did:sol:' + encode(issuer.publicKey),
        encode(issuer.secretKey)
    );

    console.log(JSON.stringify(credential, null, 2));

    const msg = new TextEncoder().encode(credential.proof.merkleRoot);
    const signature = nacl.sign.detached(msg, issuer.secretKey);
    console.log('signature', Buffer.from(signature).toString('hex'));
})().catch(console.error);