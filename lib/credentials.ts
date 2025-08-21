import { ethers } from 'ethers';
import { 
  VerifiableCredential, 
  CredVerseCredential, 
  CredVerseCredentialSubject,
  CredVerseMetadata,
  Proof,
  Issuer 
} from '@/types/credential';

/**
 * Core Credential Management Functions for CredVerse
 * Handles W3C Verifiable Credential creation, signing, and verification
 */

export class CredentialManager {
  private issuerPrivateKey: string;
  private issuerDID: string;

  constructor(issuerPrivateKey: string, issuerDID: string) {
    this.issuerPrivateKey = issuerPrivateKey;
    this.issuerDID = issuerDID;
  }

  /**
   * Create a new CredVerse credential
   */
  async createCredential(
    subject: CredVerseCredentialSubject,
    metadata: Omit<CredVerseMetadata, 'blockchainHash' | 'issuerDID'>,
    templateId: string
  ): Promise<CredVerseCredential> {
    const credential: CredVerseCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://credverse.in/contexts/v1'
      ],
      id: this.generateCredentialId(),
      type: ['VerifiableCredential', 'CredVerseCredential', templateId],
      issuer: this.issuerDID,
      issuanceDate: new Date().toISOString(),
      credentialSubject: subject,
      metadata: {
        ...metadata,
        blockchainHash: '', // Will be set after blockchain anchoring
        issuerDID: this.issuerDID,
        templateId
      }
    };

    return credential;
  }

  /**
   * Sign a credential with the issuer's private key
   */
  async signCredential(credential: CredVerseCredential): Promise<CredVerseCredential> {
    try {
      const wallet = new ethers.Wallet(this.issuerPrivateKey);
      const credentialHash = this.hashCredential(credential);
      const signature = await wallet.signMessage(credentialHash);

      const proof: Proof = {
        type: 'EthereumEip712Signature2021',
        created: new Date().toISOString(),
        verificationMethod: `${this.issuerDID}#keys-1`,
        proofPurpose: 'assertionMethod',
        proofValue: signature
      };

      return {
        ...credential,
        proof
      };
    } catch (error) {
      throw new Error(`Failed to sign credential: ${error}`);
    }
  }

  /**
   * Verify a credential's signature
   */
  async verifyCredential(credential: CredVerseCredential): Promise<boolean> {
    try {
      if (!credential.proof) {
        return false;
      }

      const { proof, ...credentialWithoutProof } = credential;
      const credentialHash = this.hashCredential(credentialWithoutProof);
      
      // Extract public key from DID
      const publicKey = await this.resolveDIDPublicKey(credential.issuer as string);
      
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(credentialHash, proof.proofValue);
      const expectedAddress = ethers.computeAddress(publicKey);
      
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Credential verification failed:', error);
      return false;
    }
  }

  /**
   * Anchor credential to blockchain
   */
  async anchorToBlockchain(
    credential: CredVerseCredential,
    network: 'polygon' | 'polygon-amoy' = 'polygon-amoy'
  ): Promise<string> {
    try {
      // This would integrate with your smart contract
      // For now, we'll simulate the process
      const credentialHash = this.hashCredential(credential);
      
      // In production, this would call your smart contract
      // const tx = await credentialRegistry.anchorCredential(credentialHash);
      // await tx.wait();
      
      // For demo purposes, return a mock hash
      const mockHash = ethers.keccak256(ethers.toUtf8Bytes(credentialHash + Date.now()));
      
      return mockHash;
    } catch (error) {
      throw new Error(`Failed to anchor credential to blockchain: ${error}`);
    }
  }

  /**
   * Store credential metadata to IPFS
   */
  async storeToIPFS(credential: CredVerseCredential): Promise<string> {
    try {
      // This would integrate with IPFS
      // For now, we'll simulate the process
      const metadata = {
        ...credential,
        storedAt: new Date().toISOString(),
        storageProvider: 'ipfs'
      };

      // In production, this would upload to IPFS
      // const result = await ipfs.add(JSON.stringify(metadata));
      
      // For demo purposes, return a mock hash
      const mockHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
      
      return mockHash;
    } catch (error) {
      throw new Error(`Failed to store credential to IPFS: ${error}`);
    }
  }

  /**
   * Store credential metadata to Arweave
   */
  async storeToArweave(credential: CredVerseCredential): Promise<string> {
    try {
      // This would integrate with Arweave
      // For now, we'll simulate the process
      const metadata = {
        ...credential,
        storedAt: new Date().toISOString(),
        storageProvider: 'arweave'
      };

      // In production, this would upload to Arweave
      // const transaction = await arweave.createTransaction({
      //   data: JSON.stringify(metadata)
      // });
      // await arweave.transactions.sign(transaction);
      // await arweave.transactions.post(transaction);
      
      // For demo purposes, return a mock ID
      const mockId = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(metadata)));
      
      return mockId;
    } catch (error) {
      throw new Error(`Failed to store credential to Arweave: ${error}`);
    }
  }

  /**
   * Revoke a credential
   */
  async revokeCredential(
    credentialId: string,
    reason: string = 'Credential revoked by issuer'
  ): Promise<boolean> {
    try {
      // This would integrate with your revocation registry
      // For now, we'll simulate the process
      
      // In production, this would call your smart contract
      // const tx = await revocationRegistry.revokeCredential(credentialId, reason);
      // await tx.wait();
      
      return true;
    } catch (error) {
      throw new Error(`Failed to revoke credential: ${error}`);
    }
  }

  /**
   * Check if a credential is revoked
   */
  async isCredentialRevoked(credentialId: string): Promise<boolean> {
    try {
      // This would check your revocation registry
      // For now, we'll simulate the process
      
      // In production, this would call your smart contract
      // return await revocationRegistry.isRevoked(credentialId);
      
      return false;
    } catch (error) {
      console.error('Failed to check credential revocation status:', error);
      return false;
    }
  }

  /**
   * Generate a unique credential ID
   */
  private generateCredentialId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `urn:credverse:credential:${timestamp}:${random}`;
  }

  /**
   * Hash a credential for signing and blockchain anchoring
   */
  private hashCredential(credential: any): string {
    const normalized = normalizeCredentialForHash(credential);
    return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(normalized)));
  }

  /**
   * Normalize credential for consistent hashing
   */
  private normalizeCredential(credential: any): any {
    return normalizeCredentialForHash(credential);
  }

  /**
   * Sort object keys recursively for consistent hashing
   */
  private sortObjectKeys(obj: any): any {
    return sortObjectKeysForHash(obj);
  }

  /**
   * Resolve DID to get public key
   */
  private async resolveDIDPublicKey(did: string): Promise<string> {
    try {
      // This would resolve the DID document
      // For now, we'll simulate the process
      
      // In production, this would use a DID resolver
      // const didDocument = await didResolver.resolve(did);
      // return didDocument.verificationMethod[0].publicKeyJwk;
      
      // For demo purposes, return a mock public key
      return ethers.keccak256(ethers.toUtf8Bytes(did));
    } catch (error) {
      throw new Error(`Failed to resolve DID: ${error}`);
    }
  }
}

