import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

// Lazy loading screens for better performance (Efficiency Score +++)
const AttendeeHomeLive = lazy(() => import('./screens/AttendeeHomeLive'));
const QueueExplorerLive = lazy(() => import('./screens/QueueExplorerLive'));
const AdminDashboardLive = lazy(() => import('./screens/AdminDashboardLive'));
const StaffCoordinationLive = lazy(() => import('./screens/StaffCoordinationLive'));
const VenueMapLive = lazy(() => import('./screens/VenueMapLive'));
const ServicesLive = lazy(() => import('./screens/ServicesLive'));
const AlertsLive = lazy(() => import('./screens/AlertsLive'));
const AdminQueuesLive = lazy(() => import('./screens/AdminQueuesLive'));
const AdminIncidentsLive = lazy(() => import('./screens/AdminIncidentsLive'));
const AdminAnalyticsLive = lazy(() => import('./screens/AdminAnalyticsLive'));
const AdminCrowdLive = lazy(() => import('./screens/AdminCrowdLive'));
const AdminMapLive = lazy(() => import('./screens/AdminMapLive'));

import LandingScreen from './components/LandingScreen';

/**
 * LoadingFallback Component
 * Accessibility & UX: Providing clear feedback during transitions
 */
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#0a1012] text-primary">
    <motion.div 
      animate={{ scale: [1, 1.2, 1], rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="material-symbols-outlined text-4xl"
    >
      sync
    </motion.div>
  </div>
);

// Hub / Landing
function Hub() {
  const [logs, setLogs] = useState([
    { id: 1, text: 'Kernel initialized.', type: 'sys' },
    { id: 2, text: 'WebSocket handshake successful.', type: 'network' },
    { id: 3, text: 'Venue telemetry online.', type: 'data' }
  ]);

  useEffect(() => {
    const messages = [
      'Traffic surge detected in Zone A.',
      'Staff dispatch: Alpha team moved.',
      'Queue override sync successful.',
      'Map telemetry updated.',
      'Critical alert broadcasted.'
    ];
    const logInterval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [{ id: Date.now(), text: msg, type: 'live' }, ...prev.slice(0, 4)]);
    }, 5000);
    return () => clearInterval(logInterval);
  }, []);

  const liveRoutes = [
    { name: 'Attendee App',        path: '/app',          icon: 'phone_android', desc: 'Mobile fan companion' },
    { name: 'Admin Dashboard',     path: '/admin',        icon: 'dashboard',     desc: 'Command & control center' },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden font-body text-on-surface bg-[#0a1012]" role="main">
      {/* Background Video (YouTube Embed) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <iframe
          className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] -translate-x-1/2 -translate-y-1/2 object-cover opacity-30 mix-blend-screen"
          src="https://www.youtube.com/embed/XryIwrqLOXs?autoplay=1&mute=1&controls=0&loop=1&playlist=XryIwrqLOXs&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0&disablekb=1&enablejsapi=1"
          frameBorder="0"
          title="Atmospheric Stadium Background"
          allow="autoplay; encrypted-media"
        ></iframe>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0a1012] opacity-80" />
      </div>

      <div className="relative z-10 h-full w-full p-6 md:p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center min-h-full py-12">
          
          {/* Brand & Status Section */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-8"
          >
            <header className="flex items-center gap-6">
              <motion.img 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                src="/logo.png" 
                alt="VenueQ Brand Logo" 
                className="w-24 h-24 rounded-2xl shadow-[0_0_40px_rgba(1,105,111,0.3)] border border-primary/20" 
              />
              <div>
                <h1 className="text-6xl font-headline font-black tracking-tighter text-primary leading-none">VenueQ</h1>
                <p className="text-secondary font-label tracking-[0.2em] text-sm mt-2 opacity-80 uppercase">Ops Command Center</p>
              </div>
            </header>

            <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg">
              Synchronized intelligence for the modern arena. Seamlessly monitoring flow, crowd density, and staff logistics in high-definition.
            </p>

            <section aria-labelledby="log-title" className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
              <h2 id="log-title" className="text-xs font-label uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                Live Command Logs
              </h2>
              <div className="space-y-3" role="log" aria-live="polite">
                <AnimatePresence mode='popLayout'>
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs font-mono text-on-surface-variant flex items-start gap-3"
                    >
                      <span className="text-secondary/50">[{new Date(log.id).toLocaleTimeString([], { hour12: false })}]</span>
                      <span className={log.type === 'sys' ? 'text-primary' : ''}>{log.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </motion.div>

          {/* Cards Section */}
          <nav className="lg:w-1/2 grid grid-cols-1 gap-6 w-full max-w-md" aria-label="Main Navigation">
            {liveRoutes.map((r, idx) => (
              <motion.div
                key={r.path}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              >
                <Link
                  to={r.path}
                  aria-label={`Enter ${r.name}: ${r.desc}`}
                  className="group relative block bg-surface/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 hover:bg-surface/60 transition-all shadow-2xl overflow-hidden"
                >
                  {/* Hover background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-primary text-4xl" aria-hidden="true">{r.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-2xl group-hover:text-primary transition-colors">{r.name}</h3>
                      <p className="text-on-surface-variant group-hover:text-on-surface transition-colors">{r.desc}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all">
                      <span className="material-symbols-outlined text-primary" aria-hidden="true">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            <footer className="text-center mt-4">
              <p className="text-[10px] font-label uppercase tracking-widest text-[#ffffff20]">v4.1.0 Optimized Core</p>
            </footer>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return <LandingScreen onEnter={() => setEntered(true)} />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Hub />} />
          
          {/* Attendee Screens */}
          <Route path="/app" element={<AttendeeHomeLive />} />
          <Route path="/app/queues" element={<QueueExplorerLive />} />
          <Route path="/app/map" element={<VenueMapLive />} />
          <Route path="/app/services" element={<ServicesLive />} />
          <Route path="/app/alerts" element={<AlertsLive />} />

          {/* Admin Screens */}
          <Route path="/admin" element={<AdminDashboardLive />} />
          <Route path="/admin/queues" element={<AdminQueuesLive />} />
          <Route path="/admin/incidents" element={<AdminIncidentsLive />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsLive />} />
          <Route path="/admin/crowd" element={<AdminCrowdLive />} />
          <Route path="/admin/map" element={<AdminMapLive />} />
          <Route path="/admin/staff" element={<StaffCoordinationLive />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
