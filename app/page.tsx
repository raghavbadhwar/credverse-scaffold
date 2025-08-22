"use client";

import React, { useState, useContext, createContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, QrCode, Wallet2, University, Building2, ServerCog, Fingerprint, Lock, Globe2, Cpu, Link2, ArrowRight, CheckCircle2, Github, Mail, Linkedin, Twitter, X, Sun, Moon
} from "lucide-react";

// Theme Context
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// UI Components
const Button = ({ variant, size, className, children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-slate-950";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    lg: "h-11 px-6",
    icon: "h-10 w-10",
  };

  const finalClassName = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className || ''}`;
  
  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};

const Card = ({ className, children }) => (
  <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300 ${className}`}>{children}</div>
);

const Badge = ({ className, color, ...props }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };
  return (
    <div
      className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-medium ${colors[color] || colors.slate} ${className}`}
      {...props}
    />
  );
};

// Logo Component
function LogoCV({ size = 28 }) {
  const accent = "#4F46E5";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="CredVerse" role="img">
      <path d="M46 16a18 18 0 1 0 0 32" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <g stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 20v24M32 32h12"/>
      </g>
      <g fill={accent}>
        <circle cx="32" cy="20" r="4"/>
        <circle cx="32" cy="44" r="4"/>
        <circle cx="44" cy="32" r="4"/>
      </g>
    </svg>
  );
}

// Theme Toggle
function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

// NavBar
function NavBar() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 text-slate-900 dark:text-white no-underline">
          <LogoCV size={28} />
          <span className="font-semibold tracking-tight text-lg">CredVerse</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
          <a href="#product" className="hover:text-blue-500 dark:hover:text-blue-400 no-underline">Product</a>
          <a href="#how" className="hover:text-blue-500 dark:hover:text-blue-400 no-underline">How it works</a>
          <a href="#trust" className="hover:text-blue-500 dark:hover:text-blue-400 no-underline">Trust</a>
          <a href="#stack" className="hover:text-blue-500 dark:hover:text-blue-400 no-underline">Stack</a>
          <a href="#contact" className="hover:text-blue-500 dark:hover:text-blue-400 no-underline">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">Docs</Button>
          <Button className="rounded-2xl">
            <span className="flex items-center gap-1">Request a Demo <ArrowRight className="h-4 w-4"/></span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hero Section
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-blue-600/20 via-indigo-500/20 to-sky-400/20 blur-3xl dark:from-blue-600/30 dark:via-indigo-500/30 dark:to-sky-400/30" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gradient-to-tr from-cyan-400/10 to-purple-500/10 blur-3xl dark:from-cyan-400/20 dark:to-purple-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.02),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-10 items-center"
        >
          <div className="space-y-6">
            <Badge className="rounded-full px-3 py-1 text-xs w-fit bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-600/10 dark:text-blue-400 dark:border-blue-500/30">W3C Verifiable Credentials</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">India's trust layer for education credentials.</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">Issue tamper‑proof degrees, store them in student wallets, and verify in seconds—QR or API. Built on open standards (DID + VC), with zk‑proofs and PoP integrations.</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl">
                <span className="flex items-center gap-2">Start Pilot <ArrowRight className="h-4 w-4" /></span>
              </Button>
              <Button size="lg" variant="secondary" className="rounded-2xl">
                Explore Product
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-500"/> Compliant with W3C VC</span>
              <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-blue-500"/> Selective disclosure (SD‑JWT‑VC)</span>
              <span className="flex items-center gap-2"><Fingerprint className="h-4 w-4 text-blue-500"/> Optional PoP: Worldcoin / Aadhaar</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500/40 via-cyan-400/40 to-purple-500/40 blur-2xl" />
            <Card className="relative rounded-3xl border-slate-200/60 dark:border-slate-800/60 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Wallet2 className="h-5 w-5 text-blue-500 dark:text-blue-400"/> 
                  CredVerse Wallet (Preview)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: University, title: "Degree: B.Com (Hons)", sub: "SRCC • 2027" },
                    { icon: QrCode, title: "Share via QR", sub: "One‑tap verification" },
                    { icon: ShieldCheck, title: "Signed VC", sub: "did:web:srcc.in" },
                    { icon: Lock, title: "Private proof", sub: "zk‑enabled" },
                  ].map((f, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/50">
                      <div className="flex items-center gap-2">
                        <f.icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        <p className="font-medium text-sm">{f.title}</p>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{f.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Metrics Section
function Metrics() {
  const data = [
    { value: "<2s", label: "Verification time" },
    { value: "99.99%", label: "Availability" },
    { value: "10k+", label: "Credentials issued" },
    { value: "50+", label: "Institutions onboarded" },
  ];
  
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {data.map((d, i) => (
            <Card key={i} className="rounded-2xl border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-900">
              <div className="p-6 text-center">
                <p className="text-2xl md:text-3xl font-semibold tracking-tight">{d.value}</p>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">{d.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Product Suite
function ProductSuite() {
  const products = [
    { icon: Building2, name: "Issuer Dashboard", desc: "Issue VCs, manage schemas, revoke, and export analytics. Domain proof with did:web.", bullets: ["Role‑based access", "Schema templates", "Revocation registry"], cta: "Launch Issuer" },
    { icon: Wallet2, name: "Student Wallet", desc: "Own your credentials. Share via QR or link. Prove selectively with SD‑JWT‑VC.", bullets: ["Self‑custody", "Multi‑DID support", "zk‑proof flows"], cta: "Open Wallet" },
    { icon: QrCode, name: "Recruiter Verify", desc: "Scan. Verify. Integrate into ATS via API. Sub‑2s verification at scale.", bullets: ["Embed widget", "Webhooks", "Audit trail"], cta: "Verify Now" },
  ];

  return (
    <section id="product" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge className="rounded-full px-3 py-1 text-xs w-fit bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-600/10 dark:text-indigo-400 dark:border-indigo-500/30">Product Suite</Badge>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">Everything you need to issue, store, and verify.</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">Built for universities, edtechs, and high‑volume recruiters.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 16 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ type: "spring", stiffness: 120, delay: i * 0.06 }}
            >
              <Card className="rounded-2xl h-full bg-white dark:bg-slate-900">
                <div className="p-6">
                  <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <p.icon className="h-5 w-5 text-indigo-500 dark:text-indigo-400"/> 
                    {p.name}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{p.desc}</p>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-4">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 dark:text-indigo-400"/> 
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Button variant="secondary" className="rounded-2xl">{p.cta}</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <LogoCV size={24} />
            <span className="font-semibold">CredVerse</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-sm">Protocol‑grade credential trust layer for India and beyond.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold">Connect</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4"/> hello@credverse.xyz</li>
              <li className="flex items-center gap-2"><Twitter className="h-4 w-4"/> @credverse</li>
              <li className="flex items-center gap-2"><Linkedin className="h-4 w-4"/> LinkedIn</li>
              <li className="flex items-center gap-2"><Github className="h-4 w-4"/> GitHub</li>
            </ul>
          </div>
        </div>
        <div className="flex md:justify-end">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            <p>© {new Date().getFullYear()} CredVerse. All rights reserved.</p>
            <p className="mt-1">Made with open standards & love.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-500/20 selection:text-blue-300 font-sans transition-colors duration-300 ease-in-out">
      <NavBar />
      <main>
        <Hero />
        <Metrics />
        <ProductSuite />
      </main>
      <Footer />
    </div>
  );
}

// Main component wrapped with ThemeProvider
export default function ThemedApp() {
    return (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    )
}
