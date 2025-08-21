"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CredentialManager, exportCredentialAsJSON, computeCredentialHash } from '@/lib/credentials';
import { anchorCredentialOnChain } from '@/lib/contract';
import type { CredVerseCredentialSubject, CredVerseMetadata, CredVerseCredential } from '@/types/credential';

type FormValues = CredVerseCredentialSubject & { templateId: string };

export default function IssuerPage() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState<CredVerseCredential | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      let issuerPrivateKey = process.env.NEXT_PUBLIC_DEMO_ISSUER_PRIVATE_KEY || '';
      if (!issuerPrivateKey) {
        const { Wallet } = await import('ethers');
        issuerPrivateKey = Wallet.createRandom().privateKey;
      }
      const issuerDID = process.env.NEXT_PUBLIC_DEMO_ISSUER_DID || 'did:example:issuer';
      const manager = new CredentialManager(issuerPrivateKey, issuerDID);

      const metadata: Omit<CredVerseMetadata, 'blockchainHash' | 'issuerDID'> = {
        version: '1.0.0',
        templateId: data.templateId,
        tags: ['degree'],
        category: 'degree',
        level: 'intermediate',
        language: 'en',
        region: 'IN',
        compliance: { gdpr: true, dpdp: true }
      } as any;

      const { templateId, ...subject } = data;
      const credential = await manager.createCredential(subject, metadata, templateId);
      const signed = await manager.signCredential(credential);

      // Optional: store metadata off-chain
      const ipfsHash = await manager.storeToIPFS(signed);
      const arweaveId = await manager.storeToArweave(signed);

      // Anchor on-chain
      const credHash = computeCredentialHash(signed);
      const receipt = await anchorCredentialOnChain(credHash, signed.id, ipfsHash, arweaveId);

      setTxHash(receipt.transactionHash);
      setIssued({
        ...signed,
        metadata: { ...signed.metadata, ipfsHash, arweaveId, blockchainHash: credHash }
      });

      reset();
    } catch (err: any) {
      alert(err.message || 'Failed to issue credential');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Issue Credential</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Student ID" {...register('studentId', { required: true })} />
          <input className="input-field" placeholder="Student Name" {...register('studentName', { required: true })} />
          <input className="input-field" placeholder="Student Email" type="email" {...register('studentEmail', { required: true })} />
          <input className="input-field" placeholder="Program Name" {...register('programName', { required: true })} />
          <input className="input-field" placeholder="Institution Name" {...register('institutionName', { required: true })} />
          <input className="input-field" placeholder="Graduation Date (YYYY-MM-DD)" {...register('graduationDate', { required: true })} />
          <input className="input-field" placeholder="Template ID (e.g., degree-template)" {...register('templateId', { required: true })} />
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Issuing…' : 'Issue Credential'}</button>
      </form>

      {issued && (
        <div className="card mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Issued Credential</h2>
            {txHash && (
              <a className="btn-secondary" href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">View Tx</a>
            )}
          </div>
          <pre className="mt-4 whitespace-pre-wrap break-all text-sm bg-gray-50 p-4 rounded">{exportCredentialAsJSON(issued)}</pre>
        </div>
      )}
    </div>
  );
}


