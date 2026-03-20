'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValueEvent } from 'framer-motion';
// Removed: @react-three/fiber, @react-three/drei, and three

// ─── 3D Components ────────────────────────────────────────────────────────────
// ─── Decorative Components ──────────────────────────────────────────────────
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest: number) => {
    setScrolled(latest > 30);
  });

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20' : 'bg-transparent'}`}
    >
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
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020B2D]">
      <AnimatedBackground />

      {/* Decorative Blobs */}
      <motion.div style={{ y: y1, willChange: 'transform' }} className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl" />
      <motion.div style={{ y: y2, willChange: 'transform' }} className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>

      <motion.div 
        style={{ opacity, willChange: 'transform, opacity' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 text-white text-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur-md"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"/>
          Now accepting new businesses — Start free today
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-extrabold leading-tight mb-8 tracking-tighter">
          The <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(90deg,#60A5FA,#A78BFA, #F472B6)'}}>Business OS</span><br/>
          built for growth
        </h1>

        <p className="text-xl md:text-2xl text-blue-100/80 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Bashanssas is a unified platform for CRM, Ecommerce, Mobile Development and Digital Solutions — everything your business needs under one roof.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register" className="px-10 py-5 rounded-2xl text-blue-900 font-extrabold text-lg bg-white hover:bg-gray-50 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all block">
              Start Free — No Credit Card
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href="#services" className="px-10 py-5 rounded-2xl font-extrabold text-lg border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all block">
              Explore Services ↓
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/30 text-xs gap-3 font-bold tracking-widest uppercase"
      >
        <span>Scroll</span>
        <div className="w-0.5 h-12 bg-gradient-to-b from-white/40 to-transparent"/>
      </motion.div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: '🤝', title: 'CRM Platform', desc: 'Manage contacts, track deals through your pipeline, and log every activity.', badge: 'Available Now', color: '#0A4BD4' },
  { icon: '🛍️', title: 'Ecommerce', desc: 'Launch your online store inside the platform. Manage products and track orders.', badge: 'Available Now', color: '#6C3AFF' },
  { icon: '📱', title: 'Mobile Apps', desc: 'Cross-platform iOS & Android apps built with the latest frameworks.', badge: 'Service', color: '#0891B2' },
  { icon: '💡', title: 'Digital Solutions', desc: 'Custom software, automation workflows, and cloud architecture solutions.', badge: 'Service', color: '#059669' },
  { icon: '🤖', title: 'AI Tools', desc: 'AI-powered lead scoring and smart recommendations for business decisions.', badge: 'Coming Soon', color: '#D97706' },
  { icon: '📢', title: 'Marketing', desc: 'WhatsApp campaigns and email automation connected to your CRM.', badge: 'Coming Soon', color: '#DC2626' },
];

function ServiceCard({ service, index }: { service: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2.5rem] p-10 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">{service.icon}</div>
      <div className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-tighter" style={{background:service.color+'15',color:service.color}}>{service.badge}</div>
      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{service.title}</h3>
      <p className="text-gray-500 text-base leading-relaxed font-medium">{service.desc}</p>
      
      <motion.div 
        className="mt-8 flex items-center text-sm font-bold gap-2 cursor-pointer"
        style={{ color: service.color }}
        whileHover={{ x: 5 }}
      >
        Learn more <span className="text-lg">→</span>
      </motion.div>
    </motion.div>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="py-32 bg-zinc-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-blue-600 font-black text-sm uppercase tracking-[0.3em]">Scalable Solutions</span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mt-4 tracking-tight">One Platform, Infinite Possibilities</h2>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">Our modules are designed to grow with your business, providing the tools you need at every stage.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Technology ───────────────────────────────────────────────────────────────
const TECHS = [
  {name:'NestJS',cat:'Backend'}, {name:'MongoDB',cat:'Database'}, {name:'Redis',cat:'Cache'},
  {name:'Next.js',cat:'Frontend'}, {name:'React',cat:'UI'}, {name:'TypeScript',cat:'Language'},
  {name:'Docker',cat:'DevOps'}, {name:'Stripe',cat:'Payments'}, {name:'JWT Auth',cat:'Security'},
];

function TechnologySection() {
  return (
    <section id="technology" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-purple-600 font-black text-sm uppercase tracking-widest">Built to scale</span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mt-4 mb-8">Enterprise-grade technology stack</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Built from the ground up with modern, production-proven technologies. Our architecture uses a Modular Monolith pattern that can seamlessly evolve into Microservices.
            </p>
            <ul className="space-y-4">
              {['Multi-tenant data isolation — every org sees only its own data','JWT authentication with refresh token rotation','Role-Based Access Control (RBAC)','Containerized deployment via Docker & Compose'].map(f => (
                <li key={f} className="flex items-start gap-4 text-gray-600 font-medium">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0 mt-1">✓</span> {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="grid grid-cols-3 gap-6 perspective-1000">
            {TECHS.map((t, i) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, rotateY: 45, translateZ: -100 }}
                whileInView={{ opacity: 1, rotateY: 0, translateZ: 0 }}
                whileHover={{ scale: 1.1, rotateY: 10, rotateX: 10, translateZ: 50 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-2xl hover:border-purple-200 transition-all cursor-default group"
              >
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-purple-500 transition-colors">{t.cat}</div>
                <div className="text-sm font-black text-gray-800">{t.name}</div>
              </motion.div>
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
    <section id="about" className="py-40 relative overflow-hidden" style={{background:'linear-gradient(135deg,#031B5B 0%,#0A4BD4 100%)'}}>
      <div className="max-w-7xl mx-auto px-6 text-white">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-300 font-black text-sm uppercase tracking-[0.4em]">Our Philosophy</span>
            <h2 className="text-5xl md:text-7xl font-black mt-4 mb-10 tracking-tight leading-none">Built by builders,<br/>for businesses</h2>
            <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
              <strong className="text-white">Bashanssas</strong> was founded with a simple mission: give every business access to the same powerful digital tools that large enterprises use.
            </p>
            <p className="text-blue-100/80 text-lg leading-relaxed">
              We believe technology should simplify operations, not complicate them. That's why we built a single platform where CRM, billing, ecommerce, and marketing all live together.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            {[
              {icon:'🌍', title:'Global Ready', desc:'Multi-language, multi-currency support designed for international teams.'},
              {icon:'🔒', title:'Secure by Default', desc:'End-to-end encryption, JWT tokens, and strict per-organization data isolation.'},
              {icon:'⚡', title:'Fast Setup', desc:'Register, set up your org, and start managing your business in under 5 minutes.'},
              {icon:'🧩', title:'Modular Growth', desc:'Activate only the modules you need today. Add more as you scale tomorrow.'},
            ].map((c, i) => (
              <motion.div 
                key={c.title}
                initial={{ opacity: 0, z: -50 }}
                whileInView={{ opacity: 1, z: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-6">{c.icon}</div>
                <h4 className="text-xl font-black text-white mb-2">{c.title}</h4>
                <p className="text-blue-200/70 text-sm leading-relaxed font-medium">{c.desc}</p>
              </motion.div>
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
    <section className="py-40 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight"
          >
            Simple, transparent pricing
          </motion.h2>
          <p className="text-gray-500 mt-6 text-xl">Start free. Upgrade when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {name:'Free', price:'$0', features:['Up to 100 Contacts','CRM Dashboard','Basic Reporting','Email Support'], cta:'Start Free', highlight:false},
            {name:'Pro', price:'$29', features:['1,000 Contacts','Ecommerce Module','WhatsApp Integration','Priority Support','Billing Management'], cta:'Get Pro', highlight:true},
            {name:'Enterprise', price:'$99', features:['10,000+ Contacts','All Modules','AI Tools (coming)','Dedicated Manager','Custom Integrations'], cta:'Contact Us', highlight:false},
          ].map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`rounded-[3rem] p-12 relative ${plan.highlight ? 'text-white shadow-[0_40px_100px_rgba(10,75,212,0.3)] z-10' : 'bg-white border border-gray-100 shadow-xl text-gray-900'}`} 
              style={plan.highlight ? {background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'} : {}}
            >
              {plan.highlight && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-black shadow-lg">MOST POPULAR</div>}
              <div className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-70">{plan.name}</div>
              <div className="text-6xl font-black mb-2">{plan.price}</div>
              <div className={`text-sm mb-10 font-bold ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>per month</div>
              <ul className="space-y-4 mb-12">
                {plan.features.map(f => (
                  <li key={f} className={`text-base flex items-center gap-3 font-semibold ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${plan.highlight ? 'bg-white text-blue-600' : 'bg-green-100 text-green-600'}`}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`block text-center py-5 px-8 rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-2xl ${plan.highlight ? 'bg-white text-blue-700' : 'text-white'}`} style={!plan.highlight ? {background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'} : {}}>{plan.cta}</Link>
            </motion.div>
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
    setSent(true);
  };

  return (
    <section id="contact" className="py-40 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-600 font-black text-sm uppercase tracking-widest">Get in touch</span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mt-4 mb-10 tracking-tight">Let's talk about<br/>your business</h2>
            <p className="text-gray-500 text-xl leading-relaxed mb-12">Whether you're curious about our platform, need a custom digital solution, or want to build a mobile app — our team is ready to help.</p>

            <div className="space-y-8">
              {[
                {icon:'📧', label:'Email', value:'hello@bashanssas.com', color:'bg-blue-50 text-blue-600'},
                {icon:'📱', label:'WhatsApp', value:'+1 (555) 000-0000', color:'bg-green-50 text-green-600'},
                {icon:'🌐', label:'Website', value:'www.bashanssas.com', color:'bg-purple-50 text-purple-600'},
              ].map(c => (
                <motion.div 
                  key={c.label} 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6"
                >
                  <div className={`w-16 h-16 rounded-[1.5rem] ${c.color} flex items-center justify-center text-3xl shadow-sm`}>{c.icon}</div>
                  <div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{c.label}</div>
                    <div className="text-xl font-black text-gray-800 tracking-tight">{c.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 border border-gray-100 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl -mr-32 -mt-32" />
            
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div 
                  key="sent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="text-8xl mb-6">🚀</div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Message sent!</h3>
                  <p className="text-gray-500 text-lg font-medium">Our strategic team will reach out<br/>within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  className="space-y-6 relative z-10"
                >
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                    <input required className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 text-base font-medium shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                    <input required type="email" className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 text-base font-medium shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="john@company.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Message</label>
                    <textarea required rows={4} className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-100 text-base font-medium shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none transition-all" placeholder="How can we help your growth?" value={form.message} onChange={e => setForm({...form, message:e.target.value})}/>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full py-5 rounded-[1.5rem] text-white font-black text-lg transition-all shadow-[0_20px_40px_rgba(10,75,212,0.3)] hover:shadow-[0_25px_50px_rgba(10,75,212,0.4)]" 
                    style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}
                  >
                    Send Message — Get Started
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 font-medium">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{background:'linear-gradient(135deg,#0A4BD4,#6C3AFF)'}}>B</div>
              <span className="text-white text-2xl font-black tracking-tighter">Bashanssas</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 pr-10">The ultimate Business OS for modern companies. Unified CRM, Ecommerce, Mobile & Digital leadership.</p>
            <div className="flex space-x-4">
              {['𝕏','in','fb','ig'].map(s => (
                <motion.div key={s} whileHover={{ y: -3, color: '#fff' }} className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-sm font-black cursor-pointer transition-colors">{s}</motion.div>
              ))}
            </div>
          </div>

          {[
            {title:'Platform', links:['CRM Analytics','Global Ecommerce','Cloud Invoicing','AI Automation']},
            {title:'Company', links:['About Our Vision','Open Careers','Industry Blog','Press Inquiries']},
            {title:'Support', links:['Help Center','Developer Docs','API Status','Security Policy']},
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8">{col.title}</div>
              <ul className="space-y-4">
                {col.links.map(l => <li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs font-bold tracking-widest text-gray-500 uppercase">© 2026 Bashanssas Global. Precision Built.</div>
          <div className="flex space-x-8">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Join Now</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="font-sans antialiased text-gray-900 bg-white selection:bg-blue-100 overflow-x-hidden">
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
