import {FC, useCallback, useState} from "react";
import {useCredentials} from "../hooks/useCredentials";
import {extractMerkleProofFromCredential, MerkleProof} from "../lib/credentials";
import {VerifiableCredential} from "../types/VerifiableCredential";

export const Credential: FC = () => {
    const credentials = useCredentials();
    const [merkleProof, setMerkleProof] = useState<MerkleProof>();

    const prove = useCallback(async (credential: VerifiableCredential) => {
        setMerkleProof(extractMerkleProofFromCredential(credential, 'claim-cvc:Document.dateOfBirth-v1'));
    }, []);

    const store = useCallback((credentialString: string) => {
        credentials.addCredential(JSON.parse(credentialString));
    }, [credentials]);

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                store(e.currentTarget.credential.value);
            }}>
                <label htmlFor="credential">Credential</label>
                <textarea id="credential" name="credential"/>
                <input type="submit" value="Store"/>
            </form>
            <button onClick={credentials.clearCredentials}>Clear</button>
            <button onClick={credentials.saveCredentials}>Save</button>
            <table>
                <thead>
                <tr>
                    <th>Subject</th>
                    <th>Issuer</th>
                    <th>Issued</th>
                    <th>Type</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {credentials.credentials.map((credential, index) => (
                    <tr key={index}>
                        <td>{credential.credentialSubject.id}</td>
                        <td>{credential.issuer}</td>
                        <td>{credential.issuanceDate}</td>
                        <td>{credential.type}</td>
                        <td><button onClick={() => prove(credential)}>Prove</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <textarea value={JSON.stringify(merkleProof, null, 2)}/>
        </div>
    )
}