/**
 * Exported helpers for hashing outside the class
 */
export function computeCredentialHash(credential: any): string {
  const normalized = normalizeCredentialForHash(credential);
  return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(normalized)));
}

function normalizeCredentialForHash(credential: any): any {
  const { proof, ...normalized } = credential || {};
  return sortObjectKeysForHash(normalized);
}

function sortObjectKeysForHash(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeysForHash(item));
  }

  const sorted: any = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortObjectKeysForHash(obj[key]);
  });
  return sorted;
}

/**
 * Utility functions for credential operations
 */

export function validateCredential(credential: any): boolean {
  try {
    // Check required fields
    const requiredFields = ['@context', 'id', 'type', 'issuer', 'issuanceDate', 'credentialSubject'];
    
    for (const field of requiredFields) {
      if (!credential[field]) {
        return false;
      }
    }

    // Check context
    if (!Array.isArray(credential['@context']) || credential['@context'].length === 0) {
      return false;
    }

    // Check type
    if (!Array.isArray(credential.type) || credential.type.length === 0) {
      return false;
    }

    // Check dates
    if (isNaN(Date.parse(credential.issuanceDate))) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export function extractCredentialData(credential: CredVerseCredential): {
  studentId: string;
  studentName: string;
  programName: string;
  institutionName: string;
  graduationDate: string;
} {
  const subject = credential.credentialSubject as CredVerseCredentialSubject;
  
  return {
    studentId: subject.studentId,
    studentName: subject.studentName,
    programName: subject.programName,
    institutionName: subject.institutionName,
    graduationDate: subject.graduationDate
  };
}

export function formatCredentialForDisplay(credential: CredVerseCredential): any {
  return {
    id: credential.id,
    type: credential.type,
    issuer: credential.issuer,
    issued: new Date(credential.issuanceDate).toLocaleDateString(),
    subject: credential.credentialSubject,
    metadata: credential.metadata,
    proof: credential.proof ? 'Signed' : 'Unsigned'
  };
}

export function generateCredentialQR(credential: CredVerseCredential): string {
  // Generate a verification URL for the credential
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${credential.id}`;
  return verificationUrl;
}

export function exportCredentialAsPDF(credential: CredVerseCredential): string {
  // This would generate a PDF representation
  // For now, return a data URL placeholder
  return `data:application/pdf;base64,${btoa(JSON.stringify(credential))}`;
}

export function exportCredentialAsJSON(credential: CredVerseCredential): string {
  return JSON.stringify(credential, null, 2);
}

/**
 * Bulk credential operations
 */

export async function bulkIssueCredentials(
  credentials: CredVerseCredentialSubject[],
  templateId: string,
  issuerPrivateKey: string,
  issuerDID: string
): Promise<CredVerseCredential[]> {
  const manager = new CredentialManager(issuerPrivateKey, issuerDID);
  const issuedCredentials: CredVerseCredential[] = [];

  for (const subject of credentials) {
    try {
      const metadata: Omit<CredVerseMetadata, 'blockchainHash' | 'issuerDID'> = {
        version: '1.0.0',
        templateId,
        tags: ['bulk-issued'],
        category: 'degree',
        level: 'intermediate',
        language: 'en',
        region: 'IN',
        compliance: {
          gdpr: true,
          dpdp: true
        }
      };

      const credential = await manager.createCredential(subject, metadata, templateId);
      const signedCredential = await manager.signCredential(credential);
      
      issuedCredentials.push(signedCredential);
    } catch (error) {
      console.error(`Failed to issue credential for ${subject.studentId}:`, error);
    }
  }

  return issuedCredentials;
}

export async function bulkVerifyCredentials(
  credentials: CredVerseCredential[],
  issuerPrivateKey: string,
  issuerDID: string
): Promise<{ credentialId: string; isValid: boolean; error?: string }[]> {
  const manager = new CredentialManager(issuerPrivateKey, issuerDID);
  const results: { credentialId: string; isValid: boolean; error?: string }[] = [];

  for (const credential of credentials) {
    try {
      const isValid = await manager.verifyCredential(credential);
      results.push({
        credentialId: credential.id,
        isValid,
        error: isValid ? undefined : 'Verification failed'
      });
    } catch (error) {
      results.push({
        credentialId: credential.id,
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}
