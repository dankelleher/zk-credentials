import {useCallback, useEffect, useState} from "react";
import {VerifiableCredential} from "../types/VerifiableCredential";
import {verifyMerkleProof, verifySignature} from "../lib/credentials"

const fetchCredentialsFromStorage = async (): Promise<VerifiableCredential[]> => {
    const credentialString = window.localStorage.getItem('credentials');
    if (!credentialString) return [];
    return JSON.parse(credentialString);
}

const saveCredentialsToStorage = async (credentials: VerifiableCredential[]) => {
    window.localStorage.setItem('credentials', JSON.stringify(credentials));
}

export const useCredentials = () => {
    const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [fetched, setFetched] = useState<boolean>(false);

    useEffect(() => {
        console.log('saving credentials to storage', credentials);
        if (fetched) saveCredentials();
    }, [credentials])

    const addCredential = useCallback(async (credential: VerifiableCredential) => {
        setCredentials([...credentials, credential]);
    }, [credentials]);

    const removeCredential = useCallback(async (id: string) => {
        setCredentials(credentials.filter(c => c.id !== id));
    }, [credentials]);

    const clearCredentials = useCallback(async () => {
        setCredentials([]);
    }, []);

    const fetchCredentials = useCallback(async () => {
        setLoading(true);
        try {
            const credentials = await fetchCredentialsFromStorage();
            setCredentials(credentials);
            setFetched(true);
        } catch (e: any) {
            setError(e.toString());
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveCredentials = useCallback(async () => {
        setLoading(true);
        try {
            await saveCredentialsToStorage(credentials);
        } catch (e: any) {
            setError(e.toString());
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [credentials]);

    const verifyMerkleProofAction = async (proof: string, merkleRoot: string, targetHash: string): Promise<boolean | undefined> => {
        setLoading(true)

        try {
            const result = await verifyMerkleProof(proof, merkleRoot, targetHash)
            return result
        } catch (e: any) {
            setError(e.toString())
            console.error(e);
        } finally {
            setLoading(false)
        }
    }

    const verifySignatureAction = async (merkleRootString: string, signatureString: string, issuer: string): Promise<boolean | undefined> => {
        setLoading(true)

        try {
            const result = await verifySignature(merkleRootString, signatureString, issuer)
            return result
        } catch (e: any) {
            setError(e.toString())
            console.error(e);
        } finally {
            setLoading(false)
        }

        return false
    }

    useEffect(() => {
        fetchCredentials();
    }, [fetchCredentials]);

    return {
        credentials,
        error,
        loading,
        addCredential,
        removeCredential,
        fetchCredentials,
        saveCredentials,
        clearCredentials,
        verifyMerkleProofAction,
        verifySignatureAction
    };
}