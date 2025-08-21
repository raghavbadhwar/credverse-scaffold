"use client";
import { useMemo } from 'react';
import { generateCredentialQR, exportCredentialAsJSON } from '@/lib/credentials';
import type { CredVerseCredential } from '@/types/credential';
import QRCode from 'react-qr-code';

export default function StudentPage() {
  const sample: CredVerseCredential = useMemo(() => ({
    '@context': ['https://www.w3.org/2018/credentials/v1', 'https://credverse.in/contexts/v1'],
    id: 'urn:credverse:credential:demo',
    type: ['VerifiableCredential', 'CredVerseCredential', 'degree-template'],
    issuer: 'did:example:issuer',
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      studentId: 'S-001',
      studentName: 'Demo Student',
      studentEmail: 'student@example.com',
      programName: 'B.Tech Computer Science',
      institutionName: 'Demo University',
      graduationDate: '2025-05-31'
    },
    metadata: {
      version: '1.0.0',
      blockchainHash: '0x',
      templateId: 'degree-template',
      issuerDID: 'did:example:issuer',
      tags: ['demo'],
      category: 'degree',
      level: 'intermediate',
      language: 'en',
      region: 'IN',
      compliance: { gdpr: true, dpdp: true }
    }
  } as any), []);

  const qr = useMemo(() => generateCredentialQR(sample), [sample]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Credential</h1>
      <div className="card">
        <div className="flex items-start gap-6">
          <div className="bg-white p-3 rounded border">
            <QRCode value={qr} size={160} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{(sample.credentialSubject as any).programName}</h2>
            <div className="text-sm text-gray-600">{(sample.credentialSubject as any).institutionName}</div>
            <div className="mt-2 text-sm">Issued: {new Date(sample.issuanceDate).toLocaleString()}</div>
          </div>
        </div>
        <pre className="mt-4 whitespace-pre-wrap break-all text-sm bg-gray-50 p-4 rounded">{exportCredentialAsJSON(sample)}</pre>
      </div>
    </div>
  );
}


