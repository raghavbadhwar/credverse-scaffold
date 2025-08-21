"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { verifyCredentialOnChain } from '@/lib/contract';
import { CredentialManager } from '@/lib/credentials';
import type { CredVerseCredential } from '@/types/credential';

type VerifyHashForm = { hash: string };

export default function VerifierPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [sigValid, setSigValid] = useState<boolean | null>(null);
  const { register, handleSubmit } = useForm<VerifyHashForm>();

  const onVerifyHash = async (data: VerifyHashForm) => {
    try {
      setLoading(true);
      const res = await verifyCredentialOnChain(data.hash);
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyJSON = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const json = e.target.value.trim();
      if (!json) return;
      const credential = JSON.parse(json) as CredVerseCredential;
      const issuerPrivateKey = process.env.NEXT_PUBLIC_DEMO_ISSUER_PRIVATE_KEY || '';
      const issuerDID = process.env.NEXT_PUBLIC_DEMO_ISSUER_DID || 'did:example:issuer';
      const manager = new CredentialManager(issuerPrivateKey, issuerDID);
      const ok = await manager.verifyCredential(credential);
      setSigValid(ok);
    } catch (err) {
      setSigValid(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Verify Credential</h1>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-3">Verify by On-Chain Hash</h2>
        <form onSubmit={handleSubmit(onVerifyHash)} className="flex gap-3">
          <input className="input-field flex-1" placeholder="0x… credential hash" {...register('hash', { required: true })} />
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify'}</button>
        </form>
        {result && (
          <div className="mt-4 text-sm">
            <div>Valid: <span className="font-mono">{String(result.isValid)}</span></div>
            <div>Issuer: <span className="font-mono break-all">{result.issuer}</span></div>
            <div>Revoked: <span className="font-mono">{String(result.isRevoked)}</span></div>
            <div>Timestamp: <span className="font-mono">{result.timestamp?.toString?.() || result.timestamp}</span></div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Verify by JSON</h2>
        <textarea className="input-field h-48" placeholder="Paste credential JSON here" onChange={onVerifyJSON} />
        {sigValid !== null && (
          <div className="mt-2 text-sm">Signature valid: <span className="font-mono">{String(sigValid)}</span></div>
        )}
      </div>
    </div>
  );
}


