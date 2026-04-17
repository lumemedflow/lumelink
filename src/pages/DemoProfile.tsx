import React, { useState } from 'react';
import { Share, Mail, Phone, ExternalLink, Navigation, MessageCircle, Map as MapIcon, Globe, Instagram, Facebook, Youtube, Linkedin, Tag, Compass } from 'lucide-react';
import { cn, getDirectImageUrl } from '../lib/utils';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const JustDialIcon = () => (
  <div className="flex items-center justify-center font-bold text-[#f77f00] tracking-tighter text-[15px] leading-none">jd</div>
);

export default function DemoProfile() {
  const [isSocialExpanded, setIsSocialExpanded] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  
  const profile = {
    slug: 'demo',
    name: "Aura Studio",
    tagline: "Architectural Design & Visualization",
    about: "We craft immersive spatial experiences and high-fidelity architectural visualizations for premium residential and commercial developments globally.",
    logoUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=256&h=256",
    contact: {
      phone: "+1234567890",
      whatsapp: "+1234567890",
      email: "hello@aurastudio.com",
      website: "https://aurastudio.com",
      address: "123 Design Avenue, Creative District, NY",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280006935!2d-74.1448301594916!3d40.69763123891461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1703623089606!5m2!1sen!2sus",
    },
    social: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
      justdial: "https://justdial.com",
      gmb: "https://business.google.com"
    },
    services: [
      {
        title: "Interior Design",
        description: "Full service luxury interior design for modern spaces.",
        price: "Custom"
      },
      {
        title: "3D Rendering",
        description: "High-fidelity architectural visualizations.",
        price: "From $500"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=500&q=80"
    ],
    offers: [
      {
        title: "Complimentary Consultation",
        description: "Schedule a free 30-minute discovery call to discuss your upcoming design project and vision."
      }
    ]
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: profile.name,
        text: profile.tagline,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Share error', err);
    }
  };

  const handleDownloadVCard = () => {
    alert("In a real app, this downloads the contact card directly to your phone.");
  };

  const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string, key?: React.Key }) => (
    <div className={cn("bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[16px] p-4 relative", className)}>
      {children}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-[#FFFFFF] flex items-center justify-center font-sans tracking-wide py-10">
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 80% 20%, rgba(60, 60, 80, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(40, 20, 20, 0.2) 0%, transparent 40%)
          `
        }}
      />
      
      {/* Mobile Mockup Frame */}
      <div className="w-full h-full min-h-[100dvh] sm:min-h-0 sm:w-[360px] sm:h-[680px] sm:bg-[#000] sm:rounded-[48px] sm:p-[10px] relative sm:shadow-[0_0_0_2px_#333,0_30px_60px_rgba(0,0,0,0.8)] z-10 transition-all">
        
        <div className="w-full h-full bg-[#0a0a0a] sm:rounded-[40px] overflow-y-auto overflow-x-hidden relative flex flex-col hide-scrollbar pb-[100px]">
          {/* Notch desktop only */}
          <div className="hidden sm:block w-[120px] h-[24px] bg-[#000] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[16px] z-50"></div>
          
          <div className="hidden sm:flex justify-between px-[30px] pt-[14px] text-[12px] font-semibold text-[#FFFFFF] opacity-80 shrink-0 sticky top-0 z-40 bg-[#0a0a0a]">
             <span>9:41</span>
             <div className="flex gap-[6px] items-center">
                <div className="w-2.5 h-2.5 bg-white/80 rounded-full" />
             </div>
          </div>

          <div className="px-6 pt-12 pb-6 text-center">
            {profile.logoUrl && (
               <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#eee] to-[#666] border border-[rgba(255,255,255,0.1)] rounded-[20px] mb-4 overflow-hidden">
                 <img src={getDirectImageUrl(profile.logoUrl)} alt={profile.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
               </div>
            )}
            <h1 className="text-[22px] font-semibold mb-1">{profile.name}</h1>
            <p className="text-[13px] text-[rgba(255,255,255,0.5)]">{profile.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 px-6 pb-6 mt-4">
            <a href={`tel:${profile.contact.phone}`} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] py-3 px-1 rounded-2xl text-center text-[13px] font-medium text-[#FFFFFF] hover:bg-white/20 transition flex items-center justify-center gap-2"><Phone className="w-4 h-4 text-zinc-300" /> Call</a>
            <a href={`https://wa.me/${profile.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] py-3 px-1 rounded-2xl text-center text-[13px] font-medium text-[#FFFFFF] hover:bg-white/20 transition flex items-center justify-center gap-2"><MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp</a>
            <a href={`mailto:${profile.contact.email}`} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] py-3 px-1 rounded-2xl text-center text-[12px] text-[#FFFFFF] hover:bg-white/10 transition flex items-center justify-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</a>
            <a href={profile.contact.website} target="_blank" rel="noreferrer" className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] py-3 px-1 rounded-2xl text-center text-[12px] text-[#FFFFFF] hover:bg-white/10 transition flex items-center justify-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</a>
          </div>

          {profile.contact.mapUrl && (
            <div className="px-6 mb-6">
              <div className="w-full h-32 rounded-[20px] overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <iframe 
                  src={profile.contact.mapUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full object-cover"
                ></iframe>
              </div>
            </div>
          )}

          <div className="px-6 mb-6">
            {profile.offers.map((offer, idx) => (
              <div key={idx} className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                <div className="absolute -top-2 -right-2 p-2 opacity-10"><Tag className="w-16 h-16 text-amber-500"/></div>
                <h4 className="text-amber-400 font-semibold text-[14px] mb-1">{offer.title}</h4>
                <p className="text-white/70 text-[12px] leading-relaxed relative z-10">{offer.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] px-6 pb-2">About</div>
            <div className="px-6 text-[13px] leading-relaxed text-[rgba(255,255,255,0.8)]">
              {profile.about}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] px-6 pb-2">Services</div>
            <div className="flex gap-3 px-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4">
              {profile.services.map((service, idx) => (
                <GlassCard key={idx} className="min-w-[140px] snap-center shrink-0">
                  <h4 className="text-[14px] mb-1">{service.title}</h4>
                  <p className="text-[11px] text-[rgba(255,255,255,0.5)] leading-relaxed">
                    {service.description}
                  </p>
                  {service.price && <p className="text-[12px] font-medium mt-2">{service.price}</p>}
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] px-6 pb-2">Recent Projects</div>
            <div className="flex gap-4 px-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4">
              {profile.gallery.map((img, idx) => {
                 const parsedImg = getDirectImageUrl(img);
                 if (!parsedImg) return null;
                 return <img key={idx} src={parsedImg} referrerPolicy="no-referrer" alt="" className="w-56 h-56 snap-center shrink-0 object-cover rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />;
              })}
            </div>
          </div>

          {/* Social Links Formatted */}
          <div className="mb-8 px-6">
            <div className="text-[11px] uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] pb-3">Connect With Us</div>
            <div className="flex flex-col gap-2">
               {(() => {
                 const socialLinks = [];
                 if (profile.social?.gmb) {
                   socialLinks.push({ id: 'gmb', url: profile.social.gmb, title: 'Google My Business', subtitle: 'Review us on Google', icon: <GoogleIcon /> });
                 }
                 if (profile.social?.justdial) {
                   socialLinks.push({ id: 'jd', url: profile.social.justdial, title: 'JustDial', subtitle: 'Find our business listing', icon: <JustDialIcon /> });
                 }
                 if (profile.social?.instagram) {
                   socialLinks.push({ id: 'ig', url: profile.social.instagram, title: 'Instagram', subtitle: 'Follow our visual journey', icon: <Instagram className="w-5 h-5 text-pink-500" /> });
                 }
                 if (profile.social?.facebook) {
                   socialLinks.push({ id: 'fb', url: profile.social.facebook, title: 'Facebook', subtitle: 'Like us on Facebook', icon: <Facebook className="w-5 h-5 text-blue-500" /> });
                 }
                 if (profile.social?.linkedin) {
                   socialLinks.push({ id: 'in', url: profile.social.linkedin, title: 'LinkedIn', subtitle: 'Professional network', icon: <Linkedin className="w-5 h-5 text-blue-400" /> });
                 }
                 if (profile.social?.youtube) {
                   socialLinks.push({ id: 'yt', url: profile.social.youtube, title: 'YouTube', subtitle: 'Watch our content', icon: <Youtube className="w-5 h-5 text-red-500" /> });
                 }

                 if (socialLinks.length === 0) return null;

                 const displayedSocials = isSocialExpanded ? socialLinks : socialLinks.slice(0, 3);

                 return (
                   <>
                     {displayedSocials.map(link => (
                       <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-3 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.08)] transition-all">
                         <div className="w-10 h-10 rounded-[12px] bg-white/5 flex items-center justify-center">{link.icon}</div>
                         <div className="flex-1 text-left">
                           <div className="text-[14px] font-medium text-white/90">{link.title}</div>
                           <div className="text-[12px] text-white/40">{link.subtitle}</div>
                         </div>
                         <ExternalLink className="w-4 h-4 text-white/30" />
                       </a>
                     ))}
                     
                     {socialLinks.length > 3 && (
                       <button 
                         onClick={() => setIsSocialExpanded(!isSocialExpanded)}
                         className="w-full mt-1 text-[12px] font-medium text-white/60 hover:text-white/90 transition-colors py-3 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5"
                       >
                         {isSocialExpanded ? 'Collapse' : `View All Links (${socialLinks.length})`}
                       </button>
                     )}
                   </>
                 );
               })()}
            </div>
          </div>

          <div className="w-full flex justify-center pb-8 pt-4">
             <img src="/lumelink.png" alt="Powered By LumeLink" className="h-10 w-auto object-contain" onError={e => e.currentTarget.style.display='none'} />
          </div>

          <button onClick={handleDownloadVCard} className="mx-6 mb-4 bg-[#FFFFFF] text-[#000000] py-[16px] rounded-[16px] text-center font-semibold text-[14px] leading-none hover:bg-opacity-90 transition-opacity">
            Save to Contacts
          </button>
          
          {/* CTA Footer Form */}
          <div className="mx-6 mb-24 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-[16px] p-5 text-center shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-pointer" onClick={() => !isFormExpanded && setIsFormExpanded(true)}>
             <h2 className="text-xl font-light text-white mb-1">Get Your Profile</h2>
             <h3 className="text-white/60 font-medium text-[13px] mb-4">Want a premium digital presence like this?</h3>
             {isFormExpanded ? (
               <form className="flex flex-col gap-2" onSubmit={(e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const name = formData.get('name');
                 const business = formData.get('business');
                 const text = `Hi, I am ${name} from ${business}. I want to get a premium LumeLink business profile like this!`;
                 window.open(`https://wa.me/9154276077?text=${encodeURIComponent(text)}`, '_blank');
               }}>
                  <input required type="text" name="name" placeholder="Your Name" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40" />
                  <input required type="text" name="business" placeholder="Business Name" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40" />
                  <button type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-2 rounded-lg text-sm transition-colors mt-2">
                    Get Started on WhatsApp
                  </button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setIsFormExpanded(false); }} className="text-white/40 mt-2 text-xs font-medium hover:text-white/80">Close</button>
               </form>
             ) : (
               <button onClick={() => setIsFormExpanded(true)} className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg text-sm transition-colors border border-white/10">
                 Tap to Enquire
               </button>
             )}
          </div>
          
        </div>
        
        <div className="fixed sm:absolute bottom-[24px] left-[24px] right-[24px] h-[64px] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-[32px] flex items-center justify-around px-4 z-50">
           <a href={`tel:${profile.contact.phone}`} className="w-[40px] h-[40px] rounded-full bg-white/5 flex flex-col items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition shadow-sm">
             <Phone className="w-[18px] h-[18px]" />
           </a>
           <a href={`https://wa.me/${profile.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-white/5 flex flex-col items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition shadow-sm">
             <MessageCircle className="w-[18px] h-[18px]" />
           </a>
           
           <button onClick={handleShare} className="w-[40px] h-[40px] rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.3)]">
             <Share className="w-[18px] h-[18px]" />
           </button>
           
           <a href={`https://maps.google.com/?q=${encodeURIComponent(profile.contact.address)}`} target="_blank" rel="noreferrer" className="w-[40px] h-[40px] rounded-full bg-white/5 flex flex-col items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition shadow-sm">
             <Navigation className="w-[18px] h-[18px]" />
           </a>
        </div>
      </div>
    </main>
  );
}
