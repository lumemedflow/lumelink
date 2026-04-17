import React, { useState, useRef, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { ArrowRight, ShieldCheck, CheckCircle2, MessageCircle, X, Send } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

const AI_RESPONSES = [
  { match: (text: string) => text.toLowerCase().includes('price') || text.toLowerCase().includes('cost'), reply: "LumeLink offers premium plans crafted for professionals. Setup starts at just $99. Would you like to connect with sales on WhatsApp?" },
  { match: (text: string) => text.toLowerCase().includes('how') || text.toLowerCase().includes('work'), reply: "It's simple: we design your glassmorphic profile, link your details, and provide you with a custom QR code. When scanned, it opens your premium profile instantly." },
  { match: (text: string) => text.toLowerCase().includes('hi') || text.toLowerCase().includes('hello') || text.toLowerCase().includes('hey'), reply: "Hello! I'm the LumeLink Assistant. How can I help elevate your digital presence today?" },
  { match: () => true, reply: "I'm a predefined assistant. I can help answer common questions about LumeLink's features, pricing, and setup. Please ask me about these topics, or contact our team directly for detailed support!" }
];

export default function Landing({ user }: { user: User | null }) {
  const navigate = useNavigate();
  
  // Parallax Effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // AI Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hi there! Experience the future of networking. Ask me anything about LumeLink.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');

    // Simulate AI response delay
    setTimeout(() => {
      const response = AI_RESPONSES.find(r => r.match(userMessage))?.reply || AI_RESPONSES[AI_RESPONSES.length - 1].reply;
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 600);
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err) {
      console.error('Super Admin login failed:', err);
      alert('Sign-in failed. Please allow popups and try again, or check your browser security settings.');
    }
  };

  const faqs = [
    { q: "How does LumeLink work?", a: "LumeLink provides a premium, easily shareable digital business card accessible via a simple QR code or link, eliminating the need for physical cards." },
    { q: "Do my clients need an app to view my profile?", a: "No! Your profile opens instantly in any standard web browser on any device." },
    { q: "Can I track how many people view my card?", a: "Yes, our dashboard provides detailed analytics on profile views and interactions like clicks on WhatsApp or Social links." },
    { q: "Is the design customizable?", a: "Your profile is built on our high-conversion, premium glassmorphism template, customized with your branding, gallery, and details." },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] relative font-sans overflow-x-hidden overflow-y-auto">
      {/* Background Gradients from design */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 80% 20%, rgba(60, 60, 80, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(40, 20, 20, 0.2) 0%, transparent 40%)
          `
        }}
      />

      {/* Glossy Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-[1200px] mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-[20px] px-6 py-3 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
           <img src="/lumelink.png" alt="LumeLink" className="h-8 sm:h-12 w-auto object-contain" onError={e => e.currentTarget.style.display='none'} />
           <div className="flex items-center gap-4">
             {user ? (
               <button type="button" onClick={() => navigate('/admin')} className="text-sm font-medium text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-full">Dashboard</button>
             ) : (
               <button type="button" onClick={handleLogin} className="text-sm font-medium text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-full">Super Admin</button>
             )}
             <a href="https://wa.me/9154276077" target="_blank" rel="noreferrer" className="text-sm font-semibold bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-full transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">Get LumeLink</a>
           </div>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-start p-6 pt-32 md:pt-40 min-h-[100dvh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-center lg:min-h-[700px]"
        >
          {/* Marketing Info */}
          <div className="lg:pl-10">
            <motion.div 
              className="mb-10 inline-block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="/lumelink.png" alt="LumeLink" className="h-20 sm:h-28 w-auto object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]" onError={e => e.currentTarget.style.display='none'} />
            </motion.div>
            <h1 className="text-5xl lg:text-[82px] font-light leading-[0.9] mb-6 tracking-[-2px] flex flex-wrap gap-x-3 gap-y-2">
              {["One", "Scan.", "Full", "Presence."].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: [0.2, 0.65, 0.3, 0.9] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p className="text-lg lg:text-[20px] text-[rgba(255,255,255,0.5)] mb-8 font-light text-balance leading-tight">
            Elevate your digital first impression with<br/>high-fidelity smart business profiles.
          </p>

          <div className="flex flex-col gap-3 mb-12">
            <div className="flex items-center gap-3 text-white/70 text-sm"><CheckCircle2 className="w-5 h-5 text-white" /> Share your contact instantly via QR Code</div>
            <div className="flex items-center gap-3 text-white/70 text-sm"><CheckCircle2 className="w-5 h-5 text-white" /> Convert leads with integrated WhatsApp & Maps</div>
            <div className="flex items-center gap-3 text-white/70 text-sm"><CheckCircle2 className="w-5 h-5 text-white" /> High-conversion premium aesthetic design template</div>
          </div>

          <div className="flex gap-[20px] items-end">
             <div className="hidden sm:block">
              <div className="w-[140px] h-[140px] p-3 bg-white rounded-[16px] mb-3 flex items-center justify-center">
                 <QRCodeSVG value={window.location.origin + '/demo'} size={116} />
              </div>
              <p className="text-[12px] text-[rgba(255,255,255,0.5)] text-center">Scan to Preview Demo</p>
            </div>

            <div className="pb-7 w-full sm:w-auto">
              {user ? (
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full sm:w-auto px-6 py-4 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] font-medium transition-all flex items-center justify-center gap-2"
                >
                  Go to Admin
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleLogin}
                  className="w-full sm:w-auto px-6 py-4 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] font-medium transition-all flex items-center justify-center gap-2 text-[14px]"
                >
                  <ShieldCheck className="w-5 h-5 text-white/70" />
                  Super Admin Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Phone Frame from design for Landing */}
        <div className="hidden lg:block w-[360px] h-[680px] bg-black rounded-[48px] p-[10px] relative shadow-[0_0_0_2px_#333,0_30px_60px_rgba(0,0,0,0.8)] border border-[#222]">
           <div className="w-full h-full bg-[#0a0a0a] rounded-[40px] overflow-hidden relative flex flex-col items-center">
             <div className="w-[120px] h-[24px] bg-black absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[16px] z-50"></div>
             <div className="w-full absolute top-0 flex justify-between px-[30px] pt-[14px] text-[12px] font-semibold text-white/80 shrink-0 z-40 bg-gradient-to-b from-black/80 to-transparent pb-4">
               <span>9:41</span>
               <div className="flex gap-1.5 items-center"><div className="w-3 h-3 bg-white/80 rounded-full" /></div>
             </div>
             
             <motion.div 
               animate={{ y: [0, -380, 0] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
               className="w-full relative px-6 pt-[80px] pb-[100px]"
             >
               <div className="text-center">
                  <div className="w-[64px] h-[64px] bg-gradient-to-br from-[#eee] to-[#666] rounded-[20px] mx-auto mb-4"></div>
                  <h2 className="text-[22px] font-semibold mb-1">Aura Studio</h2>
                  <p className="text-[13px] text-[rgba(255,255,255,0.5)]">Architectural Design & Visualization</p>
               </div>

               <div className="grid grid-cols-2 gap-[10px] mt-6 w-full">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] py-3 px-1 rounded-[12px] text-center text-[12px] text-white">Call Now</div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] py-3 px-1 rounded-[12px] text-center text-[12px] text-white">WhatsApp</div>
               </div>
               
               <div className="w-full h-32 mt-6 rounded-[20px] overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=500&q=80" alt="Map Demo" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="px-3 py-1 bg-black/60 rounded-full text-[10px] backdrop-blur-md">Interactive Map Embed</div>
                  </div>
               </div>

               <div className="w-full text-left mt-8">
                 <div className="text-[11px] uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] pb-[8px]">Services</div>
                 <div className="flex flex-col gap-3 w-full">
                   <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] p-4 rounded-[16px]">
                      <h4 className="text-[14px] mb-1">Interior Design</h4>
                      <p className="text-[11px] text-[rgba(255,255,255,0.5)]">Residential & Commercial</p>
                   </div>
                   <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] p-4 rounded-[16px]">
                      <h4 className="text-[14px] mb-1">3D Rendering</h4>
                      <p className="text-[11px] text-[rgba(255,255,255,0.5)]">High-fidelity visuals</p>
                   </div>
                 </div>
               </div>

               <div className="w-full text-left mt-8">
                 <div className="text-[11px] uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] pb-[8px]">Social</div>
                 <div className="flex flex-col gap-2 w-full">
                   <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] p-3 rounded-[16px] flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                      <div className="flex-1 space-y-1">
                        <div className="w-20 h-2 bg-white/20 rounded-full"></div>
                        <div className="w-32 h-2 bg-white/10 rounded-full"></div>
                      </div>
                   </div>
                   <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] p-3 rounded-[16px] flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                      <div className="flex-1 space-y-1">
                        <div className="w-24 h-2 bg-white/20 rounded-full"></div>
                        <div className="w-28 h-2 bg-white/10 rounded-full"></div>
                      </div>
                   </div>
                 </div>
               </div>

             </motion.div>
             
             <div className="absolute bottom-[24px] left-[24px] right-[24px] h-[64px] bg-[rgba(20,20,20,0.8)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[32px] flex items-center justify-around px-4">
                <div className="w-8 h-8 rounded-full bg-white opacity-90"></div>
                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]"></div>
                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]"></div>
                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]"></div>
             </div>
           </div>
        </div>
      </motion.div>

      {/* Founders Section with Parallax */}
      <div className="w-full max-w-[1000px] mt-32 mb-24 z-10 relative"
           onMouseMove={handleMouseMove}
           onMouseLeave={handleMouseLeave}
           style={{ perspective: 2000 }}
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl font-light tracking-tight mb-16"
        >
          The Visionaries Behind LumeLink
        </motion.h2>
         <motion.div 
           style={{ rotateX, rotateY }}
           className="grid grid-cols-1 md:grid-cols-2 gap-8 transform-style-3d"
         >
             {/* Founder 1 */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               style={{ transform: "translateZ(30px)" }}
               className="p-[2px] rounded-[32px] bg-gradient-to-br from-rose-200/80 via-white/40 to-transparent shadow-[0_0_50px_rgba(250,200,200,0.15)]"
             >
               <div className="bg-gradient-to-br from-[#1a1414]/90 to-[#0a0505]/95 backdrop-blur-3xl rounded-[30px] p-8 h-full border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-white/5 z-0 pointer-events-none"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-6 mb-6">
                     <img src="/dwarakamayi.jpg" alt="Dwarakamayi" className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] object-cover ring-2 ring-rose-200/40 shadow-[0_0_20px_rgba(250,200,200,0.2)]" />
                     <div>
                       <h3 className="text-2xl font-light text-rose-100">Dwarakamayi</h3>
                       <p className="text-[12px] sm:text-sm text-rose-200/60 mt-1 uppercase tracking-widest font-semibold">Founder & CEO</p>
                     </div>
                   </div>
                   <p className="text-white/80 font-light leading-relaxed">
                     "Our mission is to revolutionize digital interactions. LumeLink is designed to give every professional a platinum-grade presence that not only looks stunning but drives genuine connections and growth."
                   </p>
                 </div>
               </div>
             </motion.div>
             
             {/* Founder 2 */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="p-[2px] rounded-[32px] bg-gradient-to-br from-zinc-300/80 via-white/40 to-transparent shadow-[0_0_50px_rgba(200,200,200,0.1)]"
             >
               <div className="bg-gradient-to-br from-[#151515]/90 to-[#050505]/95 backdrop-blur-3xl rounded-[30px] p-8 h-full border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500/5 via-transparent to-white/5 z-0 pointer-events-none"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-6 mb-6">
                     <img src="/anuroop.png" alt="Anuroop" className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] object-cover ring-2 ring-zinc-200/40 shadow-[0_0_20px_rgba(200,200,200,0.2)]" />
                     <div>
                       <h3 className="text-2xl font-light text-white">Anuroop</h3>
                       <p className="text-[12px] sm:text-sm text-zinc-400 mt-1 uppercase tracking-widest font-semibold">Co-Founder</p>
                     </div>
                   </div>
                   <p className="text-white/80 font-light leading-relaxed">
                     "We engineered LumeLink from the ground up to be seamless. Every touchpoint is optimized for performance, ensuring your digital business card loads instantly and impresses universally."
                   </p>
                 </div>
               </div>
             </motion.div>
         </motion.div>
      </div>

      {/* FAQ & Trust Section */}
      <div className="w-full max-w-[800px] mt-16 mb-24 z-10 relative px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            Vetted & Trusted Premium Platform
          </div>
          <h2 className="text-3xl font-light tracking-tight">Frequently Asked Questions</h2>
        </motion.div>
        
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[rgba(255,255,255,0.02)] border border-[#333] hover:border-[#555] transition-colors rounded-[16px] p-6"
            >
              <h4 className="text-lg font-medium text-white/90 mb-2">{faq.q}</h4>
              <p className="text-white/50 text-[14px] leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer / Terms */}
      <div className="w-full text-center py-8 z-10 relative border-t border-white/5 mt-auto">
        <p className="text-white/30 text-xs">© 2026 LumeLink. All rights reserved. <br className="sm:hidden" /> Terms and conditions apply.</p>
      </div>

      {/* Fake AI Assistant Floating Chat */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
             <motion.div
               initial={{ opacity: 0, y: 20, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               className="absolute bottom-16 right-0 w-[300px] sm:w-[350px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden mb-4"
             >
               <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-white/20 flex flex-col items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-white"></div>
                   </div>
                   <div>
                     <h4 className="text-sm font-medium text-white">LumeLink AI</h4>
                     <p className="text-[10px] text-white/70">Online</p>
                   </div>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="text-white/50 hover:text-white transition">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="flex-1 p-4 h-[300px] overflow-y-auto flex flex-col gap-3 scrollbar-hide">
                 {messages.map((m, i) => (
                   <div key={i} className={`max-w-[85%] rounded-[16px] px-4 py-3 text-[13px] leading-relaxed ${
                     m.role === 'ai' 
                       ? 'bg-white/10 text-white/90 self-start rounded-tl-none' 
                       : 'bg-white text-black self-end rounded-tr-none font-medium'
                   }`}>
                     {m.text}
                   </div>
                 ))}
                 <div ref={chatEndRef} />
               </div>

               <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
                 <input
                   type="text"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   placeholder="Ask about LumeLink..."
                   className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50"
                 />
                 <button type="submit" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition shrink-0 transition-transform active:scale-95 disabled:opacity-50" disabled={!inputValue.trim()}>
                   <Send className="w-4 h-4 ml-[2px]" />
                 </button>
               </form>
             </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      </div>
    </div>
  );
}
