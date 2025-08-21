// Core Credential Types for CredVerse
// Based on W3C Verifiable Credentials standard

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string | Issuer;
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  proof?: Proof;
  credentialStatus?: CredentialStatus;
  evidence?: Evidence[];
  termsOfUse?: TermsOfUse[];
  refreshService?: RefreshService[];
  [key: string]: any;
}

export interface CredentialSubject {
  id?: string;
  [key: string]: any;
}

export interface Issuer {
  id: string;
  name?: string;
  url?: string;
  image?: string;
  [key: string]: any;
}

export interface Proof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
  [key: string]: any;
}

export interface CredentialStatus {
  id: string;
  type: string;
  statusPurpose: string;
  status: string;
  [key: string]: any;
}

export interface Evidence {
  id?: string;
  type: string[];
  [key: string]: any;
}

export interface TermsOfUse {
  type: string;
  id?: string;
  [key: string]: any;
}

export interface RefreshService {
  id: string;
  type: string;
  [key: string]: any;
}

// CredVerse Specific Types

export interface CredVerseCredential extends VerifiableCredential {
  '@context': ['https://www.w3.org/2018/credentials/v1', 'https://credverse.in/contexts/v1'];
  type: ['VerifiableCredential', 'CredVerseCredential', ...string[]];
  credentialSubject: CredVerseCredentialSubject;
  metadata: CredVerseMetadata;
}

export interface CredVerseCredentialSubject extends CredentialSubject {
  studentId: string;
  studentName: string;
  studentEmail: string;
  programName: string;
  institutionName: string;
  graduationDate: string;
  gpa?: number;
  major?: string;
  minor?: string;
  honors?: string[];
  achievements?: Achievement[];
  skills?: Skill[];
  [key: string]: any;
}

export interface CredVerseMetadata {
  version: string;
  blockchainHash: string;
  ipfsHash?: string;
  arweaveId?: string;
  templateId: string;
  issuerDID: string;
  revocationRegistry?: string;
  expirationDate?: string;
  tags: string[];
  category: CredentialCategory;
  level: CredentialLevel;
  language: string;
  region: string;
  compliance: ComplianceInfo;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  date: string;
  category: string;
  [key: string]: any;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  verified: boolean;
  [key: string]: any;
}

export type CredentialCategory = 
  | 'degree'
  | 'diploma'
  | 'certificate'
  | 'badge'
  | 'transcript'
  | 'microcredential'
  | 'skill_certification'
  | 'achievement'
  | 'other';

export type CredentialLevel = 
  | 'foundational'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'doctoral'
  | 'postdoctoral';

export interface ComplianceInfo {
  gdpr: boolean;
  dpdp: boolean;
  [key: string]: boolean;
}

// DID (Decentralized Identifier) Types

export interface DIDDocument {
  '@context': string[];
  id: string;
  controller?: string | string[];
  verificationMethod?: VerificationMethod[];
  authentication?: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
  capabilityInvocation?: string[];
  capabilityDelegation?: string[];
  service?: Service[];
  [key: string]: any;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk?: any;
  publicKeyMultibase?: string;
  [key: string]: any;
}

export interface Service {
  id: string;
  type: string;
  serviceEndpoint: string | string[] | Record<string, any>;
  [key: string]: any;
}

// Institution Types

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  did: string;
  domain: string;
  logo?: string;
  website: string;
  address: Address;
  contact: ContactInfo;
  accreditation: AccreditationInfo;
  settings: InstitutionSettings;
  createdAt: string;
  updatedAt: string;
}

export type InstitutionType = 
  | 'university'
  | 'college'
  | 'school'
  | 'training_institute'
  | 'corporate'
  | 'government'
  | 'other';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  [key: string]: any;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website: string;
  [key: string]: any;
}

export interface AccreditationInfo {
  naac?: string;
  ugc?: string;
  aicte?: string;
  iso?: string;
  [key: string]: any;
}

export interface InstitutionSettings {
  whiteLabeling: WhiteLabelingConfig;
  integrations: IntegrationConfig;
  security: SecurityConfig;
  [key: string]: any;
}

export interface WhiteLabelingConfig {
  customLogo: boolean;
  customDomain: boolean;
  customColors: boolean;
  customSeal: boolean;
  [key: string]: any;
}

export interface IntegrationConfig {
  erp: ERPIntegration[];
  lms: LMSIntegration[];
  webhooks: WebhookConfig[];
  [key: string]: any;
}

export interface ERPIntegration {
  type: 'sap' | 'tcs_ion' | 'oracle' | 'custom';
  config: Record<string, any>;
  enabled: boolean;
  [key: string]: any;
}

export interface LMSIntegration {
  type: 'moodle' | 'canvas' | 'blackboard' | 'custom';
  config: Record<string, any>;
  enabled: boolean;
  [key: string]: any;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  [key: string]: any;
}

export interface SecurityConfig {
  mfa: boolean;
  ipWhitelist: string[];
  sessionTimeout: number;
  auditLogging: boolean;
  [key: string]: any;
}

// User Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  did?: string;
  walletAddress?: string;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 
  | 'admin'
  | 'registrar'
  | 'faculty'
  | 'operator'
  | 'student'
  | 'recruiter'
  | 'verifier';

export interface UserProfile {
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  [key: string]: any;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  language: string;
  timezone: string;
  [key: string]: any;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  [key: string]: any;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'connections';
  credentialVisibility: 'public' | 'private' | 'selective';
  [key: string]: any;
}

// Verification Types

export interface VerificationRequest {
  id: string;
  credentialId: string;
  verifierId: string;
  status: VerificationStatus;
  requestedAt: string;
  completedAt?: string;
  result?: VerificationResult;
  [key: string]: any;
}

export type VerificationStatus = 
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'expired'
  | 'revoked';

export interface VerificationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  metadata: VerificationMetadata;
  [key: string]: any;
}

export interface VerificationMetadata {
  blockchainVerified: boolean;
  issuerVerified: boolean;
  signatureVerified: boolean;
  notExpired: boolean;
  notRevoked: boolean;
  [key: string]: any;
}

// Analytics Types

export interface AnalyticsData {
  institutionId: string;
  period: string;
  metrics: MetricsData;
  insights: InsightData[];
  [key: string]: any;
}

export interface MetricsData {
  totalCredentials: number;
  activeCredentials: number;
  revokedCredentials: number;
  totalVerifications: number;
  uniqueVerifiers: number;
  [key: string]: any;
}

export interface InsightData {
  type: string;
  title: string;
  description: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  [key: string]: any;
}

// API Response Types

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  [key: string]: any;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Blockchain Types

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  gasUsed: string;
  status: 'success' | 'failed';
  [key: string]: any;
}

export interface IPFSMetadata {
  hash: string;
  size: number;
  name: string;
  type: string;
  url: string;
  [key: string]: any;
}

export interface ArweaveMetadata {
  id: string;
  size: number;
  contentType: string;
  url: string;
  [key: string]: any;
}
