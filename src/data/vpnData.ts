import { ArchitectureLayer, DeviceSlot, ServerNode, SplitTunnelRule, VpnProtocol } from '../types/vpn';

export const INITIAL_SERVERS: ServerNode[] = [
  {
    id: 'us-nyc-01',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    region: 'americas',
    hostname: 'us-nyc-01.meridian.net',
    exitIp: '198.51.100.42',
    latencyMs: 18,
    distanceKm: 320,
    loadPct: 24,
    capacityGbps: 40,
    health: 'nominal',
    coords: [292, 168],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'us-sfo-02',
    country: 'United States',
    countryCode: 'US',
    city: 'San Francisco',
    region: 'americas',
    hostname: 'us-sfo-02.meridian.net',
    exitIp: '198.51.100.118',
    latencyMs: 64,
    distanceKm: 4120,
    loadPct: 38,
    capacityGbps: 40,
    health: 'nominal',
    coords: [152, 180],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'ca-yyz-01',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    region: 'americas',
    hostname: 'ca-yyz-01.meridian.net',
    exitIp: '203.0.113.19',
    latencyMs: 26,
    distanceKm: 560,
    loadPct: 19,
    capacityGbps: 20,
    health: 'nominal',
    coords: [275, 154],
    features: { multiHop: false, streaming: true, p2p: true },
  },
  {
    id: 'br-gru-01',
    country: 'Brazil',
    countryCode: 'BR',
    city: 'São Paulo',
    region: 'americas',
    hostname: 'br-gru-01.meridian.net',
    exitIp: '203.0.113.84',
    latencyMs: 122,
    distanceKm: 7680,
    loadPct: 52,
    capacityGbps: 20,
    health: 'nominal',
    coords: [358, 342],
    features: { multiHop: false, streaming: true, p2p: false },
  },
  {
    id: 'mx-mex-01',
    country: 'Mexico',
    countryCode: 'MX',
    city: 'Mexico City',
    region: 'americas',
    hostname: 'mx-mex-01.meridian.net',
    exitIp: '203.0.113.205',
    latencyMs: 74,
    distanceKm: 3360,
    loadPct: 44,
    capacityGbps: 10,
    health: 'nominal',
    coords: [208, 232],
    features: { multiHop: false, streaming: true, p2p: false },
  },
  {
    id: 'gb-lhr-01',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    region: 'europe',
    hostname: 'uk-lhr-01.meridian.net',
    exitIp: '192.0.2.34',
    latencyMs: 78,
    distanceKm: 5570,
    loadPct: 31,
    capacityGbps: 40,
    health: 'nominal',
    coords: [484, 136],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'de-fra-01',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt',
    region: 'europe',
    hostname: 'de-fra-01.meridian.net',
    exitIp: '192.0.2.88',
    latencyMs: 86,
    distanceKm: 6200,
    loadPct: 28,
    capacityGbps: 40,
    health: 'nominal',
    coords: [516, 142],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'ch-zrh-01',
    country: 'Switzerland',
    countryCode: 'CH',
    city: 'Zurich',
    region: 'europe',
    hostname: 'ch-zrh-01.meridian.net',
    exitIp: '192.0.2.142',
    latencyMs: 92,
    distanceKm: 6320,
    loadPct: 22,
    capacityGbps: 40,
    health: 'nominal',
    coords: [514, 156],
    features: { multiHop: true, streaming: false, p2p: true },
  },
  {
    id: 'nl-ams-01',
    country: 'Netherlands',
    countryCode: 'NL',
    city: 'Amsterdam',
    region: 'europe',
    hostname: 'nl-ams-01.meridian.net',
    exitIp: '192.0.2.177',
    latencyMs: 82,
    distanceKm: 5860,
    loadPct: 84,
    capacityGbps: 40,
    health: 'elevated',
    coords: [502, 134],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'se-arn-01',
    country: 'Sweden',
    countryCode: 'SE',
    city: 'Stockholm',
    region: 'europe',
    hostname: 'se-arn-01.meridian.net',
    exitIp: '192.0.2.210',
    latencyMs: 98,
    distanceKm: 6340,
    loadPct: 16,
    capacityGbps: 20,
    health: 'nominal',
    coords: [544, 108],
    features: { multiHop: true, streaming: false, p2p: true },
  },
  {
    id: 'es-mad-01',
    country: 'Spain',
    countryCode: 'ES',
    city: 'Madrid',
    region: 'europe',
    hostname: 'es-mad-01.meridian.net',
    exitIp: '192.0.2.229',
    latencyMs: 96,
    distanceKm: 5790,
    loadPct: 37,
    capacityGbps: 20,
    health: 'nominal',
    coords: [476, 174],
    features: { multiHop: false, streaming: true, p2p: false },
  },
  {
    id: 'jp-tyo-01',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    region: 'apac',
    hostname: 'jp-tyo-01.meridian.net',
    exitIp: '198.51.100.201',
    latencyMs: 148,
    distanceKm: 10840,
    loadPct: 41,
    capacityGbps: 40,
    health: 'nominal',
    coords: [866, 184],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'sg-sin-01',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    region: 'apac',
    hostname: 'sg-sin-01.meridian.net',
    exitIp: '198.51.100.224',
    latencyMs: 186,
    distanceKm: 15340,
    loadPct: 33,
    capacityGbps: 40,
    health: 'nominal',
    coords: [776, 268],
    features: { multiHop: true, streaming: true, p2p: true },
  },
  {
    id: 'au-syd-01',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    region: 'apac',
    hostname: 'au-syd-01.meridian.net',
    exitIp: '203.0.113.151',
    latencyMs: 204,
    distanceKm: 15980,
    loadPct: 29,
    capacityGbps: 20,
    health: 'nominal',
    coords: [884, 378],
    features: { multiHop: false, streaming: true, p2p: true },
  },
  {
    id: 'kr-icn-01',
    country: 'South Korea',
    countryCode: 'KR',
    city: 'Seoul',
    region: 'apac',
    hostname: 'kr-icn-01.meridian.net',
    exitIp: '203.0.113.173',
    latencyMs: 154,
    distanceKm: 11060,
    loadPct: 46,
    capacityGbps: 20,
    health: 'nominal',
    coords: [834, 178],
    features: { multiHop: false, streaming: true, p2p: false },
  },
  {
    id: 'in-bom-01',
    country: 'India',
    countryCode: 'IN',
    city: 'Mumbai',
    region: 'apac',
    hostname: 'in-bom-01.meridian.net',
    exitIp: '203.0.113.190',
    latencyMs: 196,
    distanceKm: 12540,
    loadPct: 67,
    capacityGbps: 20,
    health: 'elevated',
    coords: [684, 232],
    features: { multiHop: false, streaming: true, p2p: false },
  },
  {
    id: 'ae-dxb-01',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    region: 'mea',
    hostname: 'ae-dxb-01.meridian.net',
    exitIp: '198.51.100.77',
    latencyMs: 162,
    distanceKm: 11020,
    loadPct: 35,
    capacityGbps: 20,
    health: 'nominal',
    coords: [626, 214],
    features: { multiHop: false, streaming: false, p2p: false },
  },
  {
    id: 'za-jnb-01',
    country: 'South Africa',
    countryCode: 'ZA',
    city: 'Johannesburg',
    region: 'mea',
    hostname: 'za-jnb-01.meridian.net',
    exitIp: '198.51.100.93',
    latencyMs: 218,
    distanceKm: 12830,
    loadPct: 27,
    capacityGbps: 10,
    health: 'nominal',
    coords: [562, 354],
    features: { multiHop: false, streaming: false, p2p: true },
  },
];

