export type RegionId = 'all' | 'americas' | 'europe' | 'apac' | 'mea';

export type ServerHealth = 'nominal' | 'elevated' | 'unreachable';

export type VpnProtocol = 'wireguard' | 'openvpn_udp' | 'openvpn_tcp' | 'ikev2';

export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'killswitch_blocked'
  | 'error';

export type WorkspaceTab =
  | 'overview'
  | 'servers'
  | 'security'
  | 'architecture'
  | 'ux_states';

export type EdgeScenario =
  | 'none'
  | 'permission_required'
  | 'timeout_fallback'
  | 'server_overloaded'
  | 'network_handoff'
  | 'kill_switch_triggered';

export interface ServerNode {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  region: Exclude<RegionId, 'all'>;
  hostname: string;
  exitIp: string;
  latencyMs: number;
  distanceKm: number;
  loadPct: number;
  capacityGbps: number;
  health: ServerHealth;
  /** Normalized SVG coordinates (0..1000 x 0..500) */
  coords: [number, number];
  features: {
    multiHop: boolean;
    streaming: boolean;
    p2p: boolean;
  };
}

export interface SplitTunnelRule {
  id: string;
  name: string;
  type: 'app' | 'cidr' | 'domain';
  target: string;
  mode: 'bypass' | 'vpn_only';
  enabled: boolean;
}

export interface ThroughputPoint {
  timestamp: number;
  downloadMbps: number;
  uploadMbps: number;
}

export interface DeviceSlot {
  id: string;
  name: string;
  platform: 'macOS' | 'iOS' | 'Linux' | 'Windows' | 'Router';
  publicKeyFingerprint: string;
  connectedNode: string | null;
  lastActive: string;
  monthlyUsageGb: number;
}

export interface ArchitectureLayer {
  id: string;
  step: string;
  title: string;
  role: string;
  latencyBudget: string;
  summary: string;
  components: { name: string; detail: string }[];
  privacyInvariants: string[];
  scalingPattern: string;
  failureRecovery: string;
}
