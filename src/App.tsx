import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import PublicProfile from './pages/PublicProfile';
import DemoProfile from './pages/DemoProfile';

function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-semibold mb-4">Page not found</h1>
        <p className="text-zinc-400 mb-6">The profile or link you opened does not exist. Please check the URL or return to the home page.</p>
        <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-100 transition">Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-pulse w-12 h-12 rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/admin/*" element={user ? <AdminDashboard user={user} /> : <Navigate to="/" />} />
      <Route path="/p/:slug" element={<PublicProfile />} />
      <Route path="/demo" element={<DemoProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
