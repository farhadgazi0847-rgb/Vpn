import React, { useState } from 'react';
import {
  Check,
  GlobeLock,
  Network,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Split,
  Trash2,
  Wifi,
} from 'lucide-react';
import { SplitTunnelRule, VpnProtocol } from '../types/vpn';
import { PROTOCOL_SPECS } from '../data/vpnData';

interface SecurityControlsProps {
  protocol: VpnProtocol;
  killSwitchEnabled: boolean;
  strictKillSwitch: boolean;
  dnsLeakProtection: boolean;
  ipv6LeakProtection: boolean;
  autoReconnect: boolean;
  splitTunnelEnabled: boolean;
  splitRules: SplitTunnelRule[];
  onChangeProtocol: (p: VpnProtocol) => void;
  onToggleKillSwitch: () => void;
  onToggleStrictKillSwitch: () => void;
  onToggleDnsProtection: () => void;
  onToggleIpv6Protection: () => void;
  onToggleAutoReconnect: () => void;
  onToggleSplitTunnel: () => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
  onAddRule: (rule: Omit<SplitTunnelRule, 'id'>) => void;
  onSimulateDrop: () => void;
  onSimulateHandoff: () => void;
}

export const SecurityControls: React.FC<SecurityControlsProps> = ({
  protocol,
  killSwitchEnabled,
  strictKillSwitch,
  dnsLeakProtection,
  ipv6LeakProtection,
  autoReconnect,
  splitTunnelEnabled,
  splitRules,
  onChangeProtocol,
  onToggleKillSwitch,
  onToggleStrictKillSwitch,
  onToggleDnsProtection,
  onToggleIpv6Protection,
  onToggleAutoReconnect,
  onToggleSplitTunnel,
  onToggleRule,
  onDeleteRule,
  onAddRule,
  onSimulateDrop,
  onSimulateHandoff,
}) => {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'app' | 'cidr' | 'domain'>('domain');
  const [newTarget, setNewTarget] = useState('');
  const [newMode, setNewMode] = useState<'bypass' | 'vpn_only'>('bypass');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTarget.trim()) return;
    onAddRule({
      name: newName.trim(),
      type: newType,
      target: newTarget.trim(),
      mode: newMode,
      enabled: true,
    });
    setNewName('');
    setNewTarget('');
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <h1 className="font-display text-xl font-semibold text-slate-100">
          Security, Privacy & Connection Stability
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure cryptographic tunnel protocols, atomic kill-switch rules, DNS leak prevention,
          network roaming, and granular split-tunneling policies.
        </p>
      </div>

      {/* 1. Tunnel Protocol & Encryption */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-100">
              VPN Tunnel Protocol & Cipher Suite
            </h2>
            <p className="text-xs text-slate-400">
              Choose the active transport protocol and cryptographic handshake profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PROTOCOL_SPECS.map((spec) => {
            const active = spec.id === protocol;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => onChangeProtocol(spec.id)}
                className={`flex flex-col justify-between rounded-md border p-4 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-blue-500/60 bg-blue-950/25'
                    : 'border-slate-800 bg-[#090D16] hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold text-slate-100">
                      {spec.name}
                    </span>
                    {active && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-400">
                        <Check className="h-3.5 w-3.5" />
                        Active
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-mono-tabular text-xs text-slate-300">
                    {spec.cipher}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{spec.summary}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-800/80 pt-2.5 font-mono-tabular text-[11px] text-slate-400">
                  <span>{spec.transport}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>Handshake ~{spec.handshakeMs} ms</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Kill Switch, DNS Leak Protection & Roaming */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <h2 className="font-display text-base font-semibold text-slate-100">
                  Firewall Kill Switch
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Installs OS packet-filter rules blocking all non-tunnel egress if the VPN drops
                  unexpectedly.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={killSwitchEnabled}
              onClick={onToggleKillSwitch}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                killSwitchEnabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  killSwitchEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
            <label className="flex items-start justify-between gap-3 cursor-pointer">
              <div>
                <div className="font-medium text-slate-200">
                  Strict System-Wide Lock (Block even when manually disconnected)
                </div>
                <div className="mt-0.5 text-slate-400">
                  Keeps firewall rules active across sleep/wake cycles until explicitly disabled.
                </div>
              </div>
              <input
                type="checkbox"
                checked={strictKillSwitch}
                disabled={!killSwitchEnabled}
                onChange={onToggleStrictKillSwitch}
                className="mt-0.5 h-4 w-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <div className="pt-2">
              <button
                type="button"
                onClick={onSimulateDrop}
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#090D16] px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-rose-500/50 hover:bg-rose-950/30 cursor-pointer"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                Simulate Unexpected Tunnel Drop
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
          <div className="mb-4 flex items-start gap-3">
            <GlobeLock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <h2 className="font-display text-base font-semibold text-slate-100">
                Leak Prevention & Seamless Network Roaming
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Prevents ISP DNS queries, IPv6 exposure, and clears Wi-Fi to 5G IP transitions.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="font-medium text-slate-200">
                  In-Tunnel DNS Leak Protection (10.64.0.1)
                </div>
                <div className="mt-0.5 text-slate-400">
                  Forces all UDP/TCP port 53 & DoH lookups through the exit node&apos;s RAM-only Unbound resolver.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={dnsLeakProtection}
                onClick={onToggleDnsProtection}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  dnsLeakProtection ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    dnsLeakProtection ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="font-medium text-slate-200">IPv6 Leak Blocking</div>
                <div className="mt-0.5 text-slate-400">
                  Null-routes unencapsulated IPv6 traffic on dual-stack ISP networks.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={ipv6LeakProtection}
                onClick={onToggleIpv6Protection}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  ipv6LeakProtection ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    ipv6LeakProtection ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="font-medium text-slate-200">
                  Auto-Reconnect & Roaming Socket Migration
                </div>
                <div className="mt-0.5 text-slate-400">
                  Preserves session identity when switching between Wi-Fi and cellular interfaces.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoReconnect}
                onClick={onToggleAutoReconnect}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  autoReconnect ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoReconnect ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-800/80 pt-3">
            <button
              type="button"
              onClick={onSimulateHandoff}
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#090D16] px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-blue-500/50 hover:bg-slate-800 cursor-pointer"
            >
              <Wifi className="h-3.5 w-3.5 text-blue-400" />
              Test Wi-Fi → 5G Roaming Handoff
            </button>
          </div>
        </section>
      </div>

      {/* 3. Split Tunneling Rule Engine */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Split className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <h2 className="font-display text-base font-semibold text-slate-100">
                Split Tunneling Policy Engine
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Route trusted LAN subnets, banking portals, or low-jitter apps directly while keeping
                other traffic encrypted.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400">
              {splitTunnelEnabled ? 'Policy Active' : 'All Traffic Tunneled'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={splitTunnelEnabled}
              onClick={onToggleSplitTunnel}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                splitTunnelEnabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  splitTunnelEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Rule Table */}
        <div className="overflow-x-auto rounded-md border border-slate-800 bg-[#090D16]">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-4 py-2.5 font-medium">Enabled</th>
                <th className="px-3 py-2.5 font-medium">Rule Description</th>
                <th className="px-3 py-2.5 font-medium">Match Type</th>
                <th className="px-3 py-2.5 font-medium">Target / CIDR / Binary</th>
                <th className="px-3 py-2.5 font-medium">Routing Action</th>
                <th className="px-4 py-2.5 text-right font-medium">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {splitRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-900/60">
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      disabled={!splitTunnelEnabled}
                      onChange={() => onToggleRule(rule.id)}
                      className="h-4 w-4 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2.5 font-medium text-slate-200">{rule.name}</td>
                  <td className="px-3 py-2.5 font-mono-tabular uppercase text-slate-400">
                    {rule.type}
                  </td>
                  <td className="px-3 py-2.5 font-mono-tabular text-slate-300">{rule.target}</td>
                  <td className="px-3 py-2.5">
                    {rule.mode === 'bypass' ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-400">
                        <Network className="h-3.5 w-3.5" />
                        Bypass VPN (Direct ISP)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Force Through VPN
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteRule(rule.id)}
                      aria-label={`Delete ${rule.name}`}
                      className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Custom Rule Form */}
        <form
          onSubmit={handleCreateRule}
          className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-12"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Rule label (e.g. Corporate Git)"
            className="rounded-md border border-slate-800 bg-[#090D16] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none sm:col-span-4"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as 'app' | 'cidr' | 'domain')}
            className="rounded-md border border-slate-800 bg-[#090D16] px-2.5 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none sm:col-span-2"
          >
            <option value="domain">Domain</option>
            <option value="cidr">CIDR Subnet</option>
            <option value="app">Application</option>
          </select>
          <input
            type="text"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Target (e.g. *.internal.dev)"
            className="rounded-md border border-slate-800 bg-[#090D16] px-3 py-2 font-mono-tabular text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none sm:col-span-3"
          />
          <select
            value={newMode}
            onChange={(e) => setNewMode(e.target.value as 'bypass' | 'vpn_only')}
            className="rounded-md border border-slate-800 bg-[#090D16] px-2.5 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none sm:col-span-2"
          >
            <option value="bypass">Bypass VPN</option>
            <option value="vpn_only">VPN Only</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500 whitespace-nowrap cursor-pointer sm:col-span-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </form>
      </section>
    </div>
  );
};
