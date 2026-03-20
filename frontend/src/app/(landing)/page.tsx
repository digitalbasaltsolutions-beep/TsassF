'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue
} from 'framer-motion';
import { 
  Users, 
  Layers, 
  ShoppingCart, 
  Rocket, 
  Shield, 
  Zap, 
  ArrowRight,
  ChevronDown,
  Globe,
  Layout,
  MessageSquare,
  Smartphone,
  Star,
  Activity,
  Cpu
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Hook for Mouse Parallax
function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) / 25;
      const moveY = (clientY - window.innerHeight / 2) / 25;
      x.set(moveX);
      y.set(moveY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return { x, y };
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { x, y } = useMouseParallax();

  return (
    <div ref={containerRef} className="relative bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Theatrical Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <motion.div 
           style={{ x: useTransform(x, (v) => v * -1.5), y: useTransform(y, (v) => v * -1.5) }}
           className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" 
         />
         <motion.div 
           style={{ x: useTransform(x, (v) => v * 1.5), y: useTransform(y, (v) => v * 1.5) }}
           className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" 
         />
         <div className="absolute inset-0 bg-[#020617] opacity-40 mix-blend-multiply" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <Navbar />

      <main className="relative z-10 perspective-[3000px]">
        {/* HERO: TOP-DOWN ENTRANCE */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-6 py-32 overflow-hidden sticky top-0">
          <motion.div 
            initial={{ y: -200, opacity: 0, rotateX: -30 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ x, y, transformStyle: "preserve-3d" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-12 backdrop-blur-md"
            >
              <Star className="w-3 h-3 fill-current" />
              The Future of Business is Here
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-white">
              <motion.span 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="block"
              >BASHANSSAS</motion.span>
              <motion.span 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
              >PLATFORM OS</motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, z: -100 }}
              animate={{ opacity: 1, z: 0 }}
              transition={{ delay: 1.1 }}
              className="text-lg md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed"
            >
              Aggressive, 3D, and uncompromisingly professional. 
              The theatrical reveal of your company's next evolution.
            </motion.p>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <Link href="/register" className="group relative px-10 py-5 bg-blue-600 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40 active:scale-95">
                <span className="relative z-10 flex items-center gap-3">
                  Join Now <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
              <Link href="#solutions" className="px-10 py-5 rounded-2xl font-black text-xl border-2 border-white/10 hover:bg-white/5 transition-all backdrop-blur-md active:scale-95">
                The Gallery
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 1: CRM - LEFT REVEAL WITH ROTATION */}
        <RevealSection id="solutions" direction="left" color="bg-blue-600">
           <div className="md:w-1/2 flex flex-col items-start gap-8">
              <div className="p-4 bg-blue-500/20 rounded-3xl border border-blue-500/30">
                 <Users className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">PROFESSIONAL <br /> CRM SYSTEM.</h2>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-md">Our dark-themed CRM doesn't just manage data; it presents a theatrical view of your client relationships in 3D depth.</p>
              <Link href="/crm" className="text-blue-400 font-black text-lg flex items-center gap-2 group">
                Explore CRM <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
           <div className="md:w-1/2 relative">
              <motion.div 
                whileHover={{ rotateY: 15, rotateX: -5 }}
                className="w-full aspect-video bg-zinc-900 rounded-[3rem] border border-white/10 shadow-3xl shadow-blue-500/20 flex items-center justify-center relative overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                 <Layout className="w-24 h-24 text-blue-500 opacity-40 group-hover:scale-110 transition-transform duration-700" />
                 {/* Internal elements flying */}
                 <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 left-10 w-24 h-12 bg-zinc-800 rounded-xl" />
                 <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-10 right-10 w-32 h-12 bg-zinc-800 rounded-xl" />
              </motion.div>
           </div>
        </RevealSection>

        {/* SECTION 2: ECOMMERCE - RIGHT REVEAL WITH ROTATION */}
        <RevealSection direction="right" color="bg-purple-600">
           <div className="md:w-1/2 order-2 md:order-1 relative">
              <motion.div 
                whileHover={{ rotateY: -15, rotateX: 5 }}
                className="w-full aspect-video bg-zinc-900 rounded-[3rem] border border-white/10 shadow-3xl shadow-purple-500/20 flex items-center justify-center relative overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent" />
                 <ShoppingCart className="w-24 h-24 text-purple-500 opacity-40 group-hover:scale-110 transition-transform duration-700" />
                 {/* Icons floating around center */}
                 <motion.div animate={{ x: [0, 20, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-10 right-10 w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-400" />
                 </motion.div>
              </motion.div>
           </div>
           <div className="md:w-1/2 order-1 md:order-2 flex flex-col items-start gap-8">
              <div className="p-4 bg-purple-500/20 rounded-3xl border border-purple-500/30">
                 <ShoppingCart className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">ECOMMERCE <br /> ENGINES.</h2>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-md">Scale your sales with a high-performance commerce engine. Elegant, fast, and uncompromisingly powerful.</p>
              <Link href="/ecommerce/products" className="text-purple-400 font-black text-lg flex items-center gap-2 group">
                Explore Ecom <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
           </div>
        </RevealSection>

        {/* SECTION 3: MOBILE APPS - BOTTOM REVEAL */}
        <RevealSection direction="bottom" color="bg-emerald-600">
           <div className="md:w-1/2 flex flex-col items-start gap-8">
              <div className="p-4 bg-emerald-500/20 rounded-3xl border border-emerald-500/30">
                 <Smartphone className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">MOBILE <br /> SOLUTIONS.</h2>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-md">Beautiful iOS and Android experiences tailored for your business. Fast, fluid, and perfectly native.</p>
              <div className="flex gap-4">
                 <div className="px-6 py-2 bg-zinc-900 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-emerald-400">iOS App</div>
                 <div className="px-6 py-2 bg-zinc-900 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-emerald-400">Android</div>
              </div>
           </div>
           <div className="md:w-1/2 flex justify-center">
              <motion.div 
                whileHover={{ y: -20, scale: 1.05 }}
                className="w-64 h-[500px] bg-zinc-900 rounded-[3rem] border border-white/10 shadow-3xl shadow-emerald-500/20 relative p-4 flex flex-col gap-4 overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/10 to-transparent" />
                 <div className="h-4 w-12 bg-zinc-800 mx-auto rounded-full" />
                 <div className="h-full w-full bg-zinc-800/50 rounded-2xl flex flex-col p-4 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-full bg-zinc-700/30 rounded-xl" />
                    ))}
                    <div className="mt-auto h-24 w-full bg-emerald-500/20 rounded-xl border border-emerald-500/30 p-2 overflow-hidden flex items-center justify-center">
                       <Activity className="w-8 h-8 text-emerald-400" />
                    </div>
                 </div>
              </motion.div>
           </div>
        </RevealSection>

        {/* THE FINAL WOW: LOGO EXPLOSION */}
        <div className="py-64 h-screen flex flex-col items-center justify-center relative bg-[#020617]/50 overflow-hidden">
           <motion.div 
             initial={{ scale: 0.5, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             transition={{ duration: 1 }}
             className="relative z-10 text-center"
           >
              <Cpu className="w-32 h-32 md:w-64 md:h-64 text-blue-600 opacity-20 mx-auto mb-12 animate-pulse" />
              <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none mb-12">TRANSFORM NOW</h2>
              <Link href="/register" className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black text-3xl hover:bg-blue-50 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:px-20 active:scale-95 duration-700 block mx-auto w-fit">
                START YOUR JOURNEY
              </Link>
           </motion.div>
           {/* Background orbs exploding */}
           <motion.div whileInView={{ scale: [1, 2, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute inset-0 bg-blue-600/30 blur-[200px] rounded-full" />
        </div>

        <Footer />
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group transition-transform hover:rotate-12">
          <Layout className="w-7 h-7 text-blue-600" />
        </div>
        <span className="text-2xl font-black tracking-tighter">BASHANSSAS</span>
      </div>
      <div className="flex items-center gap-8 pointer-events-auto bg-[#020617]/50 backdrop-blur-xl p-3 px-8 rounded-2xl border border-white/5 shadow-2xl">
        <Link href="#solutions" className="text-sm font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Solutions</Link>
        <Link href="/login" className="text-sm font-black text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Sign In</Link>
        <Link href="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function RevealSection({ children, direction = "left", color = "bg-blue-600", id }: { children: React.ReactNode, direction?: "left" | "right" | "bottom" | "top", color?: string, id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const initialX = direction === "left" ? -300 : direction === "right" ? 300 : 0;
  const initialY = direction === "top" ? -300 : direction === "bottom" ? 300 : 0;
  const rotateY = direction === "left" ? 45 : direction === "right" ? -45 : 0;
  const rotateX = direction === "top" ? 45 : direction === "bottom" ? -45 : 0;

  return (
    <section id={id} ref={ref} className="py-48 px-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-24 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ x: initialX, y: initialY, opacity: 0, rotateY, rotateX }}
        animate={isInView ? { x: 0, y: 0, opacity: 1, rotateY: 0, rotateX: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col md:flex-row items-center gap-24"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
      
      {/* Backlight on entry */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1.2 }}
            className={cn("absolute inset-0 blur-[200px] rounded-full pointer-events-none -z-10", color)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-32 px-12 border-t border-white/5 bg-[#020617] relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
       <div>
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-8 h-8 text-blue-500" />
            <span className="text-3xl font-black tracking-tighter">BASHANSSAS</span>
          </div>
          <p className="text-zinc-500 font-bold max-w-xs leading-relaxed">The high-stakes digital operating system for businesses that refuse to compromise.</p>
       </div>
       <div className="flex gap-16">
          <div className="flex flex-col gap-4">
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Platform</span>
             <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">CRM App</Link>
             <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Ecommerce</Link>
             <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Workflow</Link>
          </div>
          <div className="flex flex-col gap-4">
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Social</span>
             <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Twitter</Link>
             <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">LinkedIn</Link>
             <Link href="#" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Discord</Link>
          </div>
       </div>
       <p className="text-xs font-bold text-zinc-700 uppercase tracking-widest">© 2026 BASHANSSAS. <br /> Engineered for Power.</p>
    </footer>
  );
}
