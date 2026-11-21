import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  Cpu,
  Database,
  HardDrive,
  KeyRound,
  Laptop,
  Layers,
  Network,
  Server,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { ARCHITECTURE_LAYERS, DEVICE_SLOTS } from '../data/vpnData';

interface ArchitectureBlueprintProps {
  monthlyCapGb: number;
  usageAlertPct: number;
  onChangeMonthlyCap: (cap: number) => void;
  onChangeUsageAlert: (pct: number) => void;
}

export const ArchitectureBlueprint: React.FC<ArchitectureBlueprintProps> = ({
  monthlyCapGb,
  usageAlertPct,
  onChangeMonthlyCap,
  onChangeUsageAlert,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>(ARCHITECTURE_LAYERS[0].id);
  const [plannedCountries, setPlannedCountries] = useState<number>(36);
  const [futureTab, setFutureTab] = useState<'devices' | 'blind_auth' | 'alerts'>('devices');

  const activeLayer =
    ARCHITECTURE_LAYERS.find((l) => l.id === selectedLayerId) ?? ARCHITECTURE_LAYERS[0];

  const estimatedPops = Math.round(plannedCountries * 1.8);
  const estimatedCapacityTbps = ((estimatedPops * 40) / 1000).toFixed(1);
  const estimatedConcurrentPeers = (estimatedPops * 12500).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <h1 className="font-display text-xl font-semibold text-slate-100">
          System Architecture, Scalability & Growth Plan
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Interactive technical blueprint detailing how the client tunnel daemon, blind-token
          authentication layer, health-probing control plane, and RAM-only regional exit nodes
          operate together at global scale.
        </p>
      </div>

      {/* 1. Interactive 4-Layer Architecture Pipeline */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-100">
              End-to-End Request & Tunnel Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Select any architectural layer below to inspect its components, privacy invariants,
              and failure recovery path
            </p>
          </div>
          <span className="font-mono-tabular text-xs text-slate-400">
            Zero-Trust · Diskless Edge · Stateless Auth
          </span>
        </div>

        {/* 4-Step Horizontal Selector */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {ARCHITECTURE_LAYERS.map((layer, index) => {
            const active = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setSelectedLayerId(layer.id)}
                className={`relative flex flex-col justify-between rounded-md border p-4 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-blue-500/60 bg-blue-950/25'
                    : 'border-slate-800 bg-[#090D16] hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tabular text-xs font-semibold text-blue-400">
                      {layer.step}.
                    </span>
                    {index < ARCHITECTURE_LAYERS.length - 1 && (
                      <ArrowRight className="hidden h-3.5 w-3.5 text-slate-600 md:block" />
                    )}
                  </div>
                  <div className="mt-2 font-display text-sm font-semibold text-slate-100">
                    {layer.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{layer.role}</div>
                </div>
                <div className="mt-3 border-t border-slate-800/80 pt-2 font-mono-tabular text-[11px] text-slate-400">
                  {layer.latencyBudget}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Deep-Dive */}
        <div className="mt-5 rounded-md border border-slate-800 bg-[#090D16] p-5">
          <div className="flex flex-col gap-2 border-b border-slate-800/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-medium text-blue-400">
                Layer {activeLayer.step} · {activeLayer.role}
              </div>
              <h3 className="mt-0.5 font-display text-lg font-semibold text-slate-100">
                {activeLayer.title}
              </h3>
            </div>
            <div className="font-mono-tabular text-xs text-slate-300">
              Target SLA: {activeLayer.latencyBudget}
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">{activeLayer.summary}</p>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                Core Subsystems
              </h4>
              <div className="divide-y divide-slate-800/80 border-t border-slate-800/80">
                {activeLayer.components.map((comp) => (
                  <div key={comp.name} className="py-2.5">
                    <div className="text-xs font-semibold text-slate-100">{comp.name}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-slate-400">
                      {comp.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Privacy & Security Invariants
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {activeLayer.privacyInvariants.map((inv) => (
                    <li key={inv} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="leading-relaxed">{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <div className="text-xs font-semibold text-slate-200">Horizontal Scaling Model</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {activeLayer.scalingPattern}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <div className="text-xs font-semibold text-slate-200">Failure & Failover Behavior</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {activeLayer.failureRecovery}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Multi-Region Expansion & Scalability Planner */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-100">
              Multi-Region Expansion & Capacity Model
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Simulate adding new countries and metro POPs using immutable PXE RAM-disk templates
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="country-slider" className="text-xs font-medium text-slate-300 whitespace-nowrap">
              Target Countries: <span className="font-mono-tabular text-blue-400">{plannedCountries}</span>
            </label>
            <input
              id="country-slider"
              type="range"
              min={15}
              max={110}
              value={plannedCountries}
              onChange={(e) => setPlannedCountries(Number(e.target.value))}
              className="w-44 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-800/80 pt-4 sm:grid-cols-3">
          <div className="rounded-md border border-slate-800 bg-[#090D16] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Server className="h-4 w-4 text-blue-400" />
              Metro POP Clusters
            </div>
            <div className="mt-1.5 font-mono-tabular text-2xl font-semibold text-slate-100">
              {estimatedPops} POPs
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Automated BGP Anycast & IXP cross-connects
            </div>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#090D16] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Network className="h-4 w-4 text-emerald-400" />
              Aggregate Edge Egress
            </div>
            <div className="mt-1.5 font-mono-tabular text-2xl font-semibold text-slate-100">
              {estimatedCapacityTbps} Tbps
            </div>
            <div className="mt-1 text-xs text-slate-500">
              40 Gbps baseline uplink per diskless rack node
            </div>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#090D16] p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Cpu className="h-4 w-4 text-slate-300" />
              Concurrent Encrypted Tunnels
            </div>
            <div className="mt-1.5 font-mono-tabular text-2xl font-semibold text-slate-100">
              {estimatedConcurrentPeers}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Zero-swap RAM peer tables with 24h key rotation
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-400 md:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-md border border-slate-800/80 bg-[#0B111E] p-3">
            <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <div className="font-medium text-slate-200">1. Immutable PXE Provisioning</div>
              <p className="mt-0.5 leading-relaxed">
                New bare-metal nodes netboot a cryptographically signed Linux + WireGuard image into
                tmpfs RAM in under 90 seconds with zero local storage.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-md border border-slate-800/80 bg-[#0B111E] p-3">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <div>
              <div className="font-medium text-slate-200">2. Automatic Directory Sync</div>
              <p className="mt-0.5 leading-relaxed">
                Once synthetic probes pass 3 consecutive latency/loss checks, the control plane signs
                an updated JSON manifest pushed to all clients.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-md border border-slate-800/80 bg-[#0B111E] p-3">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <div>
              <div className="font-medium text-slate-200">3. Graceful Drain & Rebalance</div>
              <p className="mt-0.5 leading-relaxed">
                When node load exceeds 80%, the scoring engine demotes its weight automatically and
                spills new connections to adjacent healthy racks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Future-Ready Growth & Multi-Device Consistency */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-100">
              Future-Ready Growth Capabilities
            </h2>
            <p className="text-xs text-slate-400">
              Multi-device key synchronization, zero-knowledge subscriptions, and proactive usage
              governance
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-md bg-[#090D16] p-1">
            <button
              type="button"
              onClick={() => setFutureTab('devices')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                futureTab === 'devices'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Multi-Device Sync
            </button>
            <button
              type="button"
              onClick={() => setFutureTab('blind_auth')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                futureTab === 'blind_auth'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Subscription Privacy
            </button>
            <button
              type="button"
              onClick={() => setFutureTab('alerts')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                futureTab === 'alerts'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Usage Alerts
            </button>
          </div>
        </div>

        {futureTab === 'devices' && (
          <div className="overflow-x-auto rounded-md border border-slate-800 bg-[#090D16]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-4 py-2.5 font-medium">Device Profile</th>
                  <th className="px-3 py-2.5 font-medium">Platform</th>
                  <th className="px-3 py-2.5 font-medium">WireGuard Public Key</th>
                  <th className="px-3 py-2.5 font-medium">Active Tunnel</th>
                  <th className="px-3 py-2.5 font-medium">Last Seen</th>
                  <th className="px-4 py-2.5 text-right font-medium">Monthly Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {DEVICE_SLOTS.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-2.5 font-medium text-slate-100">
                      <span className="inline-flex items-center gap-2">
                        {dev.platform === 'iOS' ? (
                          <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <Laptop className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        {dev.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{dev.platform}</td>
                    <td className="px-3 py-2.5 font-mono-tabular text-slate-400">
                      {dev.publicKeyFingerprint}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {dev.connectedNode ?? <span className="text-slate-500">Standby</span>}
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">{dev.lastActive}</td>
                    <td className="px-4 py-2.5 text-right font-mono-tabular text-slate-200">
                      {dev.monthlyUsageGb.toFixed(1)} GB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {futureTab === 'blind_auth' && (
          <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-800 bg-[#090D16] p-4 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold text-slate-100">
                Unlinkable Blind Signatures
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Subscription payments verify entitlement once and issue blinded cryptographic
                tokens. The VPN control plane validates token authenticity without ever knowing
                which customer holds it.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100">
                E2E Encrypted Preference Sync
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Pinned server favorites and split-tunnel rules sync across desktop and mobile
                clients using an account-derived AES-GCM vault key that the server cannot decrypt.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100">
                Subscription Tier Governance
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Enforces device concurrency limits (e.g., 6 active WireGuard keys) solely via
                ephemeral key counters—supporting multi-hop and dedicated IP add-ons cleanly.
              </p>
            </div>
          </div>
        )}

        {futureTab === 'alerts' && (
          <div className="grid grid-cols-1 gap-5 rounded-md border border-slate-800 bg-[#090D16] p-4 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                <Bell className="h-4 w-4 text-blue-400" />
                Local Data Allowance & Alert Threshold
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Tracks encrypted interface byte counters locally on-device—never via centralized
                traffic logging—to warn users before mobile or metered plan caps are reached.
              </p>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Monthly Allowance Cap</span>
                <select
                  value={monthlyCapGb}
                  onChange={(e) => onChangeMonthlyCap(Number(e.target.value))}
                  className="rounded border border-slate-800 bg-[#0F1624] px-2.5 py-1 font-mono-tabular text-slate-200"
                >
                  <option value={250}>250 GB</option>
                  <option value={500}>500 GB</option>
                  <option value={1000}>1,000 GB</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Alert Threshold</span>
                <select
                  value={usageAlertPct}
                  onChange={(e) => onChangeUsageAlert(Number(e.target.value))}
                  className="rounded border border-slate-800 bg-[#0F1624] px-2.5 py-1 font-mono-tabular text-slate-200"
                >
                  <option value={70}>70% used</option>
                  <option value={80}>80% used</option>
                  <option value={90}>90% used</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