export const REGION_LABELS: Record<string, string> = {
  all: 'All Regions',
  americas: 'Americas',
  europe: 'Europe',
  apac: 'Asia-Pacific',
  mea: 'Middle East & Africa',
};

/**
 * Smart server recommendation score (0-100, higher is better).
 * Weights: 50% RTT latency, 30% server CPU/bandwidth load, 20% geographic distance.
 * Unreachable nodes score 0 and are excluded from auto-selection.
 */
export function computeSmartScore(node: ServerNode): number {
  if (node.health === 'unreachable') return 0;
  const latencyScore = Math.max(0, 100 - node.latencyMs * 0.42);
  const loadScore = Math.max(0, 100 - node.loadPct);
  const distanceScore = Math.max(0, 100 - (node.distanceKm / 18000) * 100);
  const healthPenalty = node.health === 'elevated' ? 14 : 0;
  return Math.round(
    Math.max(1, latencyScore * 0.5 + loadScore * 0.3 + distanceScore * 0.2 - healthPenalty)
  );
}

export interface ProtocolSpec {
  id: VpnProtocol;
  name: string;
  cipher: string;
  transport: string;
  handshakeMs: number;
  overheadRating: string;
  bestFor: string;
  summary: string;
}

export const PROTOCOL_SPECS: ProtocolSpec[] = [
  {
    id: 'wireguard',
    name: 'WireGuard',
    cipher: 'ChaCha20-Poly1305 · Curve25519',
    transport: 'UDP / 51820 (Kernel-Space)',
    handshakeMs: 95,
    overheadRating: 'Minimal (32-byte header)',
    bestFor: 'Default for speed, battery life & instant network roaming',
    summary:
      'Modern 4,000-line cryptographic tunnel running directly in OS kernel space with cryptokey routing and stateless roaming.',
  },
  {
    id: 'openvpn_udp',
    name: 'OpenVPN UDP',
    cipher: 'AES-256-GCM · ECDHE-RSA',
    transport: 'UDP / 1194',
    handshakeMs: 380,
    overheadRating: 'Moderate',
    bestFor: 'Legacy compatibility & high-throughput desktop links',
    summary:
      'Battle-tested TLS-based VPN tunnel offering hardware-accelerated AES-256-GCM encryption across restrictive corporate endpoints.',
  },
  {
    id: 'openvpn_tcp',
    name: 'OpenVPN TCP (Stealth)',
    cipher: 'AES-256-GCM · TLS 1.3 Wrapper',
    transport: 'TCP / 443',
    handshakeMs: 620,
    overheadRating: 'Higher (TCP-over-TCP)',
    bestFor: 'Bypassing strict firewalls & captive portals blocking UDP',
    summary:
      'Masks encrypted VPN traffic as standard HTTPS traffic on port 443 when public Wi-Fi or ISP firewalls block UDP packets.',
  },
  {
    id: 'ikev2',
    name: 'IKEv2 / IPsec',
    cipher: 'AES-256-GCM · SHA-384',
    transport: 'UDP / 500 & 4500 (MOBIKE)',
    handshakeMs: 210,
    overheadRating: 'Low',
    bestFor: 'Mobile devices switching frequently between Wi-Fi and 5G',
    summary:
      'Native OS support on iOS and macOS with MOBIKE mobility extension that preserves tunnel sessions across IP changes.',
  },
];

