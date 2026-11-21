import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  ServerCrash,
  Star,
  Zap,
} from 'lucide-react';
import { ConnectionState, RegionId, ServerNode } from '../types/vpn';
import { computeSmartScore, REGION_LABELS } from '../data/vpnData';

interface ServerDirectoryProps {
  servers: ServerNode[];
  selectedServer: ServerNode;
  connectionState: ConnectionState;
  favoriteIds: string[];
  onSelectServer: (server: ServerNode) => void;
  onToggleFavorite: (id: string) => void;
  onRefreshHealth: () => void;
  onSimulateOutage: () => void;
  onConnectFastest: () => void;
}

type SortKey = 'smart' | 'latency' | 'load' | 'country';

export const ServerDirectory: React.FC<ServerDirectoryProps> = ({
  servers,
  selectedServer,
  connectionState,
  favoriteIds,
  onSelectServer,
  onToggleFavorite,
  onRefreshHealth,
  onSimulateOutage,
  onConnectFastest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionId>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [healthyOnly, setHealthyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('smart');
  const [isProbing, setIsProbing] = useState(false);

  const handleRefresh = () => {
    setIsProbing(true);
    onRefreshHealth();
    setTimeout(() => setIsProbing(false), 550);
  };

  const filteredServers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return servers
      .filter((s) => {
        if (regionFilter !== 'all' && s.region !== regionFilter) return false;
        if (favoritesOnly && !favoriteIds.includes(s.id)) return false;
        if (healthyOnly && s.health !== 'nominal') return false;
        if (!q) return true;
        return (
          s.country.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.hostname.toLowerCase().includes(q) ||
          s.exitIp.includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'smart') return computeSmartScore(b) - computeSmartScore(a);
        if (sortBy === 'latency') return a.latencyMs - b.latencyMs;
        if (sortBy === 'load') return a.loadPct - b.loadPct;
        return a.country.localeCompare(b.country);
      });
  }, [servers, searchQuery, regionFilter, favoritesOnly, healthyOnly, favoriteIds, sortBy]);

  const nominalCount = servers.filter((s) => s.health === 'nominal').length;
  const elevatedCount = servers.filter((s) => s.health === 'elevated').length;
  const unreachableCount = servers.filter((s) => s.health === 'unreachable').length;

  return (
    <div className="space-y-5">
      {/* Header & Dynamic Health Controls */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-[#0F1624] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-100">
            Global Network & Server Directory
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>{servers.length} regional nodes</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">{nominalCount} nominal</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400">{elevatedCount} elevated load</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-rose-400">{unreachableCount} unreachable</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isProbing ? 'animate-spin' : ''}`} />
            Run Health Probe
          </button>

          <button
            type="button"
            onClick={onSimulateOutage}
            className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-amber-500/50 hover:bg-amber-950/20 whitespace-nowrap cursor-pointer"
          >
            <ServerCrash className="h-3.5 w-3.5 text-amber-400" />
            Simulate Node Overload
          </button>

          <button
            type="button"
            onClick={onConnectFastest}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5" />
            Auto-Select Fastest
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-[#0F1624] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-md bg-[#090D16] p-1">
            {(['all', 'americas', 'europe', 'apac', 'mea'] as RegionId[]).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  regionFilter === region
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {REGION_LABELS[region]}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country, city, hostname, IP..."
              className="w-full rounded-md border border-slate-800 bg-[#090D16] py-2 pl-9 pr-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Secondary Toggles & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFavoritesOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                favoritesOnly
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 bg-[#090D16] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`h-3.5 w-3.5 ${favoritesOnly ? 'fill-amber-400' : ''}`} />
              Pinned Favorites Only
            </button>

            <button
              type="button"
              onClick={() => setHealthyOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                healthyOnly
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-[#090D16] text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Nominal Health Only
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-md border border-slate-800 bg-[#090D16] px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="smart">Smart Recommendation Score</option>
              <option value="latency">Lowest Latency (ms)</option>
              <option value="load">Lowest Server Load (%)</option>
              <option value="country">Country (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Server Data Grid */}
      <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#0F1624]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B111E] text-slate-400">
                <th className="py-3 pl-4 pr-2 font-medium">Pin</th>
                <th className="px-3 py-3 font-medium">Location & Hostname</th>
                <th className="px-3 py-3 font-medium">Region</th>
                <th className="px-3 py-3 font-medium">Capabilities</th>
                <th className="px-3 py-3 text-right font-medium">Smart Score</th>
                <th className="px-3 py-3 text-right font-medium">Latency</th>
                <th className="px-3 py-3 font-medium">Load</th>
                <th className="px-3 py-3 font-medium">Health</th>
                <th className="py-3 pl-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredServers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                    No servers match the active filters. Try clearing your search or region filter.
                  </td>
                </tr>
              ) : (
                filteredServers.map((node) => {
                  const score = computeSmartScore(node);
                  const isSelected = node.id === selectedServer.id;
                  const isConnected = isSelected && connectionState === 'connected';
                  const isFav = favoriteIds.includes(node.id);

                  const capabilityList = [
                    node.features.multiHop ? 'Multi-Hop' : null,
                    node.features.streaming ? 'Media' : null,
                    node.features.p2p ? 'P2P' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ');

                  return (
                    <tr
                      key={node.id}
                      className={`transition-colors hover:bg-slate-800/40 ${
                        isSelected ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 pl-4 pr-2">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(node.id)}
                          aria-label={`Pin ${node.city}`}
                          className="rounded p-1 hover:bg-slate-800 cursor-pointer"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-slate-400'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-slate-100">
                          {node.city}, {node.country}
                        </div>
                        <div className="font-mono-tabular text-[11px] text-slate-500">
                          {node.hostname} · {node.exitIp}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                        {REGION_LABELS[node.region]}
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 whitespace-nowrap">
                        {capabilityList || 'Standard Exit'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono-tabular font-medium text-slate-200">
                        {node.health === 'unreachable' ? '—' : `${score}/100`}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono-tabular text-slate-200 whitespace-nowrap">
                        {node.health === 'unreachable' ? 'Timeout' : `${node.latencyMs} ms`}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-sm bg-slate-800">
                            <div
                              className={`h-full ${
                                node.loadPct >= 80
                                  ? 'bg-rose-500'
                                  : node.loadPct >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${node.loadPct}%` }}
                            />
                          </div>
                          <span className="font-mono-tabular text-slate-300">{node.loadPct}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {node.health === 'nominal' && (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Nominal
                          </span>
                        )}
                        {node.health === 'elevated' && (
                          <span className="inline-flex items-center gap-1.5 text-amber-400">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Elevated
                          </span>
                        )}
                        {node.health === 'unreachable' && (
                          <span className="inline-flex items-center gap-1.5 text-rose-400">
                            <ServerCrash className="h-3.5 w-3.5" />
                            Unreachable
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pl-3 pr-4 text-right">
                        <button
                          type="button"
                          disabled={node.health === 'unreachable'}
                          onClick={() => onSelectServer(node)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                            isConnected
                              ? 'border border-blue-500/40 bg-blue-600/20 text-blue-300'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          {isConnected ? 'Active' : isSelected ? 'Selected' : 'Connect'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
