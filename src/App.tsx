import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import PublicProfile from './pages/PublicProfile';
import DemoProfile from './pages/DemoProfile';

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
    </Routes>
  );
}
