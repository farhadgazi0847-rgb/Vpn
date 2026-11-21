import React from 'react';
import {
  AlertTriangle,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  Zap,
} from 'lucide-react';
import { EdgeScenario } from '../types/vpn';

interface UxStatesExplorerProps {
  activeScenario: EdgeScenario;
  onTriggerScenario: (scenario: EdgeScenario) => void;
}

export const UxStatesExplorer: React.FC<UxStatesExplorerProps> = ({
  activeScenario,
  onTriggerScenario,
}) => {
  const scenarios: {
    id: Exclude<EdgeScenario, 'none'>;
    title: string;
    triggerContext: string;
    uxResponse: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'permission_required',
      title: 'OS Network & VPN Permission Prompt',
      triggerContext: 'First connection on macOS, iOS, or Android when system VPN profile is missing.',
      uxResponse:
        'Presents a calm, plain-language pre-permission card explaining why the local tunnel profile is needed before invoking the OS system dialog.',
      icon: <KeyRound className="h-4 w-4 text-blue-400" />,
    },
    {
      id: 'timeout_fallback',
      title: 'UDP Firewall Timeout & Stealth Fallback',
      triggerContext: 'Hotel, campus, or corporate Wi-Fi drops UDP/51820 WireGuard handshakes.',
      uxResponse:
        'Detects handshake timeout after 4 seconds and offers 1-click fallback to OpenVPN TCP:443 (TLS wrapper) without exposing unprotected traffic.',
      icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    },
    {
      id: 'server_overloaded',
      title: 'Unreachable / Overloaded Node Failover',
      triggerContext: 'Selected exit city reaches >92% saturation or fails synthetic health probe.',
      uxResponse:
        'Pauses connection safely, shows transparent node load status, and proposes the highest-scoring healthy regional neighbor.',
      icon: <RefreshCw className="h-4 w-4 text-amber-400" />,
    },
    {
      id: 'network_handoff',
      title: 'Wi-Fi to 5G Cellular Roaming Handoff',
      triggerContext: 'User walks out of Wi-Fi range while an encrypted session is active.',
      uxResponse:
        'Temporarily holds packet queue under firewall guard, rebinds socket to cellular interface, and completes 1-RTT roam in <300ms.',
      icon: <Wifi className="h-4 w-4 text-emerald-400" />,
    },
    {
      id: 'kill_switch_triggered',
      title: 'Unexpected Drop & Kill Switch Lock',
      triggerContext: 'Upstream tunnel interface terminates unexpectedly mid-session.',
      uxResponse:
        'Immediately engages OS packet filter block (`killswitch_blocked`), announces protection status clearly, and attempts exponential backoff recovery.',
      icon: <ShieldAlert className="h-4 w-4 text-rose-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <h1 className="font-display text-xl font-semibold text-slate-100">
          UX Flows, Prompts & Edge-State Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Test and inspect every critical state transition—from initial OS tunnel permission prompts
          to captive-portal timeouts, overloaded node failover, and kill-switch recovery banners.
        </p>
      </div>

      {/* Scenario Launcher Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((item) => {
          const isActive = activeScenario === item.id;
          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-lg border p-5 transition-colors ${
                isActive
                  ? 'border-blue-500/60 bg-blue-950/20'
                  : 'border-slate-800 bg-[#0F1624]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <h2 className="font-display text-sm font-semibold text-slate-100">
                    {item.title}
                  </h2>
                </div>
                <div className="mt-3 text-xs">
                  <span className="font-semibold text-slate-300">Trigger: </span>
                  <span className="text-slate-400">{item.triggerContext}</span>
                </div>
                <div className="mt-2 text-xs">
                  <span className="font-semibold text-slate-300">UX Response: </span>
                  <span className="text-slate-400">{item.uxResponse}</span>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <button
                  type="button"
                  onClick={() => onTriggerScenario(item.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-xs font-medium text-slate-100 transition-colors hover:bg-blue-600 cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Preview Interactive State
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* UX Information Architecture Principles */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
        <h2 className="font-display text-base font-semibold text-slate-100">
          Interface & Experience Architecture Principles
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-md border border-slate-800 bg-[#090D16] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Unambiguous Trust State
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Connection state never relies on color alone. Every state pairs explicit semantic icons,
              plain-language labels, and live exit vs. masked origin IP verification.
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-[#090D16] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
              <Zap className="h-4 w-4 text-blue-400" />
              One-Click Action Hierarchy
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Primary Connect/Disconnect and Smart Fastest-Server actions sit at the top focal anchor,
              while power features (split-tunneling, protocols) stay cleanly organized in dedicated views.
            </p>
          </div>
          <div className="rounded-md border border-slate-800 bg-[#090D16] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Actionable Error Recovery
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Timeouts and overloaded servers never show cryptic error codes. Every warning banner
              provides an immediate one-click recovery path (e.g., Switch to TCP:443 or Failover Node).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
