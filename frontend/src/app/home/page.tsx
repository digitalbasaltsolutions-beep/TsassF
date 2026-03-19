'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ─── Navigation ──────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg" style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}>B</div>
          <span className={`text-xl font-extrabold tracking-tight transition-colors ${scrolled ? 'text-gray-900':'text-white'}`}>Bashanssas</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Services','Technology','About','Contact'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} className={`text-sm font-semibold transition-colors hover:text-blue-500 ${scrolled ? 'text-gray-600':'text-white/80'}`}>{s}</a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/login" className={`text-sm font-bold px-5 py-2 rounded-xl border-2 transition-all ${scrolled ? 'border-blue-600 text-blue-600 hover:bg-blue-50':'border-white/60 text-white hover:bg-white/10'}`}>Login</Link>
          <Link href="/register" className="text-sm font-bold px-5 py-2 rounded-xl text-white shadow-lg transition-all hover:scale-105" style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}>Get Started</Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`space-y-1.5 ${menuOpen ? 'opacity-0' : ''}`}>
            {[0,1,2].map(i => <div key={i} className={`h-0.5 w-6 ${scrolled ? 'bg-gray-800':'bg-white'}`}/>)}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4 shadow-xl">
          {['Services','Technology','About','Contact'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-sm font-semibold text-gray-700 hover:text-blue-600">{s}</a>
          ))}
          <div className="flex space-x-3 pt-2">
            <Link href="/login" className="flex-1 text-center text-sm font-bold py-2 rounded-xl border-2 border-blue-600 text-blue-600">Login</Link>
            <Link href="/register" className="flex-1 text-center text-sm font-bold py-2 rounded-xl text-white" style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{background:'linear-gradient(135deg,#031B5B 0%,#0A4BD4 50%,#6C3AFF 100%)'}}>
      {/* Animated blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse"/>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay:'1s'}}/>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 text-white text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"/>
          Now accepting new businesses — Start free today
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          The <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(90deg,#60A5FA,#A78BFA)'}}>Business OS</span><br/>
          built for growth
        </h1>

        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
          Bashanssas is a unified platform for CRM, Ecommerce, Mobile Development and Digital Solutions — everything your business needs under one roof.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="px-8 py-4 rounded-2xl text-blue-900 font-extrabold text-base bg-white hover:bg-gray-50 shadow-2xl transition-all hover:scale-105">
            Start Free — No Credit Card
          </Link>
          <a href="#services" className="px-8 py-4 rounded-2xl font-extrabold text-base border-2 border-white/40 hover:bg-white/10 transition-all">
            Explore Services ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 max-w-xl mx-auto gap-6">
          {[['500+','Businesses'],['98%','Uptime'],['24/7','Support']].map(([val,label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-white">{val}</div>
              <div className="text-blue-200 text-xs mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 text-xs gap-2">
        <span>Scroll</span>
        <div className="w-0.5 h-8 bg-white/30 animate-bounce"/>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: '🤝',
    title: 'CRM Platform',
    desc: 'Manage contacts, track deals through your pipeline, and log every activity. Multi-tenant with full organization isolation.',
    badge: 'Available Now',
    color: '#0A4BD4',
  },
  {
    icon: '🛍️',
    title: 'Ecommerce Module',
    desc: 'Launch your online store inside the platform. Manage products, track orders, and monitor revenue all in one dashboard.',
    badge: 'Available Now',
    color: '#6C3AFF',
  },
  {
    icon: '📱',
    title: 'Mobile App Development',
    desc: 'Cross-platform iOS & Android apps built with the latest frameworks. Native performance, beautiful UI, fast delivery.',
    badge: 'Service',
    color: '#0891B2',
  },
  {
    icon: '💡',
    title: 'Digital Solutions',
    desc: 'Custom software, automation workflows, API integrations, and cloud architecture solutions tailored to your business.',
    badge: 'Service',
    color: '#059669',
  },
  {
    icon: '🤖',
    title: 'AI Tools (Coming Soon)',
    desc: 'AI-powered lead scoring, smart recommendations, and automated analytics to supercharge your business decisions.',
    badge: 'Coming Soon',
    color: '#D97706',
  },
  {
    icon: '📢',
    title: 'Marketing Suite',
    desc: 'WhatsApp campaigns, email automation, and ad integrations directly connected to your CRM contacts.',
    badge: 'Coming Soon',
    color: '#DC2626',
  },
];

function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">What we offer</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">Our Services & Modules</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">One platform, six powerful modules. Start with what you need, scale as you grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map(s => (
            <div key={s.title} className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold mb-3" style={{background:s.color+'15',color:s.color}}>{s.badge}</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Technology ───────────────────────────────────────────────────────────────
const TECHS = [
  {name:'NestJS',cat:'Backend'},
  {name:'MongoDB',cat:'Database'},
  {name:'Redis',cat:'Cache'},
  {name:'Next.js',cat:'Frontend'},
  {name:'React',cat:'UI'},
  {name:'TypeScript',cat:'Language'},
  {name:'Docker',cat:'DevOps'},
  {name:'Stripe',cat:'Payments'},
  {name:'JWT Auth',cat:'Security'},
];

function TechnologySection() {
  return (
    <section id="technology" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-purple-600 font-bold text-sm uppercase tracking-widest">Built to scale</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-6">Enterprise-grade technology stack</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Built from the ground up with modern, production-proven technologies. Our architecture uses a Modular Monolith pattern that can seamlessly evolve into Microservices as your organization scales.
            </p>
            <ul className="space-y-3">
              {['Multi-tenant data isolation — every org sees only its own data','JWT authentication with refresh token rotation','Role-Based Access Control (Owner / Admin / Member)','Containerized deployment via Docker & Compose'].map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 text-base">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {TECHS.map(t => (
              <div key={t.name} className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50 transition-all">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.cat}</div>
                <div className="text-sm font-extrabold text-gray-800">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24" style={{background:'linear-gradient(135deg,#031B5B 0%,#0A4BD4 100%)'}}>
      <div className="max-w-7xl mx-auto px-6 text-white">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-300 font-bold text-sm uppercase tracking-widest">Who we are</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-6">Built by builders,<br/>for businesses</h2>
            <p className="text-blue-100 leading-relaxed mb-6">
              <strong className="text-white">Bashanssas</strong> was founded with a simple mission: give every business — from a solo freelancer to a growing SME — access to the same powerful digital tools that large enterprises use.
            </p>
            <p className="text-blue-100 leading-relaxed">
              We believe technology should simplify operations, not complicate them. That's why we built a single platform where CRM, billing, ecommerce, and marketing all live together — connected, intelligent, and always in sync.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              {icon:'🌍', title:'Global Ready', desc:'Multi-language, multi-currency support designed for international teams.'},
              {icon:'🔒', title:'Secure by Default', desc:'End-to-end encryption, JWT tokens, and strict per-organization data isolation.'},
              {icon:'⚡', title:'Fast Setup', desc:'Register, set up your org, and start managing your business in under 5 minutes.'},
              {icon:'🧩', title:'Modular Growth', desc:'Activate only the modules you need today. Add more as you scale tomorrow.'},
            ].map(c => (
              <div key={c.title} className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h4 className="font-extrabold text-white mb-1">{c.title}</h4>
                <p className="text-blue-200 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing CTA ──────────────────────────────────────────────────────────────
function PricingCTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Simple, transparent pricing</h2>
          <p className="text-gray-500 mt-4">Start free. Upgrade when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {name:'Free', price:'$0', features:['Up to 100 Contacts','CRM Dashboard','Basic Reporting','Email Support'], cta:'Start Free', highlight:false},
            {name:'Pro', price:'$29', features:['1,000 Contacts','Ecommerce Module','WhatsApp Integration','Priority Support','Billing Management'], cta:'Get Pro', highlight:true},
            {name:'Enterprise', price:'$99', features:['10,000+ Contacts','All Modules','AI Tools (coming)','Dedicated Manager','Custom Integrations'], cta:'Contact Us', highlight:false},
          ].map(plan => (
            <div key={plan.name} className={`rounded-3xl p-8 ${plan.highlight ? 'text-white shadow-2xl scale-105' : 'bg-white border border-gray-100 shadow-sm text-gray-900'}`} style={plan.highlight ? {background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'} : {}}>
              <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-70">{plan.name}</div>
              <div className="text-4xl font-extrabold mb-1">{plan.price}</div>
              <div className={`text-xs mb-6 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>per month</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`text-sm flex items-center gap-2 ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <span className={plan.highlight ? 'text-white' : 'text-green-500'}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`block text-center py-3 px-6 rounded-xl font-extrabold text-sm transition-all hover:scale-105 ${plan.highlight ? 'bg-white text-blue-700' : 'text-white'}`} style={!plan.highlight ? {background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'} : {}}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({name:'', email:'', message:''});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to a contact form API
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Get in touch</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-6">Let's talk about<br/>your business</h2>
            <p className="text-gray-500 leading-relaxed mb-8">Whether you're curious about our platform, need a custom digital solution, or want to build a mobile app — our team is ready to help.</p>

            <div className="space-y-6">
              {[
                {icon:'📧', label:'Email', value:'hello@bashanssas.com'},
                {icon:'📱', label:'WhatsApp', value:'+1 (555) 000-0000'},
                {icon:'🌐', label:'Website', value:'www.bashanssas.com'},
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">{c.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase">{c.label}</div>
                    <div className="text-sm font-bold text-gray-800">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-extrabold text-gray-900">Message sent!</h3>
                <p className="text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                  <input required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="you@company.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                  <textarea required rows={4} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder="How can we help?" value={form.message} onChange={e => setForm({...form, message:e.target.value})}/>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl text-white font-extrabold text-sm transition-all hover:scale-105 shadow-lg" style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold" style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}>B</div>
              <span className="text-white font-extrabold">Bashanssas</span>
            </div>
            <p className="text-xs leading-relaxed">The Business OS for modern companies. CRM, Ecommerce, Mobile & Digital Solutions.</p>
          </div>

          {[
            {title:'Platform', links:['CRM','Ecommerce','Billing','AI Tools (soon)']},
            {title:'Company', links:['About','Careers','Blog','Press']},
            {title:'Legal', links:['Privacy Policy','Terms of Service','Cookie Settings']},
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs font-bold text-white uppercase tracking-widest mb-4">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs">© 2026 Bashanssas. All rights reserved.</div>
          <div className="flex space-x-4">
            <Link href="/login" className="text-xs hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-xs hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="font-sans">
      <Navbar/>
      <HeroSection/>
      <ServicesSection/>
      <TechnologySection/>
      <AboutSection/>
      <PricingCTA/>
      <ContactSection/>
      <Footer/>
    </main>
  );
}
