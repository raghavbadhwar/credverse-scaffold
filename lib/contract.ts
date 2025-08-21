import { ethers } from 'ethers';

// Minimal ABI for the functions we need from CredentialRegistry
const CREDENTIAL_REGISTRY_ABI = [
  'function anchorCredential(bytes32 credentialHash, string credentialId, string ipfsHash, string arweaveId) external',
  'function verifyCredential(bytes32 credentialHash) external view returns (bool isValid, address issuer, uint256 timestamp, bool isRevoked)',
  'function getCredential(bytes32 credentialHash) external view returns (tuple(bytes32 hash, address issuer, uint256 timestamp, bool isRevoked, string revocationReason, string credentialId, string ipfsHash, string arweaveId))',
  'function isIssuer(address issuer) external view returns (bool)'
];

export const CREDENTIAL_REGISTRY_ADDRESS: string | undefined = process.env.NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS;

export function getBrowserProvider(): ethers.BrowserProvider {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No injected wallet found. Please install MetaMask.');
  }
  return new ethers.BrowserProvider((window as any).ethereum);
}

export async function getSigner(): Promise<ethers.Signer> {
  const provider = getBrowserProvider();
  await provider.send('eth_requestAccounts', []);
  return await provider.getSigner();
}

export async function getCredentialRegistryContract(readOnly = false): Promise<ethers.Contract> {
  if (!CREDENTIAL_REGISTRY_ADDRESS) {
    throw new Error('Missing NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS');
  }

  if (readOnly) {
    const provider = getBrowserProvider();
    return new ethers.Contract(CREDENTIAL_REGISTRY_ADDRESS, CREDENTIAL_REGISTRY_ABI, provider);
  }

  const signer = await getSigner();
  return new ethers.Contract(CREDENTIAL_REGISTRY_ADDRESS, CREDENTIAL_REGISTRY_ABI, signer);
}

export async function anchorCredentialOnChain(
  credentialHash: string,
  credentialId: string,
  ipfsHash: string,
  arweaveId: string
): Promise<ethers.TransactionReceipt> {
  const contract = await getCredentialRegistryContract(false);
  const tx = await contract.anchorCredential(credentialHash, credentialId, ipfsHash, arweaveId);
  const receipt = await tx.wait();
  return receipt as ethers.TransactionReceipt;
}

export async function verifyCredentialOnChain(credentialHash: string): Promise<{
  isValid: boolean;
  issuer: string;
  timestamp: bigint;
  isRevoked: boolean;
}> {
  const contract = await getCredentialRegistryContract(true);
  const result = await contract.verifyCredential(credentialHash);
  // result is a tuple matching the return signature
  return {
    isValid: result[0] as boolean,
    issuer: result[1] as string,
    timestamp: result[2] as bigint,
    isRevoked: result[3] as boolean,
  };
}

export async function getOnChainCredential(credentialHash: string) {
  const contract = await getCredentialRegistryContract(true);
  const data = await contract.getCredential(credentialHash);
  return data;
}


