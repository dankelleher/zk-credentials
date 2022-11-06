declare module '@identity.com/credential-commons' {
    export class VC {
        static create(type: string, issuer: string, expiryIn: string | null, subject: string, claims: Claim[], evidence: string[] | null, signerOptions: {
            verificationMethod: string;
            keypair: any;
        }, validate = true): Promise<VerifiableCredential>;
    }
    export class Claim {
        static create(type: string, value: any): Promise<Claim>;
    }

    export interface SchemaLoader {}
    export class CVCSchemaLoader implements SchemaLoader {
        constructor(url: string | undefined, cache: any);
    }
    export const schemaLoader = {
        addLoader: (loader: SchemaLoader) => {}
    }
}