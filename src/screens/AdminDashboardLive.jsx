import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useQueues, useZoneDensity, useAlerts, useFetch } from '../hooks/useRealtime';
import { getDashboardMetrics, triggerHalftime, triggerSurge, sendNotification, getZones } from '../lib/api';

/**
 * AdminDashboardLive Component
 * Advanced operational command center with real-time telemetry.
 */
export default function AdminDashboardLive() {
  const { queues } = useQueues();
  const zones = useZoneDensity();
  const { alerts, clearAlert } = useAlerts();
  const { data: metrics, refetch: refetchMetrics } = useFetch(getDashboardMetrics);
  const { data: allZones } = useFetch(getZones);
  const [notifText, setNotifText] = useState('');

  const criticalQueues = queues.filter(q => q.estimated_wait_minutes >= 15).sort((a, b) => b.estimated_wait_minutes - a.estimated_wait_minutes);

  const handleHalftime = async () => {
    await triggerHalftime();
    setTimeout(refetchMetrics, 1000);
  };

  const handleSurge = async () => {
    if (allZones?.length) {
      const randomZone = allZones[Math.floor(Math.random() * allZones.length)];
      await triggerSurge(randomZone._id || randomZone.id);
    }
  };

  const handleBroadcast = async () => {
    if (!notifText.trim()) return;
    await sendNotification({ title: 'Admin Broadcast', message: notifText, severity: 'info', type: 'announcement' });
    setNotifText('');
  };

  return (
    <AdminLayout>
      <main className="space-y-6" role="main">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline text-3xl md:text-4xl text-on-surface font-bold tracking-tight mb-1">Operations Dashboard</h1>
            <p className="text-on-surface-variant text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
              Live Venue Intelligence
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleHalftime} 
              aria-label="Simulate Halftime Surge"
              className="bg-tertiary text-on-tertiary px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">electric_bolt</span>
              Simulate Halftime
            </button>
            <button 
              onClick={handleSurge} 
              aria-label="Trigger Random Zone Surge"
              className="bg-error text-on-error px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">warning</span>
              Trigger Surge
            </button>
          </div>
        </header>

        {/* Metrics Overview (Accessibility: Region) */}
        <section aria-label="Key Performance Indicators" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics && [
            { label: 'Avg Wait Time', value: `${metrics.average_wait_minutes}m`, icon: 'schedule', color: 'text-primary' },
            { label: 'Total In Lines', value: metrics.total_headcount, icon: 'groups', color: 'text-on-surface' },
            { label: 'Critical Zones', value: metrics.critical_zones, icon: 'report_problem', color: metrics.critical_zones > 0 ? 'text-error' : 'text-primary' },
            { label: 'Available Staff', value: `${metrics.available_volunteers}/${metrics.available_volunteers + metrics.active_tasks}`, icon: 'badge', color: 'text-secondary' },
          ].map(m => (
            <article key={m.label} className="bg-surface rounded-lg p-5 border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">{m.label}</span>
                <span className={`material-symbols-outlined text-lg ${m.color}`} aria-hidden="true">{m.icon}</span>
              </div>
              <span className={`font-headline text-3xl font-bold ${m.color}`}>{m.value}</span>
            </article>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Critical Queues Section */}
          <section className="lg:col-span-4 bg-surface rounded-lg p-5 border border-outline-variant/30 shadow-sm">
            <header className="flex justify-between items-center mb-4">
              <h2 className="font-body text-base font-semibold">Critical Queues</h2>
              <span className="text-[10px] uppercase tracking-widest text-error bg-error-container/40 px-2 py-1 rounded font-bold">{criticalQueues.length} Active</span>
            </header>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
              {criticalQueues.map(q => (
                <article key={q.poi_id} className="bg-surface-container-lowest p-3 rounded flex items-center justify-between border-l-2 border-tertiary border border-outline-variant/50">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-on-surface">{q.poi_name}</span>
                    <span className="text-xs text-on-surface-variant">{q.zone_name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-headline text-lg font-bold text-tertiary">{q.estimated_wait_minutes}m</span>
                  </div>
                </article>
              ))}
              {criticalQueues.length === 0 && (
                <p className="text-center text-on-surface-variant text-sm py-4">No critical queues ✓</p>
              )}
            </div>
          </section>

          {/* Monitoring & Broadcasting Container */}
          <div className="lg:col-span-8 space-y-6">
            <section aria-label="Zone Density Heatmap" className="bg-surface rounded-lg p-5 border border-outline-variant/30 shadow-sm">
              <h2 className="font-body text-base font-semibold mb-4">Zone Density</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {zones.map(z => (
                  <article key={z.id} className={`rounded-lg p-4 text-center ${
                    z.severity === 'critical' ? 'bg-error-container/40 border border-error/30' :
                    z.severity === 'warning' ? 'bg-tertiary-container/30 border border-tertiary/20' :
                    'bg-surface-container border border-outline-variant/20'
                  }`}>
                    <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest mb-1">{z.name}</p>
                    <p className={`text-2xl font-headline font-bold ${
                      z.severity === 'critical' ? 'text-error' : z.severity === 'warning' ? 'text-tertiary' : 'text-primary'
                    }`}>{Math.round(z.current_density_score * 100)}%</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Broadcast Terminal */}
            <section aria-label="Broadcast Announcements" className="bg-surface rounded-lg p-5 border border-outline-variant/30 shadow-sm">
              <h2 className="font-body text-base font-semibold mb-3">Broadcast to Attendees</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type an announcement..."
                  aria-label="Broadcast Message Input"
                  value={notifText}
                  onChange={e => setNotifText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBroadcast()}
                  className="flex-1 bg-surface-container border border-outline-variant text-sm text-on-surface px-3 py-2 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                <button 
                  onClick={handleBroadcast} 
                  aria-label="Send Broadcast"
                  className="bg-primary text-on-primary px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-lg" aria-hidden="true">send</span>
                  Send
                </button>
              </div>
            </section>

            <section aria-label="Live Alert Feed" className="bg-surface rounded-lg p-5 border border-outline-variant/30 shadow-sm">
              <h2 className="font-body text-base font-semibold mb-3">Live Alert Feed</h2>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto no-scrollbar" role="log" aria-live="polite">
                {alerts.length === 0 && <p className="text-sm text-on-surface-variant text-center py-4">System stable - no alerts</p>}
                {alerts.map(a => (
                  <article key={a.id} className="flex items-start gap-3 bg-surface-container-lowest p-3 rounded border border-outline-variant/30 text-sm">
                    <span className={`material-symbols-outlined text-lg ${a.type?.includes('critical') ? 'text-error' : 'text-primary'}`} aria-hidden="true">notifications</span>
                    <div className="flex-1">
                      <p className="text-on-surface">{a.message}</p>
                      <time className="text-[10px] text-on-surface-variant mt-1">{new Date(a.time).toLocaleTimeString()}</time>
                    </div>
                    <button 
                       onClick={() => clearAlert(a.id)} 
                       aria-label="Clear Alert"
                       className="text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