export const INITIAL_SPLIT_RULES: SplitTunnelRule[] = [
  {
    id: 'rule-lan',
    name: 'Local Area Network (RFC 1918)',
    type: 'cidr',
    target: '192.168.0.0/16',
    mode: 'bypass',
    enabled: true,
  },
  {
    id: 'rule-bank',
    name: 'Domestic Banking Portal',
    type: 'domain',
    target: '*.chase.com',
    mode: 'bypass',
    enabled: true,
  },
  {
    id: 'rule-zoom',
    name: 'Video Conferencing (Low Jitter)',
    type: 'app',
    target: 'Zoom Workplace',
    mode: 'bypass',
    enabled: false,
  },
  {
    id: 'rule-dev',
    name: 'Local Docker & Staging Cluster',
    type: 'cidr',
    target: '10.0.0.0/8',
    mode: 'bypass',
    enabled: true,
  },
  {
    id: 'rule-browser',
    name: 'Primary Web Browser',
    type: 'app',
    target: 'Firefox / Chromium',
    mode: 'vpn_only',
    enabled: true,
  },
];

export const DEVICE_SLOTS: DeviceSlot[] = [
  {
    id: 'dev-1',
    name: 'Workstation Pro',
    platform: 'macOS',
    publicKeyFingerprint: 'wg+7xK9...m4Q=',
    connectedNode: 'New York (us-nyc-01)',
    lastActive: 'Active now',
    monthlyUsageGb: 142.8,
  },
  {
    id: 'dev-2',
    name: 'Mobile Phone',
    platform: 'iOS',
    publicKeyFingerprint: 'wg+3pL1...v9A=',
    connectedNode: 'Zurich (ch-zrh-01)',
    lastActive: '14 min ago',
    monthlyUsageGb: 38.4,
  },
  {
    id: 'dev-3',
    name: 'Home Lab Gateway',
    platform: 'Router',
    publicKeyFingerprint: 'wg+9nR4...t2Z=',
    connectedNode: 'Frankfurt (de-fra-01)',
    lastActive: 'Always-on tunnel',
    monthlyUsageGb: 214.1,
  },
  {
    id: 'dev-4',
    name: 'Field Laptop',
    platform: 'Linux',
    publicKeyFingerprint: 'wg+5cW8...k7J=',
    connectedNode: null,
    lastActive: '2 days ago',
    monthlyUsageGb: 19.2,
  },
];

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'client',
    step: '01',
    title: 'Client App & OS Tunnel Engine',
    role: 'Endpoint Encryption & Traffic Policy',
    latencyBudget: '< 1.2 ms packet encapsulation',
    summary:
      'Runs a lightweight UI shell coupled with a privileged system daemon/network extension (utun / Wintun / VpnService) that manages cryptographic keys, split-tunneling routes, DNS interception, and firewall kill-switch rules.',
    components: [
      {
        name: 'Privileged Tunnel Daemon',
        detail: 'Isolated background service owning TUN/TAP interfaces and kernel routing tables so UI restarts never drop the tunnel.',
      },
      {
        name: 'Firewall Kill-Switch Driver',
        detail: 'Applies atomic packet filter rules (pf on macOS, WFP on Windows, nftables on Linux) blocking non-tunnel egress on unexpected drop.',
      },
      {
        name: 'Local Split-Tunnel Classifier',
        detail: 'Matches process UIDs, cgroups, and destination CIDR/SNI routes before packet encapsulation.',
      },
    ],
    privacyInvariants: [
      'Private WireGuard keys are generated locally on-device and never transmitted in plaintext.',
      'DNS queries are intercepted at the local stub resolver and forced exclusively through the encrypted tunnel.',
    ],
    scalingPattern:
      'Stateless client configuration caches signed server manifests locally with 15-minute TTLs for offline resilience.',
    failureRecovery:
      'On interface change (Wi-Fi → 5G), daemon rebinds UDP socket and sends a 1-RTT WireGuard handshake with zero firewall gap.',
  },
  {
    id: 'auth',
    step: '02',
    title: 'Auth & Blind-Token Session Layer',
    role: 'Zero-Knowledge Entitlement Verification',
    latencyBudget: '< 35 ms edge token issuance',
    summary:
      'Separates billing/account identity from network tunneling credentials using cryptographic blind signatures and short-lived ephemeral WireGuard peer registrations.',
    components: [
      {
        name: 'Account & Subscription Service',
        detail: 'Handles user login, device slot quotas (up to 6 public keys), and billing state in an isolated database.',
      },
      {
        name: 'Blind-Signed Access Tokens',
        detail: 'Issues unlinkable RSA/Ristretto blind tokens proving active subscription without revealing user ID to VPN exit nodes.',
      },
      {
        name: 'Ephemeral Peer Registrar',
        detail: 'Registers client WireGuard public key + internal tunnel IP (`10.64.x.x`) into node memory with automatic 24h expiry.',
      },
    ],
    privacyInvariants: [
      'VPN edge nodes never receive email addresses, payment records, or user account IDs.',
      'Internal tunnel IPs are rotated per session and wiped from RAM immediately upon disconnect.',
    ],
    scalingPattern:
      'Horizontally scaled behind Anycast TLS edge proxies; token verification happens locally on edge nodes via public-key cryptography.',
    failureRecovery:
      'Pre-fetched offline session tokens allow uninterrupted reconnection during upstream auth maintenance.',
  },
  {
    id: 'control',
    step: '03',
    title: 'Dynamic Control Plane & Health API',
    role: 'Global Directory, Telemetry & Smart Scoring',
    latencyBudget: '< 45 ms Anycast API response',
    summary:
      'Continuously probes every regional node for packet loss, CPU load, bandwidth saturation, and BGP reachability, publishing signed server directory snapshots to clients.',
    components: [
      {
        name: 'Synthetic Prober Mesh',
        detail: 'Executes 10-second ICMP/UDP health checks and handshake probes across all POPs to detect silent packet blackholes.',
      },
      {
        name: 'Signed Manifest Publisher',
        detail: 'Compiles compressed, Ed25519-signed server lists distributed via global CDN edge caches.',
      },
      {
        name: 'Smart-Route Scoring Engine',
        detail: 'Combines client geo-proximity hints with live node load and RTT to recommend optimal endpoints.',
      },
    ],
    privacyInvariants: [
      'Server load metrics are aggregate interface counters only (Mbps, active peer count)—zero packet inspection or user IP logs.',
      'Client directory fetches use generic regional geo-IP buckets without storing client source addresses.',
    ],
    scalingPattern:
      'Edge-cached static JSON manifests serve millions of clients with sub-1% origin hit rate; telemetry streams over gRPC.',
    failureRecovery:
      'If a node fails 2 consecutive probes, it is marked unreachable in < 20s and clients auto-migrate to the next ranked city.',
  },
  {
    id: 'nodes',
    step: '04',
    title: 'Multi-Region Diskless Server Nodes',
    role: 'RAM-Only Encrypted Packet Forwarding',
    latencyBudget: '< 0.4 ms kernel forwarding overhead',
    summary:
      'Bare-metal servers across 45+ global metro POPs booted from signed read-only PXE RAM images—zero persistent local disks, ensuring physical seizure yields zero user data.',
    components: [
      {
        name: 'Diskless PXE / tmpfs OS',
        detail: 'Entire Linux kernel, WireGuard module, and unbound DNS resolver run strictly in volatile RAM.',
      },
      {
        name: 'In-Tunnel Unbound DNS',
        detail: 'Non-logging recursive DNS resolver listening on `10.64.0.1` with DNSSEC validation and optional tracker blocking.',
      },
      {
        name: 'BGP Anycast & Tier-1 Peering',
        detail: 'Direct 10/40/100 Gbps cross-connects at major IXPs (Equinix, DE-CIX, LINX) minimize hop count and jitter.',
      },
    ],
    privacyInvariants: [
      'Zero swap partitions, zero `/var/log` disk writes, and kernel `conntrack` tables purged on teardown.',
      'Reproducible builds allow independent cryptographic attestation of running server binaries.',
    ],
    scalingPattern:
      'New countries spin up in < 15 minutes via Terraform + Ansible PXE templates; BGP announcements shift traffic seamlessly.',
    failureRecovery:
      'Graceful drain mode signals active clients to migrate before planned kernel upgrades or capacity rebalancing.',
  },
];
