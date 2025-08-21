import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, GlobeAltIcon, AcademicCapIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-credverse-50 via-white to-credverse-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-gradient">CredVerse</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              India's first protocol-grade credential infrastructure for universities, students, and recruiters. 
              W3C compliant, blockchain-anchored, and privacy-preserving.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/issuer" className="btn-primary text-lg px-8 py-3">
                For Institutions
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link href="/student" className="btn-outline text-lg px-8 py-3">
                For Students
              </Link>
              <Link href="/verifier" className="btn-secondary text-lg px-8 py-3">
                For Recruiters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Protocol-Grade Credential Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for scale, security, and interoperability. From individual certificates to enterprise-wide deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-credverse-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-credverse-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">W3C Compliant</h3>
              <p className="text-gray-600">
                Full compliance with W3C Verifiable Credentials standard. Interoperable with global credential ecosystems.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-credverse-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8 text-credverse-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Blockchain Anchored</h3>
              <p className="text-gray-600">
                Polygon blockchain anchoring with IPFS/Arweave metadata storage. Tamper-proof and verifiable.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-credverse-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-8 h-8 text-credverse-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">University Ready</h3>
              <p className="text-gray-600">
                Built for Indian universities with ERP/LMS integration, bulk issuance, and compliance features.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-credverse-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-credverse-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Stakeholder</h3>
              <p className="text-gray-600">
                Issuers, students, recruiters, and government bodies. Complete ecosystem support.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-credverse-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-credverse-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Comprehensive analytics for institutions, students, and recruiters. Impact measurement and reporting.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-credverse-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-credverse-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">
                Zero-knowledge proofs, selective disclosure, and GDPR/DPDP compliance. Student data sovereignty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-credverse-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Credential Management?
          </h2>
          <p className="text-xl text-credverse-100 mb-8 max-w-3xl mx-auto">
            Join the future of verifiable credentials. Whether you're a university, student, or recruiter, 
            CredVerse has you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg px-8 py-3 bg-white text-credverse-900 hover:bg-gray-100">
              Get Started
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link href="/demo" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-credverse-900">
              Request Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
