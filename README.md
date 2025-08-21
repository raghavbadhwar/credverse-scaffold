# 🌐 CredVerse - Protocol-Grade Credential Infrastructure

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/raghavbadhwar/credverse-scaffold/actions/workflows/ci.yml/badge.svg)](https://github.com/raghavbadhwar/credverse-scaffold/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
[![Polygon](https://img.shields.io/badge/Polygon-2.0-purple.svg)](https://polygon.technology/)

**India's first protocol-grade credential infrastructure for universities, students, and recruiters.**

CredVerse is a comprehensive, W3C-compliant verifiable credential platform built on Polygon blockchain with IPFS/Arweave storage. It provides a complete ecosystem for issuing, managing, and verifying educational credentials with enterprise-grade security and compliance.

## 🚀 Features

### 🔐 Credential Issuance
- **W3C Verifiable Credentials** - Full compliance with international standards
- **Blockchain Anchoring** - Polygon Amoy → Mainnet with IPFS/Arweave metadata
- **Smart Templates** - Drag-and-drop credential designer with customization
- **Bulk Issuance** - CSV upload and ERP/LMS integration
- **Revocation & Reissuance** - Complete lifecycle management

### 🏫 Issuer Dashboard
- **Role-based Access** - Admin, Registrar, Faculty, Operator
- **White-labeling** - Custom domains, logos, seals, and branding
- **Integration Ready** - SAP, TCS iON, Oracle, Moodle, Canvas
- **Audit & Compliance** - Full audit trails for regulatory requirements

### 🎓 Student Wallet
- **Mobile & Web** - Next.js + React Native applications
- **DID-based Identity** - Decentralized identifier support
- **Selective Disclosure** - Share only what's needed
- **Cross-platform** - Import/export between wallets

### ✅ Verification Portal
- **Instant Verification** - QR code scanning and blockchain validation
- **Bulk Operations** - Enterprise verification for recruiters and HR
- **API Integration** - ATS systems (Lever, Greenhouse, Workday)
- **Trust Scoring** - Reputation and reliability metrics

### 🌍 Standards & Interoperability
- **W3C Compliance** - Verifiable Credentials and DIDs
- **Open Badges 3.0** - Micro-credential support
- **Multi-language** - Internationalization ready
- **Cross-institution** - Joint programs and MoUs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (Polygon)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Student       │    │   Database      │    │   IPFS/Arweave │
│   Wallet        │    │   (PostgreSQL)  │    │   Storage      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM and migrations
- **PostgreSQL** - Primary database
- **Supabase** - Alternative backend option

### Blockchain
- **Polygon** - Layer 2 scaling solution
- **Hardhat** - Development and testing framework
- **Ethers.js** - Ethereum library
- **Solidity** - Smart contract language

### Storage
- **IPFS** - Decentralized file storage
- **Arweave** - Permanent data storage
- **Supabase Storage** - Alternative storage option

### Authentication
- **NextAuth.js** - Authentication framework
- **JWT** - Token-based security
- **DID** - Decentralized identifiers

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Git
- MetaMask or similar wallet

### 1. Clone Repository
```bash
git clone https://github.com/raghavbadhwar/credverse-scaffold.git
cd credverse-scaffold
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp env.example .env
# Edit .env with your configuration values
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb credverse

# Run Prisma migrations
npm run db:generate
npm run db:push
```

### 5. Smart Contract Setup
```bash
# Compile contracts
npm run contract:compile

# Deploy to testnet (Polygon Amoy)
npm run contract:deploy
```

#### Configure for Amoy
- Set `PRIVATE_KEY`, `POLYGON_AMOY_RPC_URL`, `POLYGONSCAN_API_KEY` in `.env`
- Ensure your wallet has Amoy test MATIC for gas
- After deployment, `.env` will be updated with `NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS`

### 6. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/credverse"

# Blockchain
POLYGON_AMOY_RPC_URL="https://rpc-amoy.polygon.technology"
PRIVATE_KEY="your-private-key"
POLYGONSCAN_API_KEY="your-api-key"

# IPFS
IPFS_PROJECT_ID="your-project-id"
IPFS_PROJECT_SECRET="your-project-secret"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_GOOGLE_CLIENT_ID="your-google-client-id"
```

### Smart Contract Deployment

1. **Configure Networks** - Update `hardhat.config.ts` with your RPC URLs
2. **Set Private Key** - Add your deployment wallet private key to `.env`
3. **Deploy** - Run `npm run contract:deploy` for testnet deployment

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Smart Contract Tests
```bash
npm run contract:test
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Smart Contract Deployment
```bash
# Deploy to Polygon Mainnet
npm run contract:deploy --network polygon
```

### Verifying on Polygonscan (Amoy)
The deploy script auto-verifies if `POLYGONSCAN_API_KEY` is set. To verify manually:
```bash
npx hardhat verify --network polygon-amoy <DEPLOYED_ADDRESS>
```

### Database Migration
```bash
npm run db:migrate
```

## 📚 API Documentation

### Credential Endpoints

- `POST /api/credentials/issue` - Issue new credential
- `GET /api/credentials/:id` - Get credential details
- `POST /api/credentials/:id/revoke` - Revoke credential
- `GET /api/credentials/verify/:hash` - Verify credential

### Institution Endpoints

- `POST /api/institutions/register` - Register new institution
- `GET /api/institutions/:id` - Get institution details
- `PUT /api/institutions/:id/settings` - Update settings

### Verification Endpoints

- `POST /api/verify/credential` - Verify credential
- `POST /api/verify/bulk` - Bulk verification
- `GET /api/verify/history` - Verification history

## 🔒 Security Features

- **W3C Compliance** - International credential standards
- **Blockchain Security** - Immutable credential anchoring
- **DID Authentication** - Decentralized identity verification
- **Role-based Access** - Granular permission system
- **Audit Logging** - Complete activity tracking
- **GDPR/DPDP Compliance** - Privacy regulation adherence

## 🌐 Integration Guide

### ERP Systems
- **SAP** - Enterprise resource planning
- **TCS iON** - Indian education platform
- **Oracle** - Database and applications

### LMS Platforms
- **Moodle** - Open-source learning platform
- **Canvas** - Modern learning management
- **Blackboard** - Traditional LMS integration

### Government IDs
- **Aadhaar** - Indian national ID (optional)
- **DigiLocker** - Government document storage (optional)
- **Worldcoin** - Proof-of-personhood (optional)

## 📊 Analytics & Reporting

- **Institution Insights** - Credential issuance and verification metrics
- **Student Engagement** - Usage patterns and adoption rates
- **Recruiter Analytics** - Verification trends and popular credentials
- **Compliance Reports** - NAAC, UGC, and regulatory reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - [docs.credverse.in](https://docs.credverse.in)
- **Issues** - [GitHub Issues](https://github.com/raghavbadhwar/credverse-scaffold/issues)
- **Discussions** - [GitHub Discussions](https://github.com/raghavbadhwar/credverse-scaffold/discussions)
- **Email** - hi@credverse.in

## 🗺️ Roadmap

### Phase 1.0 (MVP) - Q1 2024
- ✅ Issuer Dashboard
- ✅ Student Wallet
- ✅ Basic Verification
- ✅ Polygon Testnet Integration

### Phase 1.5 - Q2 2024
- 🔄 Selective Disclosure (SD-JWT-VC)
- 🔄 DID:web Onboarding
- 🔄 Aadhaar/Worldcoin Integration
- 🔄 Advanced Templates

### Phase 2.0 - Q3 2024
- 📋 Zero-Knowledge Proofs
- 📋 Trust Scoring System
- 📋 Cross-institution Issuance
- 📋 Advanced Analytics

### Phase 3.0 - Q4 2024
- 📋 AI-powered Credential Analysis
- 📋 Global Expansion
- 📋 Enterprise Features
- 📋 Mobile Applications

## 🙏 Acknowledgments

- **W3C** - Verifiable Credentials standards
- **Polygon** - Blockchain infrastructure
- **OpenZeppelin** - Smart contract security
- **Next.js** - React framework
- **Prisma** - Database toolkit

---

**Built with ❤️ for India's Education Ecosystem**

*CredVerse - Transforming Credentials, Empowering Futures*
