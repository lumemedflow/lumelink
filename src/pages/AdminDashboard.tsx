import React, { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { BusinessProfile } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Edit2, Trash2, LogOut, Link as LinkIcon, QrCode, BarChart, MessageCircle, CheckCircle2, Download } from 'lucide-react';
import { formatTimeAgo, getDirectImageUrl } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ user }: { user: User }) {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<BusinessProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'analytics'>('profiles');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'profiles'));
    const unsub = onSnapshot(q, (snapshot) => {
      setProfiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BusinessProfile)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this profile?')) {
      await deleteDoc(doc(db, 'profiles', id));
    }
  };

  const defaultProfile: Omit<BusinessProfile, 'id'> = {
    slug: '',
    name: '',
    tagline: '',
    about: '',
    logoUrl: '',
    contact: {},
    social: {},
    services: [],
    gallery: [],
    verified: false,
    testimonials: [],
    offers: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    scanCount: 0,
    clickCounts: {}
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 text-zinc-400 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isCreating || editingProfile) {
    const current = editingProfile || defaultProfile;
    
    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const normalizedGallery = (current.gallery || []).map(url => getDirectImageUrl(url) || url).filter(Boolean);
        const normalizedLogoUrl = getDirectImageUrl(current.logoUrl) || current.logoUrl || '';
        const toSave = { ...current, gallery: normalizedGallery, logoUrl: normalizedLogoUrl, updatedAt: Date.now() };
        if (isCreating) {
          await addDoc(collection(db, 'profiles'), toSave);
        } else if (editingProfile?.id) {
          await updateDoc(doc(db, 'profiles', editingProfile.id), toSave);
        }
        setIsCreating(false);
        setEditingProfile(null);
      } catch (err) {
        console.error("Save error", err);
        alert("Failed to save profile. Ensure you have admin rights.");
      }
    };

    return (
      <div className="min-h-screen bg-zinc-950 p-6 md:p-12 text-zinc-100">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-zinc-900 ring-1 ring-zinc-800 p-4 rounded-xl">
            <h1 className="text-xl font-medium">{isCreating ? 'New Profile' : 'Edit Profile'}</h1>
            <button onClick={() => { setIsCreating(false); setEditingProfile(null); }} className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700">Back</button>
          </div>
          
          <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Company Name</label>
                <input 
                  required
                  type="text" 
                  value={current.name} 
                  onChange={e => setEditingProfile({ ...current, name: e.target.value })} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-zinc-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">URL Slug</label>
                <input 
                  required
                  type="text" 
                  value={current.slug} 
                  onChange={e => setEditingProfile({ ...current, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-zinc-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Tagline</label>
              <input 
                type="text" 
                value={current.tagline} 
                onChange={e => setEditingProfile({ ...current, tagline: e.target.value })} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-zinc-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Logo URL (Direct Drive Link or Image URL)</label>
              <input 
                type="url" 
                value={current.logoUrl} 
                onChange={e => setEditingProfile({ ...current, logoUrl: e.target.value })} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 outline-none"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Gallery Image URLs</label>
              {(current.gallery || []).map((img, idx) => (
                <div key={`gallery-${idx}`} className="flex items-center gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={e => {
                      const updatedGallery = [...(current.gallery || [])];
                      updatedGallery[idx] = e.target.value;
                      setEditingProfile({ ...current, gallery: updatedGallery });
                    }}
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-zinc-600 outline-none"
                    placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedGallery = [...(current.gallery || [])];
                      updatedGallery.splice(idx, 1);
                      setEditingProfile({ ...current, gallery: updatedGallery });
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                    aria-label="Remove gallery image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEditingProfile({ ...current, gallery: [...(current.gallery || []), ''] })}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full transition"
              >
                <Plus className="w-4 h-4" />
                Add Gallery Image
              </button>
              <p className="text-xs text-zinc-500 mt-2">Use public image URLs or Google Drive share links. Add one image link at a time and tap + to add another.</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <label className="block text-sm text-zinc-400 mb-1">About</label>
                <textarea 
                  rows={4}
                  value={current.about} 
                  onChange={e => setEditingProfile({ ...current, about: e.target.value })} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 focus:ring-1 focus:ring-zinc-600 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={current.verified || false}
                    onChange={e => setEditingProfile({ ...current, verified: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-950 text-sky-400 focus:ring-sky-400"
                  />
                  <span>Verified badge</span>
                </label>
              </div>
            </div>

            <h3 className="text-lg font-medium border-b border-zinc-800 pb-2 mt-8">Contact Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Phone" value={current.contact.phone || ''} onChange={e => setEditingProfile({ ...current, contact: { ...current.contact, phone: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="email" placeholder="Email" value={current.contact.email || ''} onChange={e => setEditingProfile({ ...current, contact: { ...current.contact, email: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="text" placeholder="WhatsApp (with country code)" value={current.contact.whatsapp || ''} onChange={e => setEditingProfile({ ...current, contact: { ...current.contact, whatsapp: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="text" placeholder="Address" value={current.contact.address || ''} onChange={e => setEditingProfile({ ...current, contact: { ...current.contact, address: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="text" placeholder="Google Maps Embed URL or iframe" value={current.contact.mapUrl || ''} onChange={e => {
                const val = e.target.value;
                const srcMatch = val.match(/src="([^"]+)"/);
                setEditingProfile({ ...current, contact: { ...current.contact, mapUrl: srcMatch ? srcMatch[1] : val } });
              }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 col-span-2" />
              <input type="url" placeholder="Website" value={current.contact.website || ''} onChange={e => setEditingProfile({ ...current, contact: { ...current.contact, website: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              
              <div className="col-span-2 mt-4"><h3 className="text-white/60 text-sm">Social & Connect</h3></div>
              <input type="url" placeholder="Google My Business URL" value={current.social?.gmb || ''} onChange={e => setEditingProfile({ ...current, social: { ...current.social, gmb: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="url" placeholder="JustDial URL" value={current.social?.justdial || ''} onChange={e => setEditingProfile({ ...current, social: { ...current.social, justdial: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="url" placeholder="Facebook URL" value={current.social?.facebook || ''} onChange={e => setEditingProfile({ ...current, social: { ...current.social, facebook: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="url" placeholder="Instagram URL" value={current.social?.instagram || ''} onChange={e => setEditingProfile({ ...current, social: { ...current.social, instagram: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="url" placeholder="LinkedIn URL" value={current.social?.linkedin || ''} onChange={e => setEditingProfile({ ...current, social: { ...current.social, linkedin: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
              <input type="url" placeholder="YouTube URL" value={current.social?.youtube || ''} onChange={e => setEditingProfile({ ...current, social: { ...current.social, youtube: e.target.value } })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2" />
            </div>

            <button type="submit" className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 mt-8">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col hidden md:flex">
        <div className="flex flex-col mb-10 items-start">
          <img src="/lumelink.png" alt="LumeLink" className="h-14 w-auto object-contain" onError={e => e.currentTarget.style.display='none'} />
        </div>
        <div className="space-y-2 flex-1">
           <button onClick={() => setActiveTab('profiles')} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'profiles' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Profiles</button>
           <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${activeTab === 'analytics' ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Analytics (Pro)</button>
        </div>
        <div className="mt-auto border-t border-zinc-800 pt-4">
          <div className="text-xs text-zinc-500 mb-4 truncate">{user.email}</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="md:hidden flex justify-between items-center mb-8">
          <div className="flex flex-col items-start">
            <img src="/lumelink.png" alt="LumeLink" className="h-10 w-auto object-contain" onError={e => e.currentTarget.style.display='none'} />
          </div>
          <button onClick={handleLogout} className="p-2 bg-zinc-800 rounded-md">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {activeTab === 'analytics' ? (
          <div>
            <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-3xl font-medium tracking-tight mb-1">Analytics Dashboard</h2>
                <p className="text-zinc-500 text-sm">Monitor your profile performance metrics.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-zinc-400 mb-4"><span className="p-2 bg-white/5 rounded-lg"><BarChart className="w-5 h-5"/></span></div>
                <p className="text-zinc-500 text-sm mb-1 uppercase tracking-wider font-semibold">Total Profiles</p>
                <p className="text-5xl font-light text-white">{profiles.length}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-zinc-400 mb-4"><span className="p-2 bg-white/5 rounded-lg"><QrCode className="w-5 h-5"/></span></div>
                <p className="text-zinc-500 text-sm mb-1 uppercase tracking-wider font-semibold">Total Views / Scans</p>
                <p className="text-5xl font-light text-white">{profiles.reduce((sum, p) => sum + (p.scanCount || 0), 0)}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 text-zinc-400 mb-4"><span className="p-2 bg-white/5 rounded-lg"><LinkIcon className="w-5 h-5"/></span></div>
                <p className="text-zinc-500 text-sm mb-1 uppercase tracking-wider font-semibold">Global Clicks</p>
                <p className="text-5xl font-light text-white">
                  {profiles.reduce((sum: number, p) => {
                    let internalSum = 0;
                    Object.values(p.clickCounts || {}).forEach((v: any) => internalSum += Number(v));
                    return sum + internalSum;
                  }, 0)}
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-medium tracking-tight mb-6">Per-Profile Performance</h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 text-sm">
                        <th className="font-medium p-4 bg-zinc-950/50">Business Name</th>
                        <th className="font-medium p-4 bg-zinc-950/50">Slug</th>
                        <th className="font-medium p-4 bg-zinc-950/50 text-right">Views / Scans</th>
                        <th className="font-medium p-4 bg-zinc-950/50 text-right">Link Clicks</th>
                        <th className="font-medium p-4 bg-zinc-950/50 text-right">Updated</th>
                        <th className="font-medium p-4 bg-zinc-950/50 text-center">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {profiles.map(p => {
                        const totalClicks = Object.values(p.clickCounts || {}).reduce((a, b) => Number(a) + Number(b), 0);
                        return (
                          <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="p-4 font-medium text-white flex items-center gap-2">
                              {p.name}
                              {p.verified && <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-1 text-xs text-sky-300"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>}
                            </td>
                            <td className="p-4 text-zinc-400 font-mono text-sm">/{p.slug}</td>
                            <td className="p-4 text-right text-white font-medium">{p.scanCount || 0}</td>
                            <td className="p-4 text-right text-white font-medium">{totalClicks}</td>
                            <td className="p-4 text-right text-zinc-400 text-sm">{formatTimeAgo(p.updatedAt || 0)}</td>
                            <td className="p-4 text-center">
                              <a 
                                href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here are the latest performance metrics for your digital business card (LumeLink):\n\nCompany: ${p.name}\n\n👁 Total Views: ${p.scanCount || 0}\n🖱 Total Link Clicks: ${totalClicks}\n\nCheck it out here: ${window.location.origin}/p/${p.slug}`)}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors"
                                title="Share via WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                      {profiles.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500">No profiles generated yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-3xl font-medium tracking-tight mb-1">Client Profiles</h2>
                <p className="text-zinc-500 text-sm">Manage all business profiles and QR codes.</p>
              </div>
              <button 
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-white text-zinc-950 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Client</span>
              </button>
            </div>

            {profiles.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
                <p className="text-zinc-500 mb-4">No profiles created yet.</p>
                <button onClick={() => setIsCreating(true)} className="text-white hover:underline text-sm font-medium">Create your first profile</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map(p => (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-6 align-top">
                      <div>
                        <h3 className="font-medium text-lg leading-tight mb-1">{p.name}</h3>
                        <p className="text-xs text-zinc-500 font-mono">/{p.slug}</p>
                      </div>
                      <div className="bg-white p-1 rounded min-w-[64px] min-h-[64px] shrink-0 border border-zinc-800">
                         <QRCodeSVG value={`${window.location.origin}/p/${p.slug}`} size={56} bgColor="#ffffff" fgColor="#000000" />
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditingProfile(p)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <LinkIcon className="w-4 h-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const svg = document.getElementById(`qr-download-${p.slug}`) as SVGSVGElement | null;
                            if (!svg) return;
                            const svgData = new XMLSerializer().serializeToString(svg);
                            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${p.slug || 'lumeqr'}-dark.svg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Download dark theme QR"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <a 
                          href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here are the latest performance metrics for your digital business card (LumeLink):\n\n👁 Total Views: ${p.scanCount || 0}\n🖱 Total Clicks: ${Object.values(p.clickCounts || {}).reduce((a,b)=> Number(a) + Number(b), 0)}\n\nCheck it out here: ${window.location.origin}/p/${p.slug}`)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 text-zinc-400 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors" 
                          title="Share Metrics via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                      <button onClick={() => handleDelete(p.id!)} className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="sr-only">
                      <QRCodeSVG id={`qr-download-${p.slug}`} value={`${window.location.origin}/p/${p.slug}`} size={256} bgColor="#000000" fgColor="#ffffff" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
