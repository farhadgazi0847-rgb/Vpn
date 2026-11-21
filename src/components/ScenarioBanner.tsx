import React from 'react';
import {
  AlertTriangle,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  Wifi,
  X,
} from 'lucide-react';
import { EdgeScenario, ServerNode } from '../types/vpn';

interface ScenarioBannerProps {
  scenario: EdgeScenario;
  selectedServer: ServerNode;
  recommendedNeighbor: ServerNode;
  onDismiss: () => void;
  onGrantPermission: () => void;
  onSwitchToStealthTcp: () => void;
  onFailoverNeighbor: (node: ServerNode) => void;
  onReconnectNow: () => void;
}

export const ScenarioBanner: React.FC<ScenarioBannerProps> = ({
  scenario,
  selectedServer,
  recommendedNeighbor,
  onDismiss,
  onGrantPermission,
  onSwitchToStealthTcp,
  onFailoverNeighbor,
  onReconnectNow,
}) => {
  if (scenario === 'none') return null;

  if (scenario === 'permission_required') {
    return (
      <div className="mb-6 rounded-lg border border-blue-500/40 bg-blue-950/30 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <h3 className="font-display text-sm font-semibold text-slate-100">
                System Network Extension Permission Required
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Meridian needs permission to install a local encrypted tunnel profile (utun /
                Wintun) to route your traffic securely and apply DNS leak protection. No browsing
                history or telemetry leaves your device.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onGrantPermission}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 whitespace-nowrap cursor-pointer"
            >
              Allow &amp; Connect
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss prompt"
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (scenario === 'timeout_fallback') {
    return (
      <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-950/25 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h3 className="font-display text-sm font-semibold text-slate-100">
                UDP Handshake Timed Out on Current Network
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                This Wi-Fi network appears to block UDP port 51820. Switch to OpenVPN TCP on port
                443 to disguise tunnel traffic as standard HTTPS and restore connectivity.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSwitchToStealthTcp}
              className="rounded-md bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-500 whitespace-nowrap cursor-pointer"
            >
              Switch to TCP:443 &amp; Retry
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss alert"
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (scenario === 'server_overloaded') {
    return (
      <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-950/25 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h3 className="font-display text-sm font-semibold text-slate-100">
                Selected Node Saturated or Unreachable ({selectedServer.city})
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Health probes flagged high packet loss on {selectedServer.hostname}. Recommended
                healthy alternative: {recommendedNeighbor.city}, {recommendedNeighbor.country} (
                {recommendedNeighbor.latencyMs} ms · {recommendedNeighbor.loadPct}% load).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onFailoverNeighbor(recommendedNeighbor)}
              className="rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 whitespace-nowrap cursor-pointer"
            >
              Switch to {recommendedNeighbor.city}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss alert"
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (scenario === 'network_handoff') {
    return (
      <div className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-950/25 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Wifi className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <h3 className="font-display text-sm font-semibold text-slate-100">
                Network Interface Roaming Completed
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Detected transition between Wi-Fi and 5G Cellular. WireGuard socket migrated cleanly
                using your active keypair—zero packets leaked outside the tunnel.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // kill_switch_triggered
  return (
    <div className="mb-6 rounded-lg border border-rose-500/50 bg-rose-950/30 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-100">
              Kill Switch Engaged — Unprotected Traffic Blocked
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Your encrypted link dropped unexpectedly. All non-tunnel network packets are blocked by
              the local firewall until the VPN session is re-established.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReconnectNow}
            className="rounded-md bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-500 whitespace-nowrap cursor-pointer"
          >
            Restore Encrypted Tunnel
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